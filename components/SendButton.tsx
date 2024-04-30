"use client";

import React, { useCallback, useState } from "react";
import ResponsiveModal from "./ResponsiveModal";
import { createTransferSolTxn } from "@/utils/solana";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useDriftWallet } from "@/hooks/useDriftWallet";
import { bulkSendRawTransactions } from "@helium/spl-utils";

enum ModalState {
  READY,
  SENDING,
  SENT,
}

const SendButton = () => {
  const { anchorProvider } = useDriftWallet();
  const [modalState, setModalState] = useState(ModalState.READY);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const openModal = useCallback(() => {
    (
      document?.getElementById("eclipse-send-modal") as HTMLDialogElement
    )?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    setModalState(ModalState.READY);
    setError(null);
    (
      document?.getElementById("eclipse-send-modal") as HTMLDialogElement
    )?.close();
  }, []);

  const openExplorer = useCallback(() => {
    if (!signature) return;

    window.open(
      `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      "_blank"
    );
  }, [signature]);

  const handleSend = useCallback(async () => {
    // Send SOL
    if (modalState === ModalState.SENDING) return;

    if (!anchorProvider) return;

    const recipientAddress = (
      document.getElementById("recipient") as HTMLInputElement
    )?.value;

    const amount = Number(
      (document.getElementById("amount") as HTMLInputElement)?.value
    );

    if (!recipientAddress || !amount) {
      setError("Please fill out all fields.");
      return;
    }

    setModalState(ModalState.SENDING);

    try {
      const transferTranaction = await createTransferSolTxn(
        anchorProvider,
        recipientAddress,
        amount
      );

      const signedTransaction = await anchorProvider.wallet.signTransaction(
        transferTranaction
      );

      const serializedTransaction = signedTransaction.serialize();

      const sigs = await bulkSendRawTransactions(anchorProvider.connection, [
        serializedTransaction,
      ]);

      if (!sigs || sigs.length === 0) {
        setError("An error occurred. Please try again.");
        setModalState(ModalState.READY);
        return;
      }

      setSignature(sigs[0]);

      setModalState(ModalState.SENT);
    } catch (e) {
      setModalState(ModalState.READY);
      setError((e as Error)?.message || "An error occurred. Please try again.");
    }
  }, [anchorProvider, modalState]);

  const ModalSentContent = useCallback(() => {
    return (
      <>
        <h2 className="text-lg text-center">Sent SOL</h2>
        <p className="text-center">
          <a onClick={openExplorer} className="text-blue-500 cursor-pointer">
            View Transaction
          </a>
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={closeModal} className="btn">
            Close
          </button>
        </div>
      </>
    );
  }, [closeModal, openExplorer]);

  const ModalSendContent = useCallback(() => {
    return (
      <>
        <h2 className="text-lg text-center text-white">Send SOL</h2>
        <div className="flex flex-col gap-4">
          <input
            id="recipient"
            type="text"
            placeholder="Recipient's Solana Address"
            className="input input-bordered w-full bg-[#000] text-white"
          />
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            className="input input-bordered w-full bg-[#000] text-white"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <button onClick={closeModal} className="btn">
            Back
          </button>
          <button
            onClick={handleSend}
            className="btn btn-active btn-secondary"
            disabled={modalState === ModalState.SENDING}
          >
            {modalState === ModalState.SENDING ? (
              <>
                Sending
                <span className="loading loading-spinner"></span>
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </>
    );
  }, [closeModal, error, handleSend, modalState]);

  return (
    <>
      <button
        onClick={openModal}
        className="btn btn-active btn-secondary min-w-28"
      >
        Send
      </button>

      <ResponsiveModal modalId={"eclipse-send-modal"}>
        <div className="pl-8 pr-8 pt-4 pb-4 flex flex-col gap-4">
          {(modalState === ModalState.READY ||
            modalState === ModalState.SENDING) && <ModalSendContent />}
          {modalState === ModalState.SENT && <ModalSentContent />}
        </div>
      </ResponsiveModal>
    </>
  );
};

export default SendButton;
