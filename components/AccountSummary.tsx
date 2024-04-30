"use client";

import { useDriftWallet } from "@/hooks/useDriftWallet";
import { useOwnedAmount } from "@helium/helium-react-hooks";
import React, { useEffect, useMemo } from "react";
import { NATIVE_MINT } from "@solana/spl-token";
import { toNumber } from "@helium/spl-utils";
import SendButton from "./SendButton";
import RecieveButton from "./RecieiveButton";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import TokenListItem from "./TokenListItem";

const AccountSummary = () => {
  const { anchorProvider, tokenAccounts } = useDriftWallet();
  const { fetchSolPrice, tokenPrices } = useTokenPrices();

  useEffect(() => {
    fetchSolPrice();
  }, [fetchSolPrice]);

  const { amount, decimals } = useOwnedAmount(
    anchorProvider?.publicKey,
    NATIVE_MINT
  );

  const balance = useMemo(() => {
    if (!decimals) return "-";
    if (!amount) return "-";
    return toNumber(amount, decimals);
  }, [amount, decimals]);

  const balanceInUSD = useMemo(() => {
    const price = tokenPrices?.[NATIVE_MINT.toBase58()]?.price;
    if (!price) return "-";
    if (balance === "-") return "-";
    return `$${(balance * price).toFixed(2)}`;
  }, [balance, tokenPrices]);
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-white text-5xl text-center mt-8">{balanceInUSD}</h2>
      <div className="flex gap-2 justify-center">
        <SendButton />
        <RecieveButton />
      </div>

      {tokenAccounts?.map((tokenAccount) => (
        <TokenListItem
          key={tokenAccount.tokenAccount}
          wallet={anchorProvider?.publicKey.toBase58() || ""}
          mint={tokenAccount.mint}
        />
      ))}
    </div>
  );
};

const AccountSummaryWrapper = () => {
  const { anchorProvider } = useDriftWallet();

  if (!anchorProvider) {
    return null;
  }

  return <AccountSummary />;
};

export default AccountSummaryWrapper;
