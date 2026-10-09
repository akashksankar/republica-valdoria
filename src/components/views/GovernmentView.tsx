import React from 'react';
import { GameState } from '../../types/game';
import { 
  Landmark, 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  HardHat, 
  Scale, 
  Layers 
} from 'lucide-react';

interface GovernmentViewProps {
  state: GameState;
  onBidOnProject: (deptId: string, cost: number) => void;
}

export const GovernmentView: React.FC<GovernmentViewProps> = ({
  state,
  onBidOnProject,
}) => {
  const { budget } = state;
  const isDeficit = budget.fiscalDeficitBillion > 0;

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Sovereign Command & Public Treasury
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            National Budget & Bureaucracy Command Center
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Fiscal Year:</span>
          <span className="text-amber-400 font-bold">{budget.fiscalYear}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Aurelia Ministry of Finance</span>
        </div>
      </div>

      {/* Sovereign Fiscal Health Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenues */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>ANNUAL REVENUES</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {budget.taxRevenueBillion}B <span className="text-xs text-slate-400">VLC</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            Corp Tax: {budget.corporateTaxRate}% • Income: {budget.incomeTaxRate}%
          </div>
        </div>

        {/* Total Expenditures */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>PUBLIC SPENDING</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {budget.totalSpendingBillion}B <span className="text-xs text-slate-400">VLC</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            5 Major Ministerial Portfolios
          </div>
        </div>

        {/* Fiscal Deficit / Surplus */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400 mb-1">
            FISCAL BALANCE
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isDeficit ? `-${budget.fiscalDeficitBillion}B` : `+${budget.fiscalDeficitBillion}B`} <span className="text-xs text-slate-400">VLC</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            {isDeficit ? 'Financed via Sovereign Debt' : 'Transferred to Sovereign Wealth'}
          </div>
        </div>

        {/* Sovereign Debt */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-[11px] text-slate-400 mb-1">
            SOVEREIGN DEBT
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
            {budget.sovereignDebtBillion}B <span className="text-xs text-slate-400">VLC</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            {((budget.sovereignDebtBillion / budget.annualGdpBillion) * 100).toFixed(1)}% of National GDP
          </div>
        </div>
      </div>

      {/* Ministerial Portfolios & Public Procurement Tenders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-400" />
              Executive Ministries & Infrastructure Tenders
            </h2>
            <p className="text-xs text-slate-400">
              Government procurement pipelines and active sovereign capital projects
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.departments.map((dept) => (
            <div key={dept.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm">{dept.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Minister in Charge: <span className="text-slate-300 font-medium">{dept.ministerName}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                  {dept.allocationBillion}B VLC
                </span>
              </div>

              {/* Active Tender */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold uppercase text-[10px]">
                    <HardHat className="w-3.5 h-3.5 text-amber-400" /> Current Tender
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 font-mono">
                    STAGE: TENDER / BIDDING
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {dept.activeProject}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Bureaucratic Efficiency: <span className="text-emerald-400 font-bold">{dept.efficiencyRating}%</span>
                  </span>
                  <button
                    id={`bid-tender-${dept.id}`}
                    onClick={() => onBidOnProject(dept.id, 15000)}
                    disabled={state.player.cash < 15000}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shadow ${
                      state.player.cash >= 15000
                        ? 'bg-sky-600 hover:bg-sky-500 text-white active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Contractor Bid (15,000 VLC)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
