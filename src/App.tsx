/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { initialGameState } from './simulation/initialState';
import { advanceSimulationDay } from './simulation/economyEngine';
import { 
  GameState, 
  GameSpeed, 
  NavigationTab, 
  Region, 
  Business, 
  BusinessIndustry, 
  TreatyProposal, 
  DynamicSimEvent, 
  PlayerLoan 
} from './types/game';

// HUD Components
import { TopHUD } from './components/hud/TopHUD';
import { BottomNav } from './components/hud/BottomNav';

// Views
import { GodViewMap } from './components/map/GodViewMap';
import { EconomyView } from './components/views/EconomyView';
import { BusinessView } from './components/views/BusinessView';
import { MarketsView } from './components/views/MarketsView';
import { RealEstateView } from './components/views/RealEstateView';
import { PoliticsView } from './components/views/PoliticsView';
import { GovernmentView } from './components/views/GovernmentView';
import { DiplomacyView } from './components/views/DiplomacyView';
import { PeopleView } from './components/views/PeopleView';
import { NewsView } from './components/views/NewsView';

// Modals
import { RegionDetailModal } from './components/views/RegionDetailModal';
import { PlayerProfileModal } from './components/views/PlayerProfileModal';
import { TreatyModal } from './components/views/TreatyModal';
import { EventModal } from './components/views/EventModal';
import { GameManualModal } from './components/views/GameManualModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => initialGameState);
  const [activeTab, setActiveTab] = useState<NavigationTab>('world');
  
  // Modals state
  const [inspectingRegion, setInspectingRegion] = useState<Region | null>(null);
  const [isPlayerProfileOpen, setIsPlayerProfileOpen] = useState(false);
  const [activeTreatyProposal, setActiveTreatyProposal] = useState<TreatyProposal | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Simulation Tick Loop
  const speedRef = useRef(gameState.speed);
  speedRef.current = gameState.speed;

  useEffect(() => {
    if (gameState.speed === 0) return;

    const intervalTime = 
      gameState.speed === 1 ? 1000 :
      gameState.speed === 2 ? 500 :
      gameState.speed === 5 ? 200 : 100;

    const interval = setInterval(() => {
      setGameState((prev) => advanceSimulationDay(prev));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [gameState.speed]);

  // Speed Control
  const handleSetSpeed = (speed: GameSpeed) => {
    setGameState((prev) => ({ ...prev, speed }));
  };

  // Inspect Region
  const handleInspectRegion = (regionId: string) => {
    const reg = gameState.regions.find((r) => r.id === regionId);
    if (reg) {
      setInspectingRegion(reg);
    }
  };

  // Found Business
  const handleFoundBusiness = (data: { name: string; industry: BusinessIndustry; regionId: string; startupCost: number }) => {
    setGameState((prev) => {
      if (prev.player.cash < data.startupCost) return prev;

      const newBiz: Business = {
        id: `biz_${Date.now()}`,
        name: data.name,
        industry: data.industry,
        regionId: data.regionId,
        ownerType: 'player',
        ownerName: prev.player.name,
        monthlyRevenue: Math.round(data.startupCost * 0.18),
        monthlyExpenses: Math.round(data.startupCost * 0.08),
        netProfit: Math.round(data.startupCost * 0.10),
        valuation: Math.round(data.startupCost * 1.4),
        employees: 12,
        avgWage: 4500,
        marketSharePercent: 3.5,
        health: 100,
        level: 1,
        icon: 'briefcase',
      };

      const newPlayerCash = prev.player.cash - data.startupCost;
      const newMonthlyCashflow = prev.player.monthlyCashflow + newBiz.netProfit;

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: newPlayerCash,
          monthlyCashflow: newMonthlyCashflow,
          netWorth: prev.player.netWorth + newBiz.valuation - data.startupCost,
          reputation: prev.player.reputation + 4,
        },
        businesses: [newBiz, ...prev.businesses],
        news: [
          {
            id: `news_${Date.now()}`,
            dateStr: `${prev.date.day}/${prev.date.month}/${prev.date.year}`,
            category: 'business',
            title: `${newBiz.name} Incepted in ${data.regionId.toUpperCase()}`,
            summary: `Entrepreneur ${prev.player.name} has officially registered a new ${data.industry} enterprise with ${data.startupCost.toLocaleString()} VLC in initial capitalization.`,
            impact: 'positive',
          },
          ...prev.news,
        ],
      };
    });
  };

  // Upgrade Business
  const handleUpgradeBusiness = (bizId: string, upgradeCost: number) => {
    setGameState((prev) => {
      if (prev.player.cash < upgradeCost) return prev;

      const updatedBusinesses = prev.businesses.map((biz) => {
        if (biz.id !== bizId) return biz;
        const newRev = Math.round(biz.monthlyRevenue * 1.35);
        const newExp = Math.round(biz.monthlyExpenses * 1.25);
        const newProfit = newRev - newExp;
        const newVal = Math.round(biz.valuation * 1.4);

        return {
          ...biz,
          level: biz.level + 1,
          monthlyRevenue: newRev,
          monthlyExpenses: newExp,
          netProfit: newProfit,
          valuation: newVal,
          employees: biz.employees + 10,
          marketSharePercent: Number((biz.marketSharePercent + 2.2).toFixed(1)),
        };
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - upgradeCost,
          reputation: prev.player.reputation + 3,
        },
        businesses: updatedBusinesses,
      };
    });
  };

  // Stock Trading
  const handleTradeStock = (symbol: string, quantity: number, isBuy: boolean) => {
    setGameState((prev) => {
      const stock = prev.stocks.find((s) => s.symbol === symbol);
      if (!stock) return prev;

      const cost = Math.round(stock.price * quantity);
      const currentHolding = prev.player.holdings[symbol] || { shares: 0, avgCostBasis: 0 };

      if (isBuy) {
        if (prev.player.cash < cost) return prev;
        const totalShares = currentHolding.shares + quantity;
        const totalSpent = (currentHolding.shares * currentHolding.avgCostBasis) + cost;
        const newAvg = Number((totalSpent / totalShares).toFixed(2));

        return {
          ...prev,
          player: {
            ...prev.player,
            cash: prev.player.cash - cost,
            holdings: {
              ...prev.player.holdings,
              [symbol]: { shares: totalShares, avgCostBasis: newAvg },
            },
          },
        };
      } else {
        if (currentHolding.shares < quantity) return prev;
        const remainingShares = currentHolding.shares - quantity;
        const updatedHoldings = { ...prev.player.holdings };
        if (remainingShares === 0) {
          delete updatedHoldings[symbol];
        } else {
          updatedHoldings[symbol] = { ...currentHolding, shares: remainingShares };
        }

        return {
          ...prev,
          player: {
            ...prev.player,
            cash: prev.player.cash + cost,
            holdings: updatedHoldings,
          },
        };
      }
    });
  };

  // Buy Sovereign Bond
  const handleBuySovereignBond = (amount: number) => {
    setGameState((prev) => {
      if (prev.player.cash < amount) return prev;
      const monthlyCoupon = Math.round(amount * (0.062 / 12));

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - amount,
          monthlyCashflow: prev.player.monthlyCashflow + monthlyCoupon,
          netWorth: prev.player.netWorth, // Bond asset preserves net worth
          reputation: prev.player.reputation + 2,
        },
      };
    });
  };

  // Buy Real Estate
  const handleBuyProperty = (propId: string) => {
    setGameState((prev) => {
      const prop = prev.properties.find((p) => p.id === propId);
      if (!prop || prev.player.cash < prop.purchasePrice) return prev;

      const updatedProps = prev.properties.map((p) => {
        if (p.id !== propId) return p;
        return {
          ...p,
          isPlayerOwned: true,
          status: 'rented' as const,
          occupancyPercent: 95,
        };
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - prop.purchasePrice,
          monthlyCashflow: prev.player.monthlyCashflow + prop.monthlyRent,
          netWorth: prev.player.netWorth,
          reputation: prev.player.reputation + 3,
        },
        properties: updatedProps,
      };
    });
  };

  // Develop Property
  const handleDevelopProperty = (propId: string, cost: number) => {
    setGameState((prev) => {
      if (prev.player.cash < cost) return prev;

      const updatedProps = prev.properties.map((p) => {
        if (p.id !== propId) return p;
        return {
          ...p,
          currentValue: Math.round(p.currentValue * 1.45),
          monthlyRent: Math.round(p.monthlyRent * 1.5),
          occupancyPercent: 100,
        };
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - cost,
          netWorth: prev.player.netWorth + Math.round(cost * 0.45),
          reputation: prev.player.reputation + 2,
        },
        properties: updatedProps,
      };
    });
  };

  // Join Party
  const handleJoinParty = (partyId: string) => {
    setGameState((prev) => {
      const party = prev.parties.find((p) => p.id === partyId);
      return {
        ...prev,
        player: {
          ...prev.player,
          partyMembershipId: partyId,
          reputation: prev.player.reputation + 2,
        },
        news: [
          {
            id: `news_${Date.now()}`,
            dateStr: `${prev.date.day}/${prev.date.month}/${prev.date.year}`,
            category: 'politics',
            title: `Dorian Mercer Formally Joins ${party?.name || 'Party'}`,
            summary: `Prominent private investor Dorian Mercer has taken up formal membership in the ${party?.name}, strengthening party ties with commerce.`,
            impact: 'positive',
          },
          ...prev.news,
        ],
      };
    });
  };

  // Donate to Party
  const handleDonateToParty = (partyId: string, amount: number) => {
    setGameState((prev) => {
      if (prev.player.cash < amount) return prev;

      const updatedParties = prev.parties.map((p) => {
        if (p.id !== partyId) return p;
        return {
          ...p,
          partyFundsMillion: Number((p.partyFundsMillion + (amount / 1000000)).toFixed(2)),
          nationalPollingPercent: Number((p.nationalPollingPercent + 0.3).toFixed(1)),
        };
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - amount,
          politicalInfluence: prev.player.politicalInfluence + 5,
          reputation: prev.player.reputation + 3,
        },
        parties: updatedParties,
      };
    });
  };

  // Run for Office
  const handleRunForOffice = (officeTitle: string, minReputation: number, minInfluence: number) => {
    setGameState((prev) => {
      if (prev.player.reputation < minReputation || prev.player.politicalInfluence < minInfluence) {
        return prev;
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          electedOffice: officeTitle,
          careerPath: officeTitle.includes('Minister') ? 'statesman' : officeTitle.includes('Parliament') ? 'politician' : 'politician',
          title: officeTitle,
          politicalInfluence: prev.player.politicalInfluence + 15,
          reputation: prev.player.reputation + 10,
        },
        news: [
          {
            id: `news_${Date.now()}`,
            dateStr: `${prev.date.day}/${prev.date.month}/${prev.date.year}`,
            category: 'politics',
            title: `Dorian Mercer Elected to Office as ${officeTitle}`,
            summary: `Following intense election polling and ballot counting across Valdoria, Dorian Mercer has successfully assumed the post of ${officeTitle}.`,
            impact: 'breaking',
          },
          ...prev.news,
        ],
      };
    });
  };

  // Bid on Government Project
  const handleBidOnProject = (deptId: string, cost: number) => {
    setGameState((prev) => {
      if (prev.player.cash < cost) return prev;

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - cost,
          monthlyCashflow: prev.player.monthlyCashflow + Math.round(cost * 0.12),
          reputation: prev.player.reputation + 6,
          politicalInfluence: prev.player.politicalInfluence + 4,
        },
      };
    });
  };

  // Take Loan
  const handleTakeLoan = (amount: number, termMonths: number, interestRate: number) => {
    setGameState((prev) => {
      const newLoan: PlayerLoan = {
        id: `loan_${Date.now()}`,
        lenderName: 'Bank of Valdoria',
        principal: amount,
        balanceRemaining: amount,
        interestRateAnnual: interestRate,
        monthlyPayment: Math.round((amount / termMonths) + (amount * (interestRate / 100 / 12))),
        remainingMonths: termMonths,
      };

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash + amount,
          loans: [...prev.player.loans, newLoan],
        },
      };
    });
  };

  // Repay Loan
  const handleRepayLoan = (loanId: string) => {
    setGameState((prev) => {
      const targetLoan = prev.player.loans.find((l) => l.id === loanId);
      if (!targetLoan || prev.player.cash < targetLoan.balanceRemaining) return prev;

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - targetLoan.balanceRemaining,
          loans: prev.player.loans.filter((l) => l.id !== loanId),
          reputation: prev.player.reputation + 4,
        },
      };
    });
  };

  // Treaties
  const handleAcceptTreaty = (treatyId: string) => {
    setGameState((prev) => {
      const updatedCountries = prev.countries.map((c) => {
        return {
          ...c,
          relationshipScore: Math.min(100, c.relationshipScore + 18),
          stance: 'allied' as const,
          activeTreatyTitle: 'Comprehensive Bilateral Tariff & Port Protocol',
        };
      });

      return {
        ...prev,
        countries: updatedCountries,
        macro: {
          ...prev.macro,
          gdpTotalBillion: Number((prev.macro.gdpTotalBillion + 0.65).toFixed(2)),
          gdpGrowthRate: Number((prev.macro.gdpGrowthRate + 0.3).toFixed(1)),
        },
        player: {
          ...prev.player,
          reputation: prev.player.reputation + 8,
          politicalInfluence: prev.player.politicalInfluence + 10,
        },
        news: [
          {
            id: `news_${Date.now()}`,
            dateStr: `${prev.date.day}/${prev.date.month}/${prev.date.year}`,
            category: 'diplomacy',
            title: `Bilateral Treaty Ratified with Foreign Powers`,
            summary: `Envoys have formally signed and affixed state seals to a comprehensive mutual trade protocol, lowering tariffs on metallurgy and expanding maritime access.`,
            impact: 'breaking',
          },
          ...prev.news,
        ],
      };
    });
  };

  const handleRejectTreaty = (treatyId: string) => {
    setActiveTreatyProposal(null);
  };

  // NPC Interaction
  const handleInteractWithNpc = (npcId: string, actionType: 'favor' | 'invest' | 'lobby') => {
    setGameState((prev) => {
      const npc = prev.npcs.find((n) => n.id === npcId);
      if (!npc) return prev;

      let cost = 0;
      let trustDelta = 0;
      let influenceCost = 0;
      let memoDesc = '';

      if (actionType === 'favor') {
        cost = 5000;
        trustDelta = 12;
        memoDesc = `Hosted private diplomatic banquet at Solmere Palace.`;
      } else if (actionType === 'invest') {
        cost = 15000;
        trustDelta = 25;
        memoDesc = `Provided syndicate co-investment in commercial ventures.`;
      } else if (actionType === 'lobby') {
        influenceCost = 5;
        trustDelta = 8;
        memoDesc = `Successfully lobbied ministry backing for public initiative.`;
      }

      if (prev.player.cash < cost || prev.player.politicalInfluence < influenceCost) return prev;

      const updatedNpcs = prev.npcs.map((n) => {
        if (n.id !== npcId) return n;
        return {
          ...n,
          trustScore: Math.min(100, n.trustScore + trustDelta),
          memories: [
            {
              id: `mem_${Date.now()}`,
              dateStr: `${prev.date.day}/${prev.date.month}/${prev.date.year}`,
              description: memoDesc,
              impactScore: trustDelta,
            },
            ...n.memories,
          ],
        };
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          cash: prev.player.cash - cost,
          politicalInfluence: prev.player.politicalInfluence - influenceCost + (actionType === 'invest' ? 3 : 0),
          reputation: prev.player.reputation + 2,
        },
        npcs: updatedNpcs,
      };
    });
  };

  // Event Selection
  const handleSelectEventOption = (option: DynamicSimEvent['options'][0]) => {
    setGameState((prev) => {
      let updatedCash = prev.player.cash;
      let updatedRep = prev.player.reputation;
      let updatedInf = prev.player.politicalInfluence;

      if (option.costCash) updatedCash -= option.costCash;
      if (option.cashReward) updatedCash += option.cashReward;
      if (option.reputationChange) updatedRep += option.reputationChange;
      if (option.influenceChange) updatedInf += option.influenceChange;

      return {
        ...prev,
        activeEvent: null,
        player: {
          ...prev.player,
          cash: updatedCash,
          reputation: updatedRep,
          politicalInfluence: updatedInf,
        },
      };
    });
  };

  return (
    <div className="flex flex-col w-full h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* Top Strategic HUD */}
      <TopHUD
        state={gameState}
        onSetSpeed={handleSetSpeed}
        onOpenPlayerProfile={() => setIsPlayerProfileOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Primary Workspace / Active Tab View */}
      <main className="flex-1 w-full relative overflow-hidden bg-slate-950">
        {activeTab === 'world' && (
          <GodViewMap
            state={gameState}
            onSelectRegion={(regId) => handleInspectRegion(regId)}
            onSelectLayer={(layer) => {
              setGameState((prev) => ({ ...prev, selectedLayer: layer }));
            }}
          />
        )}

        {activeTab === 'economy' && (
          <EconomyView
            state={gameState}
            onInspectRegion={handleInspectRegion}
          />
        )}

        {activeTab === 'business' && (
          <BusinessView
            state={gameState}
            onFoundBusiness={handleFoundBusiness}
            onUpgradeBusiness={handleUpgradeBusiness}
          />
        )}

        {activeTab === 'markets' && (
          <MarketsView
            state={gameState}
            onTradeStock={handleTradeStock}
            onBuySovereignBond={handleBuySovereignBond}
          />
        )}

        {activeTab === 'realestate' && (
          <RealEstateView
            state={gameState}
            onBuyProperty={handleBuyProperty}
            onDevelopProperty={handleDevelopProperty}
          />
        )}

        {activeTab === 'politics' && (
          <PoliticsView
            state={gameState}
            onJoinParty={handleJoinParty}
            onDonateToParty={handleDonateToParty}
            onRunForOffice={handleRunForOffice}
          />
        )}

        {activeTab === 'government' && (
          <GovernmentView
            state={gameState}
            onBidOnProject={handleBidOnProject}
          />
        )}

        {activeTab === 'diplomacy' && (
          <DiplomacyView
            state={gameState}
            onOpenTreatyModal={(t) => setActiveTreatyProposal(t)}
            onSendDiplomaticGift={(cid, cost) => {
              setGameState((prev) => ({
                ...prev,
                player: { ...prev.player, cash: prev.player.cash - cost, reputation: prev.player.reputation + 4 },
                countries: prev.countries.map((c) => c.id === cid ? { ...c, relationshipScore: Math.min(100, c.relationshipScore + 10) } : c),
              }));
            }}
          />
        )}

        {activeTab === 'people' && (
          <PeopleView
            state={gameState}
            onInteractWithNpc={handleInteractWithNpc}
          />
        )}

        {activeTab === 'news' && (
          <NewsView
            state={gameState}
          />
        )}
      </main>

      {/* Bottom Command Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        breakingNewsCount={gameState.news.filter((n) => n.impact === 'breaking').length}
      />

      {/* Modals & Overlays */}
      {inspectingRegion && (
        <RegionDetailModal
          region={inspectingRegion}
          state={gameState}
          onClose={() => setInspectingRegion(null)}
          onFoundEnterpriseHere={(regId) => {
            setActiveTab('business');
          }}
          onViewRealEstate={() => {
            setActiveTab('realestate');
          }}
        />
      )}

      {isPlayerProfileOpen && (
        <PlayerProfileModal
          state={gameState}
          onClose={() => setIsPlayerProfileOpen(false)}
          onTakeLoan={handleTakeLoan}
          onRepayLoan={handleRepayLoan}
        />
      )}

      {activeTreatyProposal && (
        <TreatyModal
          treaty={activeTreatyProposal}
          state={gameState}
          onClose={() => setActiveTreatyProposal(null)}
          onAcceptTreaty={handleAcceptTreaty}
          onRejectTreaty={handleRejectTreaty}
        />
      )}

      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          onSelectOption={handleSelectEventOption}
        />
      )}

      {isHelpOpen && (
        <GameManualModal
          onClose={() => setIsHelpOpen(false)}
        />
      )}

    </div>
  );
}
