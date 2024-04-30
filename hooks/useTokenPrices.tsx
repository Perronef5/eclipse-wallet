import {
  PriceData,
  PythCluster,
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import React, { Connection } from "@solana/web3.js";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDriftWallet } from "./useDriftWallet";
import { MOBILE_MINT } from "@helium/spl-utils";
import { NATIVE_MINT } from "@solana/spl-token";

type MobilePriceType = {
  fetchMobilePrice: () => void;
  fetchSolPrice: () => void;
  tokenPrices: Record<string, PriceData | undefined>;
};

const useTokenPricesHook = (): MobilePriceType => {
  const { anchorProvider } = useDriftWallet();
  const [tokenPrices, setTokenPrices] = useState<
    Record<string, PriceData | undefined>
  >({});

  const pythClient = useMemo(() => {
    const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
    const connection = new Connection(
      getPythClusterApiUrl(PYTHNET_CLUSTER_NAME)
    );
    const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);
    return new PythHttpClient(connection, pythPublicKey);
  }, []);

  const fetchMobilePrice = useCallback(async () => {
    if (!anchorProvider || !pythClient) return;

    try {
      const data = await pythClient.getData();

      const price = data.productPrice.get("Crypto.MOBILE/USD");
      setTokenPrices((t) => {
        t[MOBILE_MINT.toBase58()] = price;

        return {
          ...t,
        };
      });
    } catch {}
  }, [anchorProvider, pythClient]);

  const fetchSolPrice = useCallback(async () => {
    if (!anchorProvider || !pythClient) return;

    try {
      const data = await pythClient.getData();

      const price = data.productPrice.get("Crypto.SOL/USD");
      setTokenPrices((t) => {
        t[NATIVE_MINT.toBase58()] = price;
        return {
          ...t,
        };
      });
    } catch (e) {
      console.error(e);
    }
  }, [anchorProvider, pythClient]);

  // fetch the prices every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMobilePrice();
      fetchSolPrice();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMobilePrice, fetchSolPrice]);

  return {
    fetchMobilePrice,
    fetchSolPrice,
    tokenPrices,
  };
};

export type TokenPricesManager = ReturnType<typeof useTokenPricesHook>;

const TokenPricesContext = createContext<TokenPricesManager | null>(null);

const { Provider } = TokenPricesContext;

const TokenPricesProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useTokenPricesHook()}>{children}</Provider>;
};

const useTokenPrices = (): TokenPricesManager => {
  const context = useContext(TokenPricesContext);
  if (!context) {
    throw new Error(
      "useTokenPrices has to be used within <TokenPricesProvider>"
    );
  }
  return context;
};
export { useTokenPrices, TokenPricesProvider };
