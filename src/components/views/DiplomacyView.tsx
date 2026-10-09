import React from 'react';
import { GameState, ForeignCountry, TreatyProposal } from '../../types/game';
import { 
  Handshake, 
  FileCheck2, 
  Globe, 
  Shield, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle,
  FileSignature
} from 'lucide-react';

interface DiplomacyViewProps {
  state: GameState;
  onOpenTreatyModal: (treaty: TreatyProposal) => void;
  onSendDiplomaticGift: (countryId: string, cost: number) => void;
}

export const DiplomacyView: React.FC<DiplomacyViewProps> = ({
  state,
  onOpenTreatyModal,
  onSendDiplomaticGift,
}) => {
  const { countries, treaties, player } = state;

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
            Geopolitics & International Commerce
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Diplomatic Corps & Bilateral Accords
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Foreign Envoys:</span>
          <span className="text-emerald-400 font-bold">{countries.length} Embassies Accredited</span>
        </div>
      </div>

      {/* Diplomatic Relationship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => {
          const isAllied = country.stance === 'allied' || country.relationshipScore > 60;
          const isHostile = country.stance === 'hostile' || country.relationshipScore < -20;

          return (
            <div key={country.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                    {country.flagSymbol}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{country.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Capital: {country.capital} • <span className="text-slate-300">{country.regime}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  isAllied ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : isHostile ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-slate-800 text-slate-300'
                }`}>
                  {country.stance}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">TRADE BALANCE</div>
                  <div className={`font-mono font-bold ${country.tradeBalanceMillion >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {country.tradeBalanceMillion >= 0 ? '+' : ''}{country.tradeBalanceMillion}M VLC
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">RELATION SCORE</div>
                  <div className="font-mono font-bold text-sky-400">
                    {country.relationshipScore} / 100
                  </div>
                </div>
              </div>

              {/* Active Treaty or Status */}
              <div className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  {country.activeTreatyTitle || 'No Comprehensive Treaty Active'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  id={`gift-envoy-${country.id}`}
                  onClick={() => onSendDiplomaticGift(country.id, 8000)}
                  disabled={state.player.cash < 8000}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Send Trade Mission (8,000 VLC)
                </button>

                <button
                  id={`view-treaty-${country.id}`}
                  onClick={() => onOpenTreatyModal({
                    id: `treaty_${country.id}_bilateral`,
                    countryId: country.id,
                    title: `Comprehensive Trade & Tariff Protocol`,
                    category: 'trade',
                    status: 'negotiating',
                    steelTariffPercent: 4.0,
                    agroTariffPercent: 2.5,
                    energyImportQuotaPercent: 20.0,
                    portAccessGranted: true,
                    investmentProtectionGuaranteed: true,
                    monthlyEconomicBonusBillion: 0.65,
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  Draft Treaty
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
