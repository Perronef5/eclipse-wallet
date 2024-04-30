import { useTokenMetadata } from "@/hooks/useTokenMetadata";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useOwnedAmount } from "@helium/helium-react-hooks";
import { toNumber } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import React, { useMemo } from "react";

const TokenListItem = ({ wallet, mint }: { wallet: string; mint: string }) => {
  const mintKey = useMemo(() => new PublicKey(mint), [mint]);
  const walletKey = useMemo(() => new PublicKey(wallet), [wallet]);

  const { tokenPrices } = useTokenPrices();

  const { amount, decimals } = useOwnedAmount(walletKey, mintKey);

  const balance = useMemo(() => {
    if (!decimals) return "-";
    if (!amount) return "-";
    return toNumber(amount, decimals);
  }, [amount, decimals]);

  const balanceInUSD = useMemo(() => {
    const price = tokenPrices?.[mint]?.price;
    if (!price) return "-";
    if (balance === "-") return "-";
    return `$${(balance * price).toFixed(2)}`;
  }, [balance, tokenPrices, mint]);

  const { loading, image, symbol, name } = useTokenMetadata(mintKey);

  return (
    <div className="card p-4 flex bg-[#111]">
      <div className="flex items-center gap-2">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            {symbol === "SOL" && <SolIcon />}
            {symbol !== "SOL" && (
              <Image
                src={image || ""}
                alt={name || ""}
                width={32}
                height={32}
              />
            )}
          </>
        )}
        <div className="flex flex-col flex-1">
          <h2 className="text-white">{name}</h2>

          <div className="flex gap-1">
            <p className="text-slate-500">{balance}</p>
            <p className="text-slate-500">{symbol}</p>
          </div>
        </div>
        <div>
          <p className="text-white">{balanceInUSD}</p>
        </div>
      </div>
    </div>
  );
};

const SolIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 6 7"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.03053 5.075C1.0497 5.05192 1.07287 5.03339 1.09864 5.0205C1.12442 5.00762 1.15227 5.00064 1.18053 5H5.89344C5.9134 5.00031 5.93281 5.00702 5.9494 5.01931C5.966 5.03161 5.97905 5.04897 5.98698 5.0693C5.99491 5.08964 5.99738 5.11208 5.99407 5.13394C5.9908 5.15579 5.98192 5.17613 5.96847 5.1925L4.96947 6.425C4.9503 6.44807 4.92713 6.46661 4.90135 6.4795C4.87558 6.49239 4.84773 6.49936 4.81947 6.5H0.103541C0.0836005 6.49969 0.0641653 6.49298 0.0475735 6.48069C0.0309822 6.46839 0.0179408 6.45103 0.0100181 6.4307C0.00209544 6.41036 -0.000371092 6.38792 0.00291498 6.36606C0.00620106 6.34421 0.0151002 6.32387 0.0285421 6.3075L1.03053 5.075ZM5.97297 4.05333C5.98642 4.0697 5.9953 4.09004 5.99857 4.11189C6.00188 4.13375 5.99941 4.15619 5.99148 4.17653C5.98355 4.19687 5.9705 4.21423 5.9539 4.22652C5.93731 4.23881 5.9179 4.24552 5.89794 4.24583L1.18352 4.25C1.15527 4.24936 1.12742 4.24239 1.10164 4.2295C1.07587 4.21661 1.0527 4.19807 1.03353 4.175L0.0270419 2.94667C0.0136006 2.9303 0.00470146 2.90996 0.00141482 2.88811C-0.00187126 2.86625 0.000595274 2.84381 0.00851797 2.82347C0.0164407 2.80313 0.029482 2.78578 0.0460739 2.77348C0.0626651 2.76119 0.0821003 2.75448 0.102041 2.75417L4.81647 2.75C4.84473 2.75064 4.87258 2.75761 4.89835 2.7705C4.92413 2.78339 4.9473 2.80192 4.96647 2.825L5.97297 4.05333ZM1.03053 0.575C1.0497 0.551926 1.07287 0.53339 1.09864 0.520503C1.12442 0.507616 1.15227 0.500642 1.18053 0.5L5.89647 0.504167C5.91639 0.504479 5.93585 0.511185 5.95244 0.52348C5.96904 0.535775 5.98209 0.553134 5.98996 0.573469C5.99789 0.593804 6.00037 0.61625 5.9971 0.638106C5.99378 0.659962 5.9849 0.680297 5.97145 0.696667L4.96947 1.925C4.9503 1.94807 4.92713 1.96661 4.90135 1.9795C4.87558 1.99239 4.84773 1.99936 4.81947 2H0.103541C0.0836005 1.99969 0.0641653 1.99298 0.0475735 1.98069C0.0309822 1.96839 0.0179408 1.95103 0.0100181 1.9307C0.00209544 1.91036 -0.000371092 1.88792 0.00291498 1.86606C0.00620106 1.84421 0.0151002 1.82387 0.0285421 1.8075L1.03053 0.575Z"
        fill="url(#solana-slim-icon-linear)"
      ></path>
      <linearGradient
        id="solana-slim-icon-linear"
        x1="0.18229"
        y1="6.63083"
        x2="6.40937"
        y2="1.02656"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#9945FF"></stop>
        <stop offset="0.14" stop-color="#8A53F4"></stop>
        <stop offset="0.42" stop-color="#6377D6"></stop>
        <stop offset="0.79" stop-color="#24B0A7"></stop>
        <stop offset="0.99" stop-color="#00D18C"></stop>
        <stop offset="1" stop-color="#00D18C"></stop>
      </linearGradient>
    </svg>
  );
};

export default TokenListItem;
