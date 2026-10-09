import React from 'react';
import { GameState, RealEstateProperty } from '../../types/game';
import { 
  Building, 
  Home, 
  Landmark, 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Hammer 
} from 'lucide-react';

interface RealEstateViewProps {
  state: GameState;
  onBuyProperty: (propertyId: string) => void;
  onDevelopProperty: (propertyId: string, cost: number) => void;
}

export const RealEstateView: React.FC<RealEstateViewProps> = ({
  state,
  onBuyProperty,
  onDevelopProperty,
}) => {
  const playerProperties = state.properties.filter((p) => p.isPlayerOwned);
  const forSaleProperties = state.properties.filter((p) => !p.isPlayerOwned);

  const totalMonthlyRentalIncome = playerProperties
    .filter((p) => p.status === 'rented')
    .reduce((sum, p) => sum + p.monthlyRent, 0);

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
            Real Estate & Territorial Holdings
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Valdoria Property & Land Register
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Rental Income:</span>
          <span className="text-emerald-400 font-bold">+{totalMonthlyRentalIncome.toLocaleString()} VLC/mo</span>
        </div>
      </div>

      {/* Player Owned Properties */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Home className="w-4 h-4 text-amber-400" />
            Your Property Portfolio ({playerProperties.length})
          </h2>
          <span className="text-xs text-slate-400">
            Yields accrue directly on the 1st of every month
          </span>
        </div>

        {playerProperties.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-6 text-center">
            <p className="text-xs text-slate-400">
              You do not currently hold title deeds to any parcels or buildings in Valdoria.
              Inspect available listings below to acquire commercial studios, industrial yards, or agrarian plots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerProperties.map((prop) => {
              const reg = state.regions.find((r) => r.id === prop.regionId);
              const developCost = Math.round(prop.currentValue * 0.3);
              const canDevelop = state.player.cash >= developCost;

              return (
                <div key={prop.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-white text-sm">{prop.name}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-400" />
                        <span>{reg?.name || prop.regionId}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-300">{prop.type}</span>
                        <span>•</span>
                        <span>{prop.sqMeters.toLocaleString()} m²</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      RENTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">MARKET VALUE</div>
                      <div className="font-mono text-xs font-bold text-amber-300">
                        {prop.currentValue.toLocaleString()} VLC
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">MONTHLY RENT</div>
                      <div className="font-mono text-xs font-bold text-emerald-400">
                        +{prop.monthlyRent.toLocaleString()} VLC
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      Occupancy: <span className="text-white font-bold">{prop.occupancyPercent}%</span>
                    </span>
                    <button
                      id={`develop-prop-${prop.id}`}
                      onClick={() => onDevelopProperty(prop.id, developCost)}
                      disabled={!canDevelop}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        canDevelop
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      Expand/Upgrade ({developCost.toLocaleString()} VLC)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Listings on the Market */}
      <div>
        <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide mb-3 flex items-center gap-2">
          <Building className="w-4 h-4 text-sky-400" />
          Acquisitions & For-Sale Listings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forSaleProperties.map((prop) => {
            const reg = state.regions.find((r) => r.id === prop.regionId);
            const canAfford = state.player.cash >= prop.purchasePrice;

            return (
              <div key={prop.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">{prop.name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span>{reg?.name || prop.regionId}</span>
                      <span>•</span>
                      <span className="capitalize text-slate-300">{prop.type}</span>
                      <span>•</span>
                      <span>{prop.sqMeters.toLocaleString()} m²</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                    FOR SALE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">ASKING PRICE</div>
                    <div className="font-mono text-sm font-bold text-white">
                      {prop.purchasePrice.toLocaleString()} VLC
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">PROJECTED RENT</div>
                    <div className="font-mono text-sm font-bold text-emerald-400">
                      +{prop.monthlyRent.toLocaleString()} VLC/mo
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-400">
                    Gross Yield: <span className="text-emerald-400 font-bold">{((prop.monthlyRent * 12 / prop.purchasePrice) * 100).toFixed(1)}% p.a.</span>
                  </div>
                  <button
                    id={`buy-prop-${prop.id}`}
                    onClick={() => onBuyProperty(prop.id)}
                    disabled={!canAfford}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
                      canAfford
                        ? 'bg-sky-600 hover:bg-sky-500 text-white active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Acquire Title Deed
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
