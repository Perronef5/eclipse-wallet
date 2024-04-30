import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SnapWalletAdapter } from "@drift-labs/snap-wallet-adapter";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import {
  Connection,
  Transaction,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { useAsync } from "react-async-hook";
import {
  AccountLayout,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  getMint,
} from "@solana/spl-token";

type DriftWallet = {
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  anchorProvider: AnchorProvider | null;
  tokenAccounts: TokenAccounts[];
};

type TokenAccounts = {
  tokenAccount: string;
  mint: string;
  balance: number;
  decimals: number;
};

const useDriftWalletHook = (): DriftWallet => {
  const driftSnapWalletAdapter = useMemo(() => new SnapWalletAdapter(), []);
  const [isConnected, setIsConnected] = useState(false);
  const [anchorProvider, setAnchorProvider] = useState<AnchorProvider | null>(
    null
  );
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccounts[]>([]);

  useAsync(async () => {
    if (!anchorProvider) return;

    const tokenAccounts =
      await anchorProvider.connection.getTokenAccountsByOwner(
        anchorProvider.publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

    const atas = await Promise.all(
      tokenAccounts.value.map(async (tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);
        const { mint } = accountData;
        const mintInfo = await getMint(anchorProvider.connection, mint);

        return {
          tokenAccount: tokenAccount.pubkey.toBase58(),
          mint: mint.toBase58(),
          balance: Number(accountData.amount || 0),
          decimals: mintInfo.decimals,
        };
      })
    );

    const solBalance = await anchorProvider.connection.getBalance(
      anchorProvider.publicKey
    );

    // push SOL account
    atas.unshift({
      tokenAccount: anchorProvider.publicKey.toBase58(),
      mint: NATIVE_MINT.toBase58(),
      balance: solBalance,
      decimals: 9,
    });

    setTokenAccounts(atas);
  }, [anchorProvider]);

  const setupAnchorProvider = useCallback(async () => {
    const anchorWallet = {
      signTransaction: async (
        transaction: Transaction | VersionedTransaction
      ) => {
        const tx = await driftSnapWalletAdapter.signTransaction(transaction);
        return tx;
      },
      signAllTransactions: async (
        transactions: Transaction[] | VersionedTransaction[]
      ) => {
        const txs = await driftSnapWalletAdapter.signAllTransactions(
          transactions
        );
        return txs;
      },
      get publicKey() {
        return driftSnapWalletAdapter.publicKey;
      },
    } as Wallet;

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("devnet")
    );

    const anchorProvider = new AnchorProvider(connection, anchorWallet, {
      preflightCommitment: "recent",
      commitment: "recent",
    });

    setAnchorProvider(anchorProvider);
  }, [driftSnapWalletAdapter]);

  const connect = useCallback(async () => {
    await driftSnapWalletAdapter.connect();
  }, [driftSnapWalletAdapter]);

  const disconnect = useCallback(async () => {
    await driftSnapWalletAdapter.disconnect();
  }, [driftSnapWalletAdapter]);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setupAnchorProvider();
  }, [setupAnchorProvider]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setAnchorProvider(null);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error(error);
  }, []);

  useEffect(() => {
    driftSnapWalletAdapter.on("connect", handleConnect);
    driftSnapWalletAdapter.on("disconnect", handleDisconnect);
    driftSnapWalletAdapter.on("error", handleError);

    driftSnapWalletAdapter?.autoConnect();

    return () => {
      driftSnapWalletAdapter.off("connect", handleConnect);
      driftSnapWalletAdapter.off("disconnect", handleDisconnect);
      driftSnapWalletAdapter.off("error", handleError);
    };
  }, [driftSnapWalletAdapter, handleConnect, handleDisconnect, handleError]);

  return {
    connect,
    disconnect,
    isConnected,
    anchorProvider,
    tokenAccounts,
  };
};

export type DriftManager = ReturnType<typeof useDriftWalletHook>;

const DriftContext = createContext<DriftManager | null>(null);

const { Provider } = DriftContext;

const DriftWalletProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useDriftWalletHook()}>{children}</Provider>;
};

const useDriftWallet = (): DriftManager => {
  const context = useContext(DriftContext);
  if (!context) {
    throw new Error(
      "useDriftWalletHook has to be used within <DriftWalletProvider>"
    );
  }
  return context;
};
export { useDriftWallet, DriftWalletProvider };
