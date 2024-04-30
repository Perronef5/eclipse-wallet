import { useDriftWallet } from "@/hooks/useDriftWallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useCallback, useState } from "react";

const AirdropButton = () => {
  const { anchorProvider } = useDriftWallet();
  const [isAirdropping, setIsAirdropping] = useState(false);

  const airdropSol = useCallback(async () => {
    if (!anchorProvider) return;

    setIsAirdropping(true);

    try {
      await anchorProvider.connection.requestAirdrop(
        anchorProvider.wallet.publicKey,
        LAMPORTS_PER_SOL
      );
    } catch {}

    setIsAirdropping(false);
  }, [anchorProvider]);

  return (
    <button onClick={airdropSol} className="btn btn-secondary min-w-28">
      {isAirdropping ? (
        <>
          Airdropping...
          <span className="loading loading-spinner"></span>
        </>
      ) : (
        "Airdrop SOL"
      )}
    </button>
  );
};

export default AirdropButton;
