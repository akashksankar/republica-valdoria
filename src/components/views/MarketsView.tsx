import React, { useState } from 'react';
import { GameState, Stock } from '../../types/game';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShieldCheck, 
  BarChart2, 
  Layers 
} from 'lucide-react';

interface MarketsViewProps {
  state: GameState;
  onTradeStock: (symbol: string, quantity: number, isBuy: boolean) => void;
  onBuySovereignBond: (amount: number) => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  state,
  onTradeStock,
  onBuySovereignBond,
}) => {
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('TAM');
  const [tradeQuantity, setTradeQuantity] = useState<number>(10);

  const selectedStock = state.stocks.find((s) => s.symbol === selectedStockSymbol) || state.stocks[0];
  const playerHolding = state.player.holdings[selectedStock.symbol]?.shares || 0;
  const totalCost = Number((selectedStock.price * tradeQuantity).toFixed(2));
  const canAffordBuy = state.player.cash >= totalCost;
  const canAffordSell = playerHolding >= tradeQuantity;

  // Render responsive SVG Sparkline / History chart
  const renderChart = (history: number[]) => {
    if (history.length < 2) return null;
    const min = Math.min(...history) * 0.96;
    const max = Math.max(...history) * 1.04;
    const range = max - min || 1;
    const svgWidth = 500;
    const svgHeight = 180;

    const points = history.map((val, idx) => {
      const x = (idx / (history.length - 1)) * svgWidth;
      const y = svgHeight - ((val - min) / range) * svgHeight;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = history[history.length - 1] >= history[0];
    const strokeColor = isPositive ? '#10b981' : '#f43f5e';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <polygon
          fill="url(#chartGrad)"
          points={`0,${svgHeight} ${points} ${svgWidth},${svgHeight}`}
        />
        {/* Current price point dot */}
        {history.length > 0 && (
          <circle
            cx={svgWidth}
            cy={svgHeight - ((history[history.length - 1] - min) / range) * svgHeight}
            r="5"
            fill={strokeColor}
            stroke="#ffffff"
            strokeWidth="2"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Valdoria Stock Exchange (VSE)
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Capital Markets & Securities Terminal
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Trading Session:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> OPEN
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Aurelia Bourse Floor</span>
        </div>
      </div>

      {/* Main Trading Stage: Left Tickers, Right Order Execution & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Listed Equities */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
            <span>Listed Securities</span>
            <span>Price / Day</span>
          </div>

          <div className="space-y-1.5">
            {state.stocks.map((stock) => {
              const isSelected = stock.symbol === selectedStockSymbol;
              const isGain = stock.changePercent >= 0;
              const owned = state.player.holdings[stock.symbol]?.shares || 0;

              return (
                <button
                  key={stock.symbol}
                  id={`stock-row-${stock.symbol}`}
                  onClick={() => setSelectedStockSymbol(stock.symbol)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">{stock.symbol}</span>
                      {owned > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800 font-mono">
                          {owned} sh
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-white">
                      {stock.price.toFixed(2)} VLC
                    </div>
                    <div className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGain ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isGain ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center & Right Column: Detailed Security Chart & Trade Order Desk */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Stock Card & Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-mono text-xl font-bold text-white">{selectedStock.symbol}</h2>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-300">{selectedStock.name}</span>
                </div>
                <div className="text-xs text-amber-400 mt-0.5">{selectedStock.industry}</div>
              </div>

              <div className="text-left sm:text-right">
                <div className="font-mono text-2xl font-bold text-white">
                  {selectedStock.price.toFixed(2)} <span className="text-xs text-slate-400">VLC</span>
                </div>
                <div className={`text-xs font-mono font-bold ${selectedStock.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}% today
                </div>
              </div>
            </div>

            {/* Price Sparkline Graph */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span>Recent Price History (20 Sessions)</span>
                <span>Sentiment: <span className="text-sky-300 font-bold uppercase">{selectedStock.sentiment}</span></span>
              </div>
              {renderChart(selectedStock.history)}
            </div>

            {/* Financial Fundamentals Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400">MARKET CAP</div>
                <div className="font-mono text-xs font-bold text-slate-200">{selectedStock.marketCapBillion}B VLC</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">P/E RATIO</div>
                <div className="font-mono text-xs font-bold text-slate-200">{selectedStock.peRatio}x</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">DIVIDEND YIELD</div>
                <div className="font-mono text-xs font-bold text-emerald-400">{selectedStock.dividendYield}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">YOUR HOLDINGS</div>
                <div className="font-mono text-xs font-bold text-amber-300">{playerHolding} shares</div>
              </div>
            </div>

            {/* Trade Execution Desk */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Order Ticket ({selectedStock.symbol})
                </span>
                <span className="text-xs text-slate-400">
                  Cash: <span className="font-mono text-emerald-400 font-bold">{state.player.cash.toLocaleString()} VLC</span>
                </span>
              </div>

              {/* Preset Quantities */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Shares:</span>
                {[10, 50, 100, 250, 500].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setTradeQuantity(qty)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                      tradeQuantity === qty
                        ? 'bg-sky-600 text-white shadow'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              {/* Cost Calculation & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="font-mono text-xs text-slate-300">
                  Total Order Value: <span className="font-bold text-white text-sm">{totalCost.toLocaleString()} VLC</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`buy-stock-${selectedStock.symbol}`}
                    onClick={() => onTradeStock(selectedStock.symbol, tradeQuantity, true)}
                    disabled={!canAffordBuy}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                      canAffordBuy
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Buy {tradeQuantity} Shares
                  </button>

                  <button
                    id={`sell-stock-${selectedStock.symbol}`}
                    onClick={() => onTradeStock(selectedStock.symbol, tradeQuantity, false)}
                    disabled={!canAffordSell}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                      canAffordSell
                        ? 'bg-rose-600 hover:bg-rose-500 text-white active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Sell {tradeQuantity} Shares
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Sovereign Treasury Bond Window */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-cinzel font-bold text-sm text-white">
                  Republic of Valdoria 10-Year Sovereign Bond
                </h3>
                <p className="text-xs text-slate-400">
                  Guaranteed central sovereign coupon yielding 6.2% annual interest paid monthly
                </p>
              </div>
            </div>

            <button
              id="buy-sovereign-bond-btn"
              onClick={() => onBuySovereignBond(10000)}
              disabled={state.player.cash < 10000}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                state.player.cash >= 10000
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Subscribe (10,000 VLC)
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
