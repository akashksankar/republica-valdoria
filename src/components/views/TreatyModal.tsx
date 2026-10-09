import React, { useState } from 'react';
import { TreatyProposal, GameState } from '../../types/game';
import { 
  FileCheck2, 
  FileSignature, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface TreatyModalProps {
  treaty: TreatyProposal;
  state: GameState;
  onClose: () => void;
  onAcceptTreaty: (treatyId: string) => void;
  onRejectTreaty: (treatyId: string) => void;
}

export const TreatyModal: React.FC<TreatyModalProps> = ({
  treaty,
  state,
  onClose,
  onAcceptTreaty,
  onRejectTreaty,
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const country = state.countries.find((c) => c.id === treaty.countryId) || state.countries[0];

  const handleAccept = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      setTimeout(() => {
        onAcceptTreaty(treaty.id);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden font-serif-cinzel">
        
        {/* Subtle Sovereign Watermark Background */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 pointer-events-none text-amber-300">
          <ShieldCheck className="w-full h-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl transition-colors font-sans"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Parchment Header & Seal */}
        <div className="text-center space-y-2 border-b border-amber-500/30 pb-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold shadow-inner">
            §
          </div>
          <div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold">
            INSTRUMENT OF BILATERAL ACCORD
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Republic of Valdoria ⟷ {country.name}
          </h2>
          <div className="text-xs text-slate-400 font-sans">
            Status: <span className="text-amber-300 font-bold uppercase font-mono">{treaty.status}</span>
          </div>
        </div>

        {/* Treaty Clauses Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 font-sans text-xs space-y-3 shadow-inner">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>Stipulated Articles & Protocols</span>
            <span className="text-emerald-400">Projected Impact: +0.65B VLC GDP</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Steel Tariff:</span>
              <span className="font-mono font-bold text-white">{treaty.steelTariffPercent}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Agro Tariff:</span>
              <span className="font-mono font-bold text-white">{treaty.agroTariffPercent}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Energy Quota:</span>
              <span className="font-mono font-bold text-sky-400">{treaty.energyImportQuotaPercent}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Deep Port Access:</span>
              <span className="font-bold text-emerald-400">Mutual Guarantees</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic pt-1">
            "Both sovereign parties pledge to reduce commercial friction and guarantee investor immunity against arbitrary nationalization."
          </div>
        </div>

        {/* Signature Area / Animated Signing */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-center font-sans space-y-2">
          {isSigning ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-2 text-amber-400 animate-pulse">
              <FileSignature className="w-8 h-8" />
              <span className="text-xs font-serif-cinzel font-bold tracking-wider">
                Affixing Sovereign Great Seal & Diplomatic Signatures...
              </span>
            </div>
          ) : isSigned ? (
            <div className="flex flex-col items-center justify-center py-3 space-y-1 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-sm font-serif-cinzel font-bold">
                Treaty Ratified & Entered into State Register!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 px-4">
              <div>
                <div className="font-serif-cinzel font-bold text-white text-sm">Plenipotentiary Envoy</div>
                <div className="text-[10px] text-slate-500">Republic of Valdoria</div>
              </div>
              <div className="w-20 h-0.5 bg-amber-500/40" />
              <div>
                <div className="font-serif-cinzel font-bold text-white text-sm">{country.capital} Minister</div>
                <div className="text-[10px] text-slate-500">{country.name}</div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isSigned && !isSigning && (
          <div className="flex items-center justify-end gap-3 font-sans pt-2">
            <button
              id="treaty-reject-btn"
              onClick={() => {
                onRejectTreaty(treaty.id);
                onClose();
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-rose-400 text-xs font-bold rounded-xl transition-colors"
            >
              Reject Protocol
            </button>

            <button
              id="treaty-accept-btn"
              onClick={handleAccept}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-serif-cinzel font-bold rounded-xl shadow-xl transition-all active:scale-95"
            >
              <FileSignature className="w-4 h-4" />
              Accept & Ratify Treaty
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
