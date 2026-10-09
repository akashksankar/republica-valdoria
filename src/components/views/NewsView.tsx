import React from 'react';
import { GameState } from '../../types/game';
import { 
  Newspaper, 
  Radio, 
  AlertCircle, 
  TrendingUp, 
  Building2, 
  Vote, 
  Landmark 
} from 'lucide-react';

interface NewsViewProps {
  state: GameState;
}

export const NewsView: React.FC<NewsViewProps> = ({ state }) => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'economy': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'politics': return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'business': return 'bg-sky-950 text-sky-400 border-sky-800';
      case 'markets': return 'bg-amber-950 text-amber-400 border-amber-800';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Valdoria Press Syndicate
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            The National Chronicle & Wire
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span className="text-slate-300">Live Simulation Wire Feed</span>
        </div>
      </div>

      {/* News Feed Articles */}
      <div className="space-y-3">
        {state.news.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${getCategoryBadge(item.category)}`}>
                  {item.category}
                </span>
                {item.impact === 'breaking' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold uppercase animate-pulse">
                    BREAKING
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400">{item.dateStr}</span>
            </div>

            <h2 className="font-bold text-white text-base leading-snug">
              {item.title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
