import React, { useState } from 'react';
import { GameState, Business, BusinessIndustry } from '../../types/game';
import { 
  Briefcase, 
  Plus, 
  Building2, 
  TrendingUp, 
  Users, 
  ArrowUpCircle, 
  CheckCircle2, 
  Ship, 
  Cpu, 
  Hammer, 
  Wheat, 
  ShoppingBag,
  DollarSign
} from 'lucide-react';

interface BusinessViewProps {
  state: GameState;
  onFoundBusiness: (data: { name: string; industry: BusinessIndustry; regionId: string; startupCost: number }) => void;
  onUpgradeBusiness: (bizId: string, upgradeCost: number) => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  state,
  onFoundBusiness,
  onUpgradeBusiness,
}) => {
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizIndustry, setNewBizIndustry] = useState<BusinessIndustry>('logistics');
  const [newBizRegionId, setNewBizRegionId] = useState('port_azure');

  const playerBusinesses = state.businesses.filter((b) => b.ownerType === 'player');
  const otherBusinesses = state.businesses.filter((b) => b.ownerType !== 'player');

  const STARTUP_COSTS: Record<BusinessIndustry, number> = {
    logistics: 20000,
    technology: 25000,
    manufacturing: 30000,
    agriculture: 15000,
    hospitality: 18000,
    retail: 12000,
    energy: 45000,
    media: 22000,
    banking: 80000,
    real_estate: 35000,
  };

  const currentStartupCost = STARTUP_COSTS[newBizIndustry] || 20000;
  const canAffordNew = state.player.cash >= currentStartupCost;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !canAffordNew) return;

    onFoundBusiness({
      name: newBizName.trim(),
      industry: newBizIndustry,
      regionId: newBizRegionId,
      startupCost: currentStartupCost,
    });

    setNewBizName('');
    setShowFoundModal(false);
  };

  const getIndustryIcon = (industry: BusinessIndustry) => {
    switch (industry) {
      case 'logistics': return Ship;
      case 'technology': return Cpu;
      case 'manufacturing': return Hammer;
      case 'agriculture': return Wheat;
      case 'retail': return ShoppingBag;
      default: return Building2;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
            Corporate Operations & Equity
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Enterprise Management Desk
          </h1>
        </div>
        <button
          id="found-new-biz-btn"
          onClick={() => setShowFoundModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Found New Enterprise
        </button>
      </div>

      {/* Player Owned Enterprises Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" />
            Your Controlled Enterprises ({playerBusinesses.length})
          </h2>
          <span className="text-xs text-slate-400">
            Monthly Profits Disburse Directly into Personal Cash
          </span>
        </div>

        {playerBusinesses.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-200 mb-1">No Active Enterprises Founded Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
              You currently operate as an independent player. Incept a logistics depot in Port Azure, a tech lab in Novara, or an agricultural syndicate in Greenridge to start compounding monthly cashflow.
            </p>
            <button
              id="empty-found-biz-btn"
              onClick={() => setShowFoundModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow"
            >
              Found Your First Enterprise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerBusinesses.map((biz) => {
              const IconComp = getIndustryIcon(biz.industry);
              const regionObj = state.regions.find((r) => r.id === biz.regionId);
              const upgradeCost = Math.round(biz.valuation * 0.15);
              const canUpgrade = state.player.cash >= upgradeCost;

              return (
                <div key={biz.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{biz.name}</h3>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="capitalize">{biz.industry}</span>
                          <span>•</span>
                          <span className="text-sky-400">{regionObj?.name || biz.regionId}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">Tier {biz.level}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-mono">
                      OWNED 100%
                    </span>
                  </div>

                  {/* Financial Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">MONTHLY REV</div>
                      <div className="font-mono text-xs font-bold text-slate-200">
                        {biz.monthlyRevenue.toLocaleString()} VLC
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">EXPENSES</div>
                      <div className="font-mono text-xs font-bold text-rose-400">
                        {biz.monthlyExpenses.toLocaleString()} VLC
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">NET PROFIT</div>
                      <div className="font-mono text-xs font-bold text-emerald-400">
                        +{biz.netProfit.toLocaleString()} VLC
                      </div>
                    </div>
                  </div>

                  {/* Operations & Upgrades */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{biz.employees} workforce</span>
                    </div>

                    <button
                      id={`upgrade-biz-${biz.id}`}
                      onClick={() => onUpgradeBusiness(biz.id, upgradeCost)}
                      disabled={!canUpgrade}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        canUpgrade
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      Upgrade Tier ({upgradeCost.toLocaleString()} VLC)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* National Corporate Leaders / Competitors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide">
              Valdoria Corporate Registry & Market Leaders
            </h2>
            <p className="text-xs text-slate-400">
              National commercial conglomerates competing across the Republic
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Enterprise</th>
                <th className="py-2.5 px-3">Industry</th>
                <th className="py-2.5 px-3">Headquarters</th>
                <th className="py-2.5 px-3">Proprietor / Board</th>
                <th className="py-2.5 px-3">Valuation</th>
                <th className="py-2.5 px-3 text-right">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {otherBusinesses.map((biz) => {
                const reg = state.regions.find((r) => r.id === biz.regionId);
                return (
                  <tr key={biz.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{biz.name}</td>
                    <td className="py-3 px-3 text-slate-400 capitalize">{biz.industry}</td>
                    <td className="py-3 px-3 text-sky-400">{reg?.name || biz.regionId}</td>
                    <td className="py-3 px-3 text-slate-300">{biz.ownerName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">
                      {(biz.valuation / 1000000).toFixed(1)}M VLC
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {biz.marketSharePercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Found New Business */}
      {showFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h3 className="font-serif-cinzel text-lg font-bold text-white">
                  Found New Commercial Enterprise
                </h3>
              </div>
              <button
                onClick={() => setShowFoundModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Enterprise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Azure Vanguard Shipping"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={newBizIndustry}
                    onChange={(e) => setNewBizIndustry(e.target.value as BusinessIndustry)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="logistics">Logistics & Freight (Port Azure)</option>
                    <option value="technology">Software & Silicon (Novara)</option>
                    <option value="manufacturing">Heavy Metallurgy (Ironvale)</option>
                    <option value="agriculture">Agriculture & Milling (Greenridge)</option>
                    <option value="hospitality">Resorts & Luxury (Solmere)</option>
                    <option value="retail">Consumer Goods (Eastford)</option>
                    <option value="energy">Geothermal & Power (Northmark)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Incorporation Territory
                  </label>
                  <select
                    value={newBizRegionId}
                    onChange={(e) => setNewBizRegionId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {state.regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Startup Capital Requirement */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Required Inception Capital</div>
                  <div className="font-mono text-base font-bold text-amber-400">
                    {currentStartupCost.toLocaleString()} VLC
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Your Available Cash</div>
                  <div className={`font-mono text-sm font-bold ${canAffordNew ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {state.player.cash.toLocaleString()} VLC
                  </div>
                </div>
              </div>

              {!canAffordNew && (
                <div className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800">
                  Insufficient funds. You can secure a corporate loan at the Banking Desk in your Profile.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFoundModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canAffordNew}
                  className={`px-5 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${
                    canAffordNew
                      ? 'bg-sky-600 hover:bg-sky-500 text-white active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Charter & Incept Enterprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
