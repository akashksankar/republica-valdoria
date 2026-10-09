import React from 'react';
import { NavigationTab } from '../../types/game';
import { 
  Globe2, 
  TrendingUp, 
  Briefcase, 
  LineChart, 
  Building, 
  Vote, 
  Landmark, 
  Handshake, 
  Users, 
  Newspaper 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  breakingNewsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  breakingNewsCount = 0,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'world', label: 'WORLD', icon: Globe2 },
    { id: 'economy', label: 'ECONOMY', icon: TrendingUp },
    { id: 'business', label: 'BUSINESS', icon: Briefcase },
    { id: 'markets', label: 'MARKETS', icon: LineChart },
    { id: 'realestate', label: 'ESTATE', icon: Building },
    { id: 'politics', label: 'POLITICS', icon: Vote },
    { id: 'government', label: 'GOV', icon: Landmark },
    { id: 'diplomacy', label: 'DIPLOMACY', icon: Handshake },
    { id: 'people', label: 'PEOPLE', icon: Users },
    { id: 'news', label: 'NEWS', icon: Newspaper, badge: breakingNewsCount },
  ];

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 text-slate-400 select-none z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[58px] sm:min-w-[70px] py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-sky-400 font-bold bg-sky-950/60 border border-sky-600/40 shadow-inner'
                  : 'hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-wider mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-6 h-0.5 bg-sky-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
