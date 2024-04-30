import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useAsync } from "react-async-hook";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useDriftWallet } from "./useDriftWallet";
import { getHeliusAsset } from "@/utils/solana";

const USDC = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
export function useTokenMetadata(mint: PublicKey | undefined): {
  loading: boolean;
  metadata: Metadata | undefined;
  image: string | undefined;
  symbol: string | undefined;
  name: string | undefined;
} {
  const { anchorProvider } = useDriftWallet();

  const { result: json, loading: jsonLoading } = useAsync(
    async (
      provider: AnchorProvider | null,
      tokenMint: PublicKey | undefined
    ) => {
      if (!provider?.connection || !tokenMint) return;
      return getHeliusAsset(provider, tokenMint);
    },
    [anchorProvider, mint]
  );

  if (mint?.equals(NATIVE_MINT)) {
    return {
      metadata: undefined,
      loading: false,
      symbol: "SOL",
      name: "SOL",
      image: "",
    };
  }

  if (mint?.equals(USDC)) {
    return {
      metadata: undefined,
      image: "",
      loading: false,
      symbol: "USDC",
      name: "USDC",
    };
  }

  return {
    loading: jsonLoading,
    image: json?.content?.files?.[0]?.cdn_uri,
    symbol: json?.content?.metadata?.symbol,
    name: json?.content?.metadata?.name,
    metadata: json?.content?.metadata,
  };
}
