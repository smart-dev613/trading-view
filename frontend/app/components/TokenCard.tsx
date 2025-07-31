import React from "react";

interface TokenCardProps {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  amount: number;
  logoUrl?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  name,
  symbol,
  price,
  priceChange24h,
  amount,
  logoUrl,
}) => {
  const priceColor =
    priceChange24h > 0
      ? "text-green-400"
      : priceChange24h < 0
      ? "text-red-400"
      : "text-gray-300";
  const formattedChange =
    (priceChange24h > 0 ? "+" : "") + priceChange24h.toFixed(2) + "%";

  return (
    <div className="bg-black rounded-xl shadow flex items-center p-4 mb-4">
      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center mr-4">
        {logoUrl ? (
          <img src={logoUrl} alt={symbol} className="w-8 h-8 object-contain" />
        ) : (
          <span className="text-2xl text-gray-400 font-bold">{symbol[0]}</span>
        )}
      </div>
      <div className="flex-1">
        <div className="text-white font-semibold">{name}</div>
        <div className="text-gray-400 text-sm">${price.toLocaleString()}</div>
      </div>
      <div className="text-right ml-4">
        <div className={`font-bold ${priceColor}`}>{formattedChange}</div>
        <div className="text-gray-300">{amount} {symbol}</div>
      </div>
    </div>
  );
};

export default TokenCard;