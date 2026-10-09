import React from 'react';
import { GameState, GameSpeed } from '../../types/game';
import { 
  Play, 
  Pause, 
  FastForward, 
  Wallet, 
  Landmark, 
  TrendingUp, 
  Award, 
  Crown, 
  HelpCircle,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface TopHUDProps {
  state: GameState;
  onSetSpeed: (speed: GameSpeed) => void;
  onOpenPlayerProfile: () => void;
  onOpenHelp: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  state,
  onSetSpeed,
  onOpenPlayerProfile,
  onOpenHelp,
}) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${state.date.day} ${monthNames[state.date.month - 1]} ${state.date.year}`;
  
  const totalDebt = state.player.loans.reduce((acc, l) => acc + l.balanceRemaining, 0);

  const speedOptions: GameSpeed[] = [0, 1, 2, 5, 10];

  return (
    <header className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 z-30 select-none shadow-xl">
      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Nation Identity & Time System */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3">
          {/* Fictional Republic Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-sky-600 to-indigo-900 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <span className="text-white font-serif-cinzel text-xs font-bold">RV</span>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                REPUBLIC OF VALDORIA
              </div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span className="font-mono-numbers">{formattedDate}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Q{state.date.quarter}
                </span>
              </div>
            </div>
          </div>

          {/* Time Controls (Pause, 1x, 2x, 5x, 10x) */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {speedOptions.map((spd) => {
              const isActive = state.speed === spd;
              return (
                <button
                  key={spd}
                  id={`speed-btn-${spd}`}
                  onClick={() => onSetSpeed(spd)}
                  className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={spd === 0 ? 'Pause' : `Speed ${spd}x`}
                >
                  {spd === 0 ? (
                    <Pause className="w-3 h-3" />
                  ) : spd === 1 ? (
                    '1x'
                  ) : (
                    `${spd}x`
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Player Financial & Influence Terminal */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 sm:gap-4 overflow-x-auto py-1">
          {/* Player Cash */}
          <button
            id="hud-player-cash-btn"
            onClick={onOpenPlayerProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-left shrink-0 group"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CASH</div>
              <div className="font-mono-numbers text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                {state.player.cash.toLocaleString()} VLC
              </div>
            </div>
          </button>

          {/* Monthly Cashflow */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl shrink-0">
            <div className={`w-6 h-6 rounded-lg ${state.player.monthlyCashflow >= 0 ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'} border flex items-center justify-center`}>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">NET CASHFLOW</div>
              <div className={`font-mono-numbers text-xs font-bold ${state.player.monthlyCashflow >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                {state.player.monthlyCashflow >= 0 ? '+' : ''}{state.player.monthlyCashflow.toLocaleString()} /mo
              </div>
            </div>
          </div>

          {/* Net Worth */}
          <button
            id="hud-networth-btn"
            onClick={onOpenPlayerProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-left shrink-0"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">NET WORTH</div>
              <div className="font-mono-numbers text-xs font-bold text-amber-300">
                {state.player.netWorth.toLocaleString()} VLC
              </div>
            </div>
          </button>

          {/* Debt Indicator (If any) */}
          {totalDebt > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-950/40 border border-rose-800/60 rounded-xl shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <div>
                <div className="text-[9px] font-bold text-rose-300 uppercase tracking-wider">DEBT</div>
                <div className="font-mono-numbers text-xs font-bold text-rose-400">
                  {totalDebt.toLocaleString()} VLC
                </div>
              </div>
            </div>
          )}

          {/* Reputation & Political Influence */}
          <button
            id="hud-influence-btn"
            onClick={onOpenPlayerProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-left shrink-0"
          >
            <div className="flex items-center gap-1 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono-numbers text-xs font-bold">{state.player.reputation}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-800" />
            <div className="flex items-center gap-1 text-slate-300">
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-mono-numbers text-xs font-bold">{state.player.politicalInfluence}</span>
            </div>
          </button>

          {/* Guide / Manual Button */}
          <button
            id="hud-help-guide-btn"
            onClick={onOpenHelp}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Strategic Manual & Overview"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
