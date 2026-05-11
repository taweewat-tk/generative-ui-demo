type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export default function StockCard({ data }: { data: StockData }) {
  const isPositive = data.change >= 0;

  return (
    <div className="rounded-xl border border-emerald-800 bg-gradient-to-br from-emerald-950 to-teal-950 p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-emerald-400 uppercase tracking-widest">Stock</p>
          <p className="text-white font-semibold">{data.symbol}</p>
        </div>
        <span className="text-2xl">{isPositive ? '📈' : '📉'}</span>
      </div>

      <p className="text-sm text-emerald-400 mb-2 truncate">{data.name}</p>

      <p className="text-4xl font-bold text-white mb-1">
        ${data.price.toFixed(2)}
      </p>

      <p
        className={`text-sm font-medium ${
          isPositive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {isPositive ? '+' : ''}
        {data.change.toFixed(2)} ({isPositive ? '+' : ''}
        {data.changePercent.toFixed(2)}%)
      </p>
    </div>
  );
}
