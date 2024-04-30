import { useCallback, useState } from "react";
import ResponsiveModal from "./ResponsiveModal";
import { useQRCode } from "next-qrcode";
import { useDriftWallet } from "@/hooks/useDriftWallet";
import { ellipsizeAddress } from "@/utils/solana";

const RecieveButton = () => {
  const { anchorProvider } = useDriftWallet();
  const { Image } = useQRCode();
  const [copied, setCopied] = useState(false);

  const openModal = useCallback(() => {
    (
      document?.getElementById("eclipse-recieve-modal") as HTMLDialogElement
    )?.showModal();
  }, []);

  const onClose = useCallback(() => {
    (
      document?.getElementById("eclipse-recieve-modal") as HTMLDialogElement
    )?.close();
  }, []);

  const onCopy = useCallback(() => {
    // set copied to true for 5 seconds
    navigator.clipboard.writeText(anchorProvider?.publicKey?.toBase58() || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  }, [anchorProvider]);

  return (
    <>
      <button
        onClick={openModal}
        className="btn btn-active btn-secondary min-w-28"
      >
        Recieive
      </button>

      <ResponsiveModal modalId="eclipse-recieve-modal">
        <div className="pl-8 pr-8 pt-4 pb-4 flex flex-col gap-4">
          <h2 className="text-lg text-center text-white">Recieve SOL</h2>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            text={anchorProvider?.publicKey?.toBase58() || ""}
            options={{
              type: "image/jpeg",
              quality: 1.0,
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 2,
              width: 200,
              color: {
                dark: "#fff",
                light: "#111",
              },
            }}
          />
          <label className="input input-bordered flex items-center gap-2 bg-[#000]">
            <span className="text-white">Address</span>
            <input
              className="text-slate-500"
              type="text"
              value={ellipsizeAddress(anchorProvider?.publicKey?.toBase58(), {
                chunkSize: 8,
              })}
              disabled={true}
            />
            <button onClick={onCopy} className="badge badge-primary">
              Copy
            </button>
          </label>

          <p className="text-sm text-slate-300 text-center">
            This address can only be used to recieve SOL tokens.
          </p>

          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </ResponsiveModal>

      {copied && (
        <div className="toast toast-end">
          <div className="alert alert-warning">
            <span>{anchorProvider?.publicKey?.toBase58()}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default RecieveButton;
