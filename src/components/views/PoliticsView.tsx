import React from 'react';
import { GameState, PoliticalParty } from '../../types/game';
import { 
  Vote, 
  Award, 
  Crown, 
  Users, 
  Coins, 
  ShieldCheck, 
  Megaphone, 
  CheckCircle2, 
  ChevronRight,
  Landmark
} from 'lucide-react';

interface PoliticsViewProps {
  state: GameState;
  onJoinParty: (partyId: string) => void;
  onDonateToParty: (partyId: string, amount: number) => void;
  onRunForOffice: (officeTitle: string, minReputation: number, minInfluence: number) => void;
}

export const PoliticsView: React.FC<PoliticsViewProps> = ({
  state,
  onJoinParty,
  onDonateToParty,
  onRunForOffice,
}) => {
  const { parties, player } = state;
  const currentParty = parties.find((p) => p.id === player.partyMembershipId);

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
            National Assembly & Democracy
          </span>
          <h1 className="font-serif-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Parliamentary & Electoral Chamber
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Your Standing:</span>
          <span className="text-purple-400 font-bold">Influence: {player.politicalInfluence}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-bold">Office: {player.electedOffice || 'Private Citizen'}</span>
        </div>
      </div>

      {/* Parliamentary Chamber Seat Breakdown Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide">
              National Assembly of Valdoria (250 Seats)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">126 Seats Required for Governing Coalition</span>
        </div>

        {/* Proportional Seat Bar */}
        <div className="w-full h-6 rounded-xl overflow-hidden flex bg-slate-950 border border-slate-800">
          {parties.map((party) => {
            const pct = (party.parliamentSeats / party.totalSeats) * 100;
            return (
              <div
                key={party.id}
                style={{ width: `${pct}%`, backgroundColor: party.color }}
                className="h-full relative group transition-all"
                title={`${party.name}: ${party.parliamentSeats} seats (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {parties.map((party) => (
            <div key={party.id} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: party.color }} />
              <div className="truncate">
                <span className="font-bold text-white">{party.abbreviation}</span>
                <span className="text-slate-400 text-[11px] ml-1.5 font-mono">
                  {party.parliamentSeats} seats ({party.nationalPollingPercent}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign & Electoral Candidacy Desk */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide">
              Electoral Candidacy & Public Office
            </h2>
          </div>
          <span className="text-xs text-indigo-300 font-medium">Democratic Ambition</span>
        </div>

        <p className="text-xs text-slate-300">
          Leverage your wealth and reputation to contest public elections. Winning office gives executive decree privileges and cabinet voting power.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Municipal Council */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Municipal Councillor</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Local Tier</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Req: 20 Rep • 10 Influence
            </div>
            <button
              onClick={() => onRunForOffice('Municipal Councillor', 20, 10)}
              disabled={player.electedOffice === 'Municipal Councillor' || player.reputation < 20}
              className="w-full py-1.5 bg-slate-800 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {player.electedOffice === 'Municipal Councillor' ? 'Currently Incumbent' : 'Contest Election'}
            </button>
          </div>

          {/* Member of Parliament */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Member of Parliament</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono">Legislative</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Req: 45 Rep • 30 Influence
            </div>
            <button
              onClick={() => onRunForOffice('Member of Parliament', 45, 30)}
              disabled={player.electedOffice === 'Member of Parliament' || player.reputation < 45 || player.politicalInfluence < 30}
              className="w-full py-1.5 bg-slate-800 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {player.electedOffice === 'Member of Parliament' ? 'Currently Incumbent' : 'Campaign for Seat'}
            </button>
          </div>

          {/* Ministerial Cabinet */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Minister of Commerce</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">Executive</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Req: 75 Rep • 60 Influence
            </div>
            <button
              onClick={() => onRunForOffice('Minister of Commerce', 75, 60)}
              disabled={player.electedOffice === 'Minister of Commerce' || player.reputation < 75 || player.politicalInfluence < 60}
              className="w-full py-1.5 bg-slate-800 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {player.electedOffice === 'Minister of Commerce' ? 'Currently Incumbent' : 'Seek Appointment'}
            </button>
          </div>
        </div>
      </div>

      {/* Political Parties Dossier & Sponsorship */}
      <div>
        <h2 className="font-serif-cinzel text-base font-bold text-white tracking-wide mb-3 flex items-center gap-2">
          <Vote className="w-4 h-4 text-sky-400" />
          Valdoria Registered Political Parties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parties.map((party) => {
            const isMember = player.partyMembershipId === party.id;

            return (
              <div key={party.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-10 rounded-full shrink-0" style={{ backgroundColor: party.color }} />
                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{party.name}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Leader: <span className="text-slate-300 font-medium">{party.leaderName}</span>
                      </div>
                    </div>
                  </div>
                  {isMember ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      YOUR PARTY
                    </span>
                  ) : null}
                </div>

                <div className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  "{party.platformSummary}"
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-xl text-center border border-slate-800 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">IDEOLOGY</div>
                    <div className="text-slate-200 truncate font-semibold">{party.ideology.split('/')[0]}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">WAR CHEST</div>
                    <div className="font-mono text-amber-400 font-bold">{party.partyFundsMillion}M VLC</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">POLL SHARE</div>
                    <div className="font-mono text-emerald-400 font-bold">{party.nationalPollingPercent}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {!isMember ? (
                    <button
                      id={`join-party-${party.id}`}
                      onClick={() => onJoinParty(party.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      Join Party
                    </button>
                  ) : (
                    <span className="text-xs text-purple-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled Member
                    </span>
                  )}

                  <button
                    id={`donate-party-${party.id}`}
                    onClick={() => onDonateToParty(party.id, 5000)}
                    disabled={state.player.cash < 5000}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-xl shadow transition-all active:scale-95"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    Donate 5,000 VLC (+5 Influence)
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
