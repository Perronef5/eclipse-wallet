"use client";

import { DriftWalletProvider } from "@/hooks/useDriftWallet";
import { TokenPricesProvider } from "@/hooks/useTokenPrices";
import SolanaProvider from "@/providers/SolanaProvider";
import { ReactNode } from "react";

const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DriftWalletProvider>
      <SolanaProvider>
        <TokenPricesProvider>{children}</TokenPricesProvider>
      </SolanaProvider>
    </DriftWalletProvider>
  );
};

export default MainProvider;
