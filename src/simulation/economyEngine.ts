import { GameState, Stock, DynamicSimEvent, NewsArticle } from '../types/game';

// Helper to advance the simulation clock by 1 tick (representing 1 day)
export function advanceSimulationDay(prevState: GameState): GameState {
  if (prevState.speed === 0) return prevState;

  const newDay = prevState.date.day + 1;
  let newMonth = prevState.date.month;
  let newYear = prevState.date.year;
  let isMonthEnd = false;

  if (newDay > 30) {
    isMonthEnd = true;
    newMonth += 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
  }

  const newQuarter = Math.ceil(newMonth / 3);

  // Micro adjustments on stocks each day
  const updatedStocks: Stock[] = prevState.stocks.map((stock) => {
    // Deterministic small daily drift (-1.5% to +1.5%)
    const macroFactor = (prevState.macro.gdpGrowthRate - 2.5) * 0.002;
    const rateFactor = (5.0 - prevState.macro.centralBankInterestRate) * 0.001;
    const randomSeed = (Math.sin(stock.price * 100 + newDay * 17) + Math.cos(newMonth * 13)) * 0.008;
    const deltaPercent = macroFactor + rateFactor + randomSeed;

    const newPrice = Math.max(1.0, Number((stock.price * (1 + deltaPercent)).toFixed(2)));
    const newChangePercent = Number((((newPrice - stock.prevPrice) / stock.prevPrice) * 100).toFixed(2));
    
    // Only append to history on day 15 or 30 to keep history clean
    const updatedHistory = (newDay === 1 || newDay === 15) 
      ? [...stock.history.slice(-19), newPrice] 
      : stock.history;

    return {
      ...stock,
      price: newPrice,
      changePercent: newChangePercent,
      history: updatedHistory,
      marketCapBillion: Number(((newPrice * stock.volumeThousand * 0.001) + (stock.marketCapBillion * 0.999)).toFixed(1)),
    };
  });

  // If not month end, return updated day and stocks
  if (!isMonthEnd) {
    return {
      ...prevState,
      date: {
        year: newYear,
        quarter: newQuarter,
        month: newMonth,
        day: newDay,
      },
      stocks: updatedStocks,
    };
  }

  // --- MONTH END SIMULATION CYCLE ---
  let playerCashDelta = 0;
  const newNews: NewsArticle[] = [...prevState.news];
  let triggeredEvent: DynamicSimEvent | null = prevState.activeEvent;

  // 1. Player Businesses monthly cashflow
  const updatedBusinesses = prevState.businesses.map((biz) => {
    if (biz.ownerType === 'player') {
      // Monthly profits go directly to player
      playerCashDelta += biz.netProfit;
    }
    // Slight organic economic growth
    const demandFactor = (prevState.macro.consumerConfidence / 100) * (1 + prevState.macro.gdpGrowthRate / 100);
    const newRev = Math.round(biz.monthlyRevenue * (0.98 + 0.04 * demandFactor));
    const newExp = Math.round(biz.monthlyExpenses * (1 + (prevState.macro.inflationRate / 100) / 12));
    const newProfit = newRev - newExp;
    return {
      ...biz,
      monthlyRevenue: newRev,
      monthlyExpenses: newExp,
      netProfit: newProfit,
      valuation: Math.max(100000, newProfit * 12 * 8), // 8x P/E valuation
    };
  });

  // 2. Real Estate Rents
  const updatedProperties = prevState.properties.map((prop) => {
    if (prop.isPlayerOwned && prop.status === 'rented') {
      playerCashDelta += prop.monthlyRent;
    }
    // Property value appreciation with inflation & GDP
    const appreciationRate = 1 + (prevState.macro.gdpGrowthRate * 0.4 + prevState.macro.inflationRate * 0.6) / 1200;
    return {
      ...prop,
      currentValue: Math.round(prop.currentValue * appreciationRate),
    };
  });

  // 3. Player Loans & Debt Service
  const updatedLoans = prevState.player.loans
    .map((loan) => {
      const payment = Math.min(loan.balanceRemaining, loan.monthlyPayment);
      playerCashDelta -= payment;
      const newRemainingMonths = loan.remainingMonths - 1;
      const newBalance = Math.max(0, loan.balanceRemaining - (payment - (loan.balanceRemaining * (loan.interestRateAnnual / 1200))));
      return {
        ...loan,
        remainingMonths: newRemainingMonths,
        balanceRemaining: Math.round(newBalance),
      };
    })
    .filter((l) => l.remainingMonths > 0 && l.balanceRemaining > 0);

  // 4. Stock Dividends for Player
  Object.entries(prevState.player.holdings).forEach(([symbol, holding]) => {
    if (holding.shares > 0) {
      const stock = updatedStocks.find((s) => s.symbol === symbol);
      if (stock && stock.dividendYield > 0) {
        const monthlyDivPerShare = (stock.price * (stock.dividendYield / 100)) / 12;
        playerCashDelta += Math.round(monthlyDivPerShare * holding.shares);
      }
    }
  });

  // 5. Macro Adjustments
  const newInflation = Number(
    Math.max(1.0, Math.min(10.0, prevState.macro.inflationRate + (prevState.macro.gdpGrowthRate > 4 ? 0.1 : -0.05))).toFixed(1)
  );

  let newCentralBankRate = prevState.macro.centralBankInterestRate;
  if (newInflation > 4.5 && newCentralBankRate < 8.0) {
    newCentralBankRate = Number((newCentralBankRate + 0.25).toFixed(2));
    newNews.unshift({
      id: `news_rate_hike_${newYear}_${newMonth}`,
      title: `Central Bank Hikes Key Interest Rate to ${newCentralBankRate}%`,
      summary: `Governor Elena Vance executes a monetary tightening maneuver to curb inflation risks and safeguard the Valdor Crown.`,
      category: 'economy',
      impact: 'negative',
      dateStr: `01 ${getMonthName(newMonth)} ${newYear}`,
      relatedRegionId: 'aurelia',
    });
  } else if (newInflation < 2.0 && newCentralBankRate > 3.5) {
    newCentralBankRate = Number((newCentralBankRate - 0.25).toFixed(2));
  }

  const newGdpGrowth = Number(
    Math.max(-2.0, Math.min(8.0, prevState.macro.gdpGrowthRate + (newCentralBankRate > 6 ? -0.15 : 0.1))).toFixed(1)
  );

  const newGdpTotal = Number(
    (prevState.macro.gdpTotalBillion * (1 + (newGdpGrowth / 100) / 12)).toFixed(1)
  );

  // 6. Calculate Net Worth
  const newCash = prevState.player.cash + playerCashDelta;
  let portfolioValue = 0;
  Object.entries(prevState.player.holdings).forEach(([symbol, h]) => {
    const s = updatedStocks.find((stock) => stock.symbol === symbol);
    if (s) portfolioValue += s.price * h.shares;
  });

  let ownedBizValuation = 0;
  updatedBusinesses.filter((b) => b.ownerType === 'player').forEach((b) => {
    ownedBizValuation += b.valuation;
  });

  let ownedPropertyValuation = 0;
  updatedProperties.filter((p) => p.isPlayerOwned).forEach((p) => {
    ownedPropertyValuation += p.currentValue;
  });

  const totalDebt = updatedLoans.reduce((sum, l) => sum + l.balanceRemaining, 0);
  const calculatedNetWorth = Math.round(newCash + portfolioValue + ownedBizValuation + ownedPropertyValuation - totalDebt);

  // 7. Check for Monthly Random Event (Every few months)
  if (!triggeredEvent && newMonth % 2 === 0 && Math.random() < 0.6) {
    triggeredEvent = generateRandomSimEvent(newYear, newMonth, prevState);
  }

  return {
    ...prevState,
    speed: triggeredEvent ? 0 : prevState.speed, // Auto pause on major event
    activeEvent: triggeredEvent,
    date: {
      year: newYear,
      quarter: newQuarter,
      month: newMonth,
      day: 1,
    },
    player: {
      ...prevState.player,
      cash: newCash,
      netWorth: calculatedNetWorth,
      monthlyCashflow: playerCashDelta,
      loans: updatedLoans,
    },
    macro: {
      ...prevState.macro,
      gdpTotalBillion: newGdpTotal,
      gdpGrowthRate: newGdpGrowth,
      inflationRate: newInflation,
      centralBankInterestRate: newCentralBankRate,
    },
    businesses: updatedBusinesses,
    properties: updatedProperties,
    stocks: updatedStocks,
    news: newNews.slice(0, 30),
  };
}

function getMonthName(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex - 1] || 'Jan';
}

function generateRandomSimEvent(year: number, month: number, state: GameState): DynamicSimEvent {
  const events: DynamicSimEvent[] = [
    {
      id: `evt_tender_${year}_${month}`,
      title: 'National Assembly Announces Port Azure Rail Modernization Tender',
      subtitle: 'Public-Private Infrastructure Partnership Opportunity',
      description: 'The Ministry of Transport is soliciting private co-sponsors for a high-capacity freight spur linking the heavy foundries of Ironvale directly to the Port Azure docks. Bidders can secure lucrative sovereign concessions or earn massive political influence.',
      source: 'Ministry of Transport Gazette',
      category: 'infrastructure_tender',
      options: [
        {
          id: 'opt_bid_heavy',
          label: 'Fund Preferred Equity Stake (50,000 VLC)',
          detail: 'Provide capital backing. Earns 15 Reputation, +10 Political Influence, and +1,800 VLC monthly dividend.',
          costCash: 50000,
          influenceChange: 10,
          reputationChange: 15,
        },
        {
          id: 'opt_lobby',
          label: 'Lobby for Local Labor Quotas (5 Influence)',
          detail: 'Align with Social Democratic Union. Boosts goodwill with labor unions in Ironvale & Eastford.',
          influenceCost: 5,
          reputationChange: 10,
        },
        {
          id: 'opt_decline',
          label: 'Observe from Sidelines',
          detail: 'Take no action and preserve liquidity.',
        },
      ],
    },
    {
      id: `evt_strike_${year}_${month}`,
      title: 'Labor Unrest Threats in Ironvale Metallurgy Basin',
      subtitle: 'Industrial Wage Dispute & Union Mobilization',
      description: 'Worker syndicates are demanding an 8% cost-of-living allowance citing recent consumer price surges. Marcus Thorne has threatened a retaliatory factory lockout, which could derail nationwide steel supply and drag down GDP.',
      source: 'Valdoria Daily Dispatch',
      category: 'economic_crisis',
      options: [
        {
          id: 'opt_mediate',
          label: 'Act as Neutral Arbiter (10,000 VLC)',
          detail: 'Broker a compromise pact between Sofia Rostova and Marcus Thorne. Wins trust with both sides.',
          costCash: 10000,
          influenceChange: 8,
          reputationChange: 12,
        },
        {
          id: 'opt_back_industry',
          label: 'Publicly Back Industry Syndicate',
          detail: 'Strengthen ties with Free Market Alliance & industrial donors.',
          reputationChange: 5,
          influenceChange: 5,
        },
        {
          id: 'opt_ignore',
          label: 'No Comment',
          detail: 'Allow market forces to resolve the confrontation.',
        },
      ],
    },
    {
      id: `evt_norland_${year}_${month}`,
      title: 'Kingdom of Norland Proposes Strategic Energy Corridor',
      subtitle: 'Bilateral Diplomatic Envoy Dispatched to Aurelia',
      description: 'Norlandian envoys seek guaranteed port terminal leases in Port Azure in exchange for discounted high-grade timber and offshore petroleum imports. Sovereign approval requires assembly ratification.',
      source: 'Department of Foreign Affairs',
      category: 'diplomatic_tension',
      options: [
        {
          id: 'opt_support_treaty',
          label: 'Endorse Comprehensive Accord',
          detail: 'Expand trade capacity by 450M VLC. Boosts national foreign reserves.',
          influenceChange: 6,
          reputationChange: 8,
        },
        {
          id: 'opt_demand_tariffs',
          label: 'Push for Domestic Manufacturing Protection',
          detail: 'Shield Ironvale foundries at the cost of slight diplomatic strain with Norland.',
          influenceChange: 4,
          reputationChange: 4,
        },
      ],
    },
  ];

  const picked = events[Math.floor(Math.random() * events.length)];
  return picked;
}
