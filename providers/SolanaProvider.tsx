import { useDriftWallet } from "@/hooks/useDriftWallet";
import { AccountFetchCache } from "@helium/account-fetch-cache";
import { AccountContext } from "@helium/account-fetch-cache-hooks";
import React, { ReactNode, useMemo } from "react";

const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const { anchorProvider } = useDriftWallet();

  const cache = useMemo(() => {
    if (!anchorProvider?.connection) return;

    const c = new AccountFetchCache({
      connection: anchorProvider?.connection,
      delay: 100,
      commitment: "confirmed",
      missingRefetchDelay: 60 * 1000,
      extendConnection: true,
    });

    return c;
  }, [anchorProvider]);

  return (
    <AccountContext.Provider value={cache}>{children}</AccountContext.Provider>
  );
};

export default SolanaProvider;
