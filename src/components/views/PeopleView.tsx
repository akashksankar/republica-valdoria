import React, { useState } from 'react';
import { GameState, NPC } from '../../types/game';
import { 
  Users, 
  Award, 
  Crown, 
  MessageSquare, 
  HeartHandshake, 
  Swords, 
  History, 
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface PeopleViewProps {
  state: GameState;
  onInteractWithNpc: (npcId: string, actionType: 'favor' | 'invest' | 'lobby') => void;
}

export const PeopleView: React.FC<PeopleViewProps> = ({
  state,
  onInteractWithNpc,
}) => {
  const [selectedNpcId, setSelectedNpcId] = useState<string>('npc_arjun_varma');
  const selectedNpc = state.npcs.find((n) => n.id === selectedNpcId) || state.npcs[0];
  const regionObj = state.regions.find((r) => r.id === selectedNpc.regionId);

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            Social Fabric & Key Dignitaries
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Valdorian Registry of Power & Influence
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Simulated Network:</span>
          <span className="text-indigo-400 font-bold">{state.npcs.length} High Dignitaries</span>
        </div>
      </div>

      {/* Main Grid: Left NPC List, Right Dossier & Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left NPC List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Key Figures of Valdoria
          </div>

          <div className="space-y-1.5">
            {state.npcs.map((npc) => {
              const isSelected = npc.id === selectedNpcId;

              return (
                <button
                  key={npc.id}
                  id={`npc-card-${npc.id}`}
                  onClick={() => setSelectedNpcId(npc.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-indigo-900 border border-indigo-400/40 flex items-center justify-center font-serif-cinzel font-bold text-white shrink-0">
                    {npc.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="truncate">
                    <div className="font-bold text-white text-sm truncate">{npc.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{npc.title}</div>
                    <div className="text-[10px] text-indigo-400 font-medium">{npc.organization}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Dossier & Dialogue Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-indigo-950 border border-indigo-400/50 flex items-center justify-center font-serif-cinzel font-bold text-2xl text-white shadow-inner">
                  {selectedNpc.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h2 className="font-serif-cinzel text-xl font-bold text-white">{selectedNpc.name}</h2>
                  <div className="text-xs text-amber-400 font-semibold">{selectedNpc.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {selectedNpc.organization} • <span className="text-sky-400">{regionObj?.name}</span> • Age {selectedNpc.age}
                  </div>
                </div>
              </div>

              {/* Trust & Rivalry Meters */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3 text-emerald-400" /> TRUST
                  </div>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    {selectedNpc.trustScore > 0 ? `+${selectedNpc.trustScore}` : selectedNpc.trustScore}
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Swords className="w-3 h-3 text-rose-400" /> RIVALRY
                  </div>
                  <div className="font-mono font-bold text-rose-400 text-sm mt-0.5">
                    {selectedNpc.rivalryScore}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio & Signature Quote */}
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNpc.bio}
              </p>
              <div className="p-3 bg-indigo-950/20 border-l-2 border-indigo-500 rounded-r-xl text-xs text-indigo-200 italic">
                "{selectedNpc.dialogueQuote}"
              </div>
            </div>

            {/* NPC Memories (Past Deeds with Player) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" /> Episodic Memory Bank
              </h3>
              {selectedNpc.memories.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                  No significant history recorded yet. Interact with this figure to create enduring memories.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedNpc.memories.map((mem) => (
                    <div key={mem.id} className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-slate-300">{mem.description}</span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold shrink-0">
                        Trust +{mem.impactScore}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strategic Interaction Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <button
                id={`npc-action-favor-${selectedNpc.id}`}
                onClick={() => onInteractWithNpc(selectedNpc.id, 'favor')}
                disabled={state.player.cash < 5000}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Host Private Banquet (5,000 VLC)
              </button>

              <button
                id={`npc-action-invest-${selectedNpc.id}`}
                onClick={() => onInteractWithNpc(selectedNpc.id, 'invest')}
                disabled={state.player.cash < 15000}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Propose Joint Syndicate (15,000 VLC)
              </button>

              <button
                id={`npc-action-lobby-${selectedNpc.id}`}
                onClick={() => onInteractWithNpc(selectedNpc.id, 'lobby')}
                disabled={state.player.politicalInfluence < 5}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Lobby Endorsement (5 Influence)
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
