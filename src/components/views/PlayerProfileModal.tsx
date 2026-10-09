import React from 'react';
import { GameState, PlayerLoan } from '../../types/game';
import { 
  User, 
  Wallet, 
  Landmark, 
  Award, 
  Crown, 
  TrendingUp, 
  Building2, 
  Coins, 
  X, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PlayerProfileModalProps {
  state: GameState;
  onClose: () => void;
  onTakeLoan: (amount: number, termMonths: number, interestRate: number) => void;
  onRepayLoan: (loanId: string) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  state,
  onClose,
  onTakeLoan,
  onRepayLoan,
}) => {
  const { player, businesses, properties, stocks } = state;

  // Calculate Asset breakdowns
  const totalStockEquity = Object.entries(player.holdings).reduce((sum, [sym, h]) => {
    const stock = stocks.find((s) => s.symbol === sym);
    return sum + (h.shares * (stock?.price || 0));
  }, 0);

  const totalBusinessValuation = businesses
    .filter((b) => b.ownerType === 'player')
    .reduce((sum, b) => sum + b.valuation, 0);

  const totalPropertyValuation = properties
    .filter((p) => p.isPlayerOwned)
    .reduce((sum, p) => sum + p.currentValue, 0);

  const totalDebt = player.loans.reduce((sum, l) => sum + l.balanceRemaining, 0);

  const maxLoanEligible = Math.max(10000, player.reputation * 1000 + (player.netWorth * 0.4));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Player Identity */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-sky-600 to-indigo-900 border border-amber-400/40 flex items-center justify-center font-serif-cinzel font-bold text-2xl text-white shadow-lg shrink-0">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">
                {player.title} ({player.careerPath})
              </span>
              {player.electedOffice && (
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  {player.electedOffice}
                </span>
              )}
            </div>
            <h2 className="font-serif-cinzel text-2xl font-bold text-white mt-1">
              {player.name}
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
              <span>Reputation: <strong className="text-amber-400 font-mono">{player.reputation}</strong></span>
              <span>•</span>
              <span>Political Influence: <strong className="text-purple-400 font-mono">{player.politicalInfluence}</strong></span>
            </div>
          </div>
        </div>

        {/* Consolidated Balance Sheet */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Personal Balance Sheet
            </span>
            <span className="font-mono text-xs text-slate-300">
              AUDITED SOLVENCY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">LIQUID CASH</div>
              <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">
                {player.cash.toLocaleString()} VLC
              </div>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">ENTERPRISES</div>
              <div className="font-mono text-xs font-bold text-sky-400 mt-0.5">
                {totalBusinessValuation.toLocaleString()} VLC
              </div>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">EQUITY & PROPERTY</div>
              <div className="font-mono text-xs font-bold text-indigo-400 mt-0.5">
                {(totalStockEquity + totalPropertyValuation).toLocaleString()} VLC
              </div>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">OUTSTANDING DEBT</div>
              <div className="font-mono text-xs font-bold text-rose-400 mt-0.5">
                {totalDebt.toLocaleString()} VLC
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
            <span className="text-xs font-bold text-slate-300">TOTAL ESTIMATED NET WORTH</span>
            <span className="text-base font-bold text-amber-400">
              {player.netWorth.toLocaleString()} VLC
            </span>
          </div>
        </div>

        {/* Banking & Credit Facility */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <h3 className="font-serif-cinzel font-bold text-sm text-white">
                Bank of Valdoria Credit Window
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Credit Limit: <strong className="text-sky-400 font-mono">{Math.round(maxLoanEligible).toLocaleString()} VLC</strong>
            </span>
          </div>

          {/* Active Loans */}
          {player.loans.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Active Borrowing Facilities
              </div>
              {player.loans.map((loan) => {
                const canRepay = player.cash >= loan.balanceRemaining;
                return (
                  <div key={loan.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white">{loan.lenderName}</div>
                      <div className="text-slate-400 text-[11px]">
                        Rate: {loan.interestRateAnnual}% • Balance: <span className="font-mono text-rose-400 font-bold">{loan.balanceRemaining.toLocaleString()} VLC</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRepayLoan(loan.id)}
                      disabled={!canRepay}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      Repay Full ({loan.balanceRemaining.toLocaleString()} VLC)
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Drawdown Options */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Drawdown Capital Loan:
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onTakeLoan(20000, 24, 7.5)}
                disabled={totalDebt + 20000 > maxLoanEligible}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Borrow 20,000 VLC (7.5%)
              </button>
              <button
                onClick={() => onTakeLoan(50000, 36, 8.0)}
                disabled={totalDebt + 50000 > maxLoanEligible}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Borrow 50,000 VLC (8.0%)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
