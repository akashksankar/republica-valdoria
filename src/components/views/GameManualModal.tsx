import React from 'react';
import { X, Globe2, TrendingUp, Briefcase, Landmark, Vote, BookOpen } from 'lucide-react';

interface GameManualModalProps {
  onClose: () => void;
}

export const GameManualModal: React.FC<GameManualModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
              STRATEGIC COMPENDIUM & FIELD MANUAL
            </span>
            <h2 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white">
              The Republic of Valdoria Simulation
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-400" /> Core Philosophy
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              You do not control the entire world. Valdoria’s economy, companies, parliament, markets, and foreign nations run independently on deterministic daily simulation ticks. You begin as an ambitious private citizen with 25,000 VLC and shape your destiny through strategic decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> 1. Commercial Empire
              </div>
              <p className="text-[11px] text-slate-400">
                Incept enterprises in key regional hubs (Port Azure logistics, Novara tech, Ironvale foundries). Upgrade tiers to compound monthly net profit.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> 2. VSE Capital Markets
              </div>
              <p className="text-[11px] text-slate-400">
                Trade corporate shares on the Valdoria Stock Exchange. Track P/E, sentiment, dividends, and Central Bank interest rate shifts.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-purple-400 text-xs flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5" /> 3. Political Hegemony
              </div>
              <p className="text-[11px] text-slate-400">
                Join a political party (NDP, FMA, SDU, GFP). Donate funds to build influence, run for Municipal Council or Member of Parliament.
              </p>
            </div>

            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> 4. High Statecraft
              </div>
              <p className="text-[11px] text-slate-400">
                Sponsor sovereign tenders in the National Budget, ratify bilateral trade accords with foreign powers, and build alliances with prominent NPCs.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Enter Simulation
          </button>
        </div>

      </div>
    </div>
  );
};
