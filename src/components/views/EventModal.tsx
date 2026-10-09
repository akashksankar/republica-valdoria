import React from 'react';
import { DynamicSimEvent } from '../../types/game';
import { 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface EventModalProps {
  event: DynamicSimEvent;
  onSelectOption: (option: DynamicSimEvent['options'][0]) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onSelectOption }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Event Category Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
              STATE DILEMMA & CRISIS DESK
            </span>
            <div className="text-xs text-slate-400 capitalize">{event.category.replace('_', ' ')} • Source: {event.source}</div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
            {event.title}
          </h2>
          <div className="text-xs text-amber-300 font-medium">{event.subtitle}</div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            {event.description}
          </p>
        </div>

        {/* Decision Options */}
        <div className="space-y-2.5 pt-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Select Executive Course of Action:
          </div>

          {event.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt)}
              className="w-full p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/60 rounded-2xl text-left transition-all group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                  {opt.label}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                  COMMIT
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {opt.detail}
                {opt.costCash ? <span className="text-rose-400 ml-2">Cost: {opt.costCash.toLocaleString()} VLC</span> : null}
                {opt.cashReward ? <span className="text-emerald-400 ml-2">Reward: +{opt.cashReward.toLocaleString()} VLC</span> : null}
                {opt.reputationChange ? <span className="text-amber-400 ml-2">Rep: +{opt.reputationChange}</span> : null}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
