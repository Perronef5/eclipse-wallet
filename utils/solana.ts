import { AnchorProvider } from "@coral-xyz/anchor";
import { withPriorityFees } from "@helium/spl-utils";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const createTransferSolTxn = async (
  anchorProvider: AnchorProvider,
  recipient: string,
  amount: number
) => {
  const payer = anchorProvider.publicKey;
  const lamports = amount * LAMPORTS_PER_SOL;

  const instructions: TransactionInstruction[] = [
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(recipient),
      lamports,
    }),
  ];

  const ixsWithPriorityFee = await withPriorityFees({
    connection: anchorProvider.connection,
    instructions,
    computeUnits: 200000,
    basePriorityFee: 100000,
  });

  const { blockhash } = await anchorProvider.connection.getLatestBlockhash();

  const transaction = new Transaction();

  ixsWithPriorityFee.forEach((instruction) => {
    transaction.add(instruction);
  });

  transaction.feePayer = payer;
  transaction.recentBlockhash = blockhash;

  return transaction;
};

export const ellipsizeAddress = (
  address?: string | null,
  opts?: { chunkSize?: number }
) => {
  if (!address) return "";
  const chunkSize = opts?.chunkSize || 8;
  return [address.slice(0, chunkSize), address.slice(-1 * chunkSize)].join(
    "..."
  );
};

export const getHeliusAsset = async (
  anchorProvider: AnchorProvider,
  mint: PublicKey
) => {
  const response = await fetch(anchorProvider.connection.rpcEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAsset",
      params: {
        id: mint.toBase58(),
      },
    }),
  });
  const { result } = await response.json();

  return result;
};
