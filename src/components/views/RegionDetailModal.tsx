import React from 'react';
import { Region, GameState } from '../../types/game';
import { 
  Building2, 
  MapPin, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Home, 
  Briefcase, 
  X,
  Plus
} from 'lucide-react';

interface RegionDetailModalProps {
  region: Region;
  state: GameState;
  onClose: () => void;
  onFoundEnterpriseHere: (regionId: string) => void;
  onViewRealEstate: () => void;
}

export const RegionDetailModal: React.FC<RegionDetailModalProps> = ({
  region,
  state,
  onClose,
  onFoundEnterpriseHere,
  onViewRealEstate,
}) => {
  const dominantParty = state.parties.find((p) => p.id === region.dominantPartyId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Region Header */}
        <div className="flex items-start gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-serif-cinzel font-bold text-xl shadow-lg shrink-0"
            style={{ backgroundColor: region.highlightColor }}
          >
            {region.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                DISTRICT: {region.type}
              </span>
              <span className="text-xs text-amber-400 font-semibold">{region.tagline}</span>
            </div>
            <h2 className="font-serif-cinzel text-2xl font-bold text-white mt-0.5">
              {region.name}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {region.description}
        </p>

        {/* Key Strategic Facility */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              KEY STRATEGIC INFRASTRUCTURE
            </div>
            <div className="font-bold text-white text-sm mt-0.5">
              {region.keyFacility.name}
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
            {region.keyFacility.status.toUpperCase()}
          </span>
        </div>

        {/* Regional Indicator Matrix */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">POPULATION</div>
            <div className="font-mono text-xs font-bold text-sky-400 mt-0.5">
              {(region.population / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">REGIONAL GDP</div>
            <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">
              {region.gdpBillion}B VLC
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">UNEMPLOYMENT</div>
            <div className="font-mono text-xs font-bold text-slate-200 mt-0.5">
              {region.unemploymentPercent}%
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">WEALTH SCORE</div>
            <div className="font-mono text-xs font-bold text-amber-300 mt-0.5">
              {region.wealthScore} / 100
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">AVG LAND PRICE</div>
            <div className="font-mono text-xs font-bold text-teal-300 mt-0.5">
              {region.avgLandPriceSqM} VLC/m²
            </div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400">DOMINANT PARTY</div>
            <div className="font-bold text-xs text-purple-400 mt-0.5 truncate">
              {dominantParty?.abbreviation || 'Independent'}
            </div>
          </div>
        </div>

        {/* Direct Action Shortcuts */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onViewRealEstate();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Inspect Local Real Estate
          </button>
          <button
            onClick={() => {
              onClose();
              onFoundEnterpriseHere(region.id);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Found Venture in {region.name}
          </button>
        </div>

      </div>
    </div>
  );
};
