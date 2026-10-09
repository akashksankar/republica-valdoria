import React from 'react';
import { GameState } from '../../types/game';
import { 
  TrendingUp, 
  Percent, 
  Users, 
  Coins, 
  BarChart3, 
  ShieldAlert, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  Flame
} from 'lucide-react';

interface EconomyViewProps {
  state: GameState;
  onInspectRegion: (regionId: string) => void;
}

export const EconomyView: React.FC<EconomyViewProps> = ({ state, onInspectRegion }) => {
  const { macro, regions } = state;

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Sovereign Economic Architecture
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Republic of Valdoria Macroeconomy
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Currency:</span>
          <span className="text-amber-400 font-bold">Valdor Crown (VLC)</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400">FX 1.00 USD = {macro.foreignExchangeVLCPerUSD} VLC</span>
        </div>
      </div>

      {/* Primary Macro Indicator Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* GDP Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>GROSS DOMESTIC PRODUCT</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">
            {macro.gdpTotalBillion}B <span className="text-xs text-slate-400">VLC</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className={`flex items-center font-bold font-mono-numbers ${macro.gdpGrowthRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {macro.gdpGrowthRate >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {macro.gdpGrowthRate}%
            </span>
            <span className="text-slate-500">annualized rate</span>
          </div>
        </div>

        {/* Inflation Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>HEADLINE INFLATION</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-amber-400">
            {macro.inflationRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Target: 2.0% - 3.0%</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
              {macro.inflationRate > 3.0 ? 'Elevated' : 'Controlled'}
            </span>
          </div>
        </div>

        {/* Central Bank Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>CENTRAL BANK RATE</span>
            <Coins className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-sky-300">
            {macro.centralBankInterestRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Governor Elena Vance • <span className="text-slate-300">Monetary Discipline</span>
          </div>
        </div>

        {/* Unemployment */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>UNEMPLOYMENT RATE</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-slate-200">
            {macro.unemploymentRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Avg Wage: {macro.averageWageVLC} VLC</span>
            <span className="text-emerald-400 font-bold">Stable</span>
          </div>
        </div>
      </div>

      {/* Strategic Commodities Market */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide">
              Strategic Commodity & Industrial Inputs
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Valdoria Mercantile Clearing</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Crude Petroleum</div>
            <div className="font-mono text-base font-bold text-white mt-1">
              ${macro.commodities.oilBarrel} <span className="text-xs text-slate-500">/ bbl</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">+1.4% (Steady)</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Industrial Steel</div>
            <div className="font-mono text-base font-bold text-white mt-1">
              ${macro.commodities.steelTon} <span className="text-xs text-slate-500">/ ton</span>
            </div>
            <div className="text-[10px] text-amber-400 mt-1 font-mono">Ironvale Base</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Hard Wheat</div>
            <div className="font-mono text-base font-bold text-white mt-1">
              ${macro.commodities.wheatBushel} <span className="text-xs text-slate-500">/ bu</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">Greenridge Basin</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Quantum Silicon Index</div>
            <div className="font-mono text-base font-bold text-white mt-1">
              ${macro.commodities.techSiliconIndex}
            </div>
            <div className="text-[10px] text-purple-400 mt-1 font-mono">Novara High-Tech</div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
            <div className="text-[11px] text-slate-400">Sovereign Gold</div>
            <div className="font-mono text-base font-bold text-white mt-1">
              ${macro.commodities.goldOunce} <span className="text-xs text-slate-500">/ oz</span>
            </div>
            <div className="text-[10px] text-yellow-400 mt-1 font-mono">Central Reserve</div>
          </div>
        </div>
      </div>

      {/* Regional Output Leaderboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide">
              Regional Economic Contribution & Output
            </h2>
            <p className="text-xs text-slate-400">
              Comparative macroeconomic performance across Valdoria’s 8 major territorial districts
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Territory</th>
                <th className="py-2.5 px-3">Role / Biome</th>
                <th className="py-2.5 px-3">GDP Output</th>
                <th className="py-2.5 px-3">Annual Growth</th>
                <th className="py-2.5 px-3">Unemployment</th>
                <th className="py-2.5 px-3">Infra Score</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.highlightColor }} />
                      <span className="font-bold text-white text-sm">{reg.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 capitalize">{reg.type}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{reg.gdpBillion}B VLC</td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-400">+{reg.gdpGrowthPercent}%</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{reg.unemploymentPercent}%</td>
                  <td className="py-3 px-3">
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-500 h-full rounded-full" 
                        style={{ width: `${reg.infrastructureScore}%` }} 
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onInspectRegion(reg.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 hover:text-white rounded-lg text-slate-300 transition-colors text-[11px] font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
