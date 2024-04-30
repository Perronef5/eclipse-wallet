"use client";

import { useDriftWallet } from "@/hooks/useDriftWallet";
import React, { useCallback } from "react";

const ConnectButton = () => {
  const { connect, disconnect, isConnected } = useDriftWallet();

  const handleConnect = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [connect, disconnect, isConnected]);

  return (
    <button onClick={handleConnect} className="btn btn-neutral">
      {isConnected ? "Disconnect" : "Connect"}
    </button>
  );
};

export default ConnectButton;
