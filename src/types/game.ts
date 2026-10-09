export type GameSpeed = 0 | 1 | 2 | 5 | 10;

export type NavigationTab = 
  | 'world'
  | 'economy'
  | 'business'
  | 'markets'
  | 'politics'
  | 'government'
  | 'diplomacy'
  | 'people'
  | 'realestate'
  | 'news';

export type MapLayerType = 
  | 'standard'
  | 'gdp'
  | 'population'
  | 'wealth'
  | 'unemployment'
  | 'industry'
  | 'infrastructure'
  | 'political'
  | 'realestate'
  | 'environmental';

export interface GameDate {
  year: number;
  quarter: number;
  month: number;
  day: number;
}

export interface Region {
  id: string;
  name: string;
  tagline: string;
  description: string;
  // Visual coordinates normalized on the God-view strategic map (0 to 1000)
  mapX: number;
  mapY: number;
  elevation: number; // For 3D terrain rendering
  type: 'capital' | 'port' | 'industrial' | 'tech' | 'agrarian' | 'coastal' | 'mining' | 'metropolis';
  population: number; // e.g. 1,450,000
  gdpBillion: number; // VLC in Billions
  gdpGrowthPercent: number;
  unemploymentPercent: number;
  wealthScore: number; // 0 to 100
  industrialOutputScore: number; // 0 to 100
  infrastructureScore: number; // 0 to 100
  environmentalScore: number; // 0 to 100
  avgLandPriceSqM: number; // VLC
  dominantPartyId: string;
  keyFacility: {
    name: string;
    type: 'citadel' | 'harbor' | 'foundry' | 'techhub' | 'granary' | 'marina' | 'quarry' | 'transit';
    status: 'optimal' | 'congested' | 'upgrading' | 'idle';
  };
  highlightColor: string;
}

export interface PlayerLoan {
  id: string;
  lenderName: string;
  principal: number;
  balanceRemaining: number;
  interestRateAnnual: number;
  monthlyPayment: number;
  remainingMonths: number;
}

export interface PlayerHoldings {
  [symbol: string]: {
    shares: number;
    avgCostBasis: number;
  };
}

export interface Player {
  name: string;
  age: number;
  title: string;
  careerPath: 'independent' | 'entrepreneur' | 'tycoon' | 'politician' | 'statesman' | 'media_mogul' | 'real_estate_baron';
  cash: number;
  netWorth: number;
  monthlyCashflow: number;
  reputation: number; // 0 - 100
  politicalInfluence: number; // 0 - 100
  businessExperience: number; // 0 - 100
  loans: PlayerLoan[];
  holdings: PlayerHoldings;
  partyMembershipId: string | null;
  electedOffice: string | null;
}

export type BusinessIndustry = 
  | 'logistics'
  | 'technology'
  | 'manufacturing'
  | 'agriculture'
  | 'hospitality'
  | 'retail'
  | 'energy'
  | 'media'
  | 'banking'
  | 'real_estate';

export interface Business {
  id: string;
  name: string;
  industry: BusinessIndustry;
  regionId: string;
  ownerType: 'player' | 'npc' | 'state' | 'public';
  ownerName: string;
  employees: number;
  avgWage: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  valuation: number;
  marketSharePercent: number;
  health: number; // 0 - 100
  level: number;
  icon: string;
}

export interface StockHolding {
  symbol: string;
  shares: number;
  avgCost: number;
}

export interface Stock {
  symbol: string;
  name: string;
  industry: string;
  price: number;
  prevPrice: number;
  history: number[]; // Last 20 points
  changePercent: number;
  marketCapBillion: number;
  peRatio: number;
  dividendYield: number;
  volumeThousand: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface RealEstateProperty {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'land';
  regionId: string;
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  isPlayerOwned: boolean;
  occupancyPercent: number;
  sqMeters: number;
  status: 'vacant' | 'rented' | 'development' | 'for_sale';
}

export interface PoliticalParty {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  ideology: string;
  leaderName: string;
  parliamentSeats: number;
  totalSeats: number; // 250 in National Assembly
  nationalPollingPercent: number;
  platformSummary: string;
  partyFundsMillion: number;
}

export interface GovernmentDepartment {
  id: string;
  name: string;
  allocationBillion: number;
  ministerName: string;
  headcount: number;
  efficiencyRating: number; // 0 - 100
  activeProject: string;
}

export interface NationalBudget {
  fiscalYear: number;
  annualGdpBillion: number;
  taxRevenueBillion: number;
  corporateTaxRate: number; // e.g. 21%
  incomeTaxRate: number;    // e.g. 24%
  vatRate: number;          // e.g. 16%
  totalSpendingBillion: number;
  fiscalDeficitBillion: number;
  sovereignDebtBillion: number;
  centralBankRate: number;  // e.g. 6.5%
  departments: GovernmentDepartment[];
}

export interface ForeignCountry {
  id: string;
  name: string;
  capital: string;
  regime: string;
  flagSymbol: string;
  stance: 'allied' | 'friendly' | 'neutral' | 'strained' | 'hostile';
  relationshipScore: number; // -100 to 100
  tradeBalanceMillion: number;
  gdpBillion: number;
  militaryPosture: string;
  activeTreatyTitle: string | null;
}

export interface TreatyProposal {
  id: string;
  countryId: string;
  title: string;
  category: 'trade' | 'defense' | 'customs' | 'tech_accord';
  status: 'negotiating' | 'ratified' | 'rejected';
  steelTariffPercent: number;
  agroTariffPercent: number;
  energyImportQuotaPercent: number;
  portAccessGranted: boolean;
  investmentProtectionGuaranteed: boolean;
  monthlyEconomicBonusBillion: number;
}

export interface NPCMemory {
  id: string;
  description: string;
  impactScore: number;
  dateStr: string;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  organization: string;
  regionId: string;
  age: number;
  avatarSeed: string;
  netWorthMillion: number;
  politicalInfluence: number;
  partyAffiliation: string;
  trustScore: number; // -100 to 100 with player
  rivalryScore: number; // 0 to 100 with player
  bio: string;
  dialogueQuote: string;
  memories: NPCMemory[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'economy' | 'politics' | 'business' | 'markets' | 'diplomacy';
  impact: 'positive' | 'negative' | 'neutral' | 'breaking';
  dateStr: string;
  relatedRegionId?: string;
}

export interface DynamicSimEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  source: string;
  category: 'economic_crisis' | 'political_scandal' | 'market_boom' | 'diplomatic_tension' | 'infrastructure_tender';
  options: {
    id: string;
    label: string;
    detail: string;
    costCash?: number;
    influenceCost?: number;
    cashReward?: number;
    reputationChange?: number;
    influenceChange?: number;
    marketImpact?: string;
  }[];
}

export interface MacroEconomy {
  gdpTotalBillion: number;
  gdpGrowthRate: number;
  inflationRate: number;
  unemploymentRate: number;
  averageWageVLC: number;
  centralBankInterestRate: number;
  consumerConfidence: number; // 0 - 100
  foreignExchangeVLCPerUSD: number;
  publicDebtBillion: number;
  commodities: {
    oilBarrel: number;
    steelTon: number;
    wheatBushel: number;
    techSiliconIndex: number;
    goldOunce: number;
  };
}

export interface GameState {
  version: string;
  date: GameDate;
  speed: GameSpeed;
  selectedLayer: MapLayerType;
  activeTab: NavigationTab;
  inspectRegionId: string | null;
  activeEvent: DynamicSimEvent | null;
  activeTreatyModal: TreatyProposal | null;
  selectedNpc: NPC | null;
  player: Player;
  macro: MacroEconomy;
  regions: Region[];
  businesses: Business[];
  stocks: Stock[];
  properties: RealEstateProperty[];
  parties: PoliticalParty[];
  budget: NationalBudget;
  countries: ForeignCountry[];
  treaties: TreatyProposal[];
  npcs: NPC[];
  news: NewsArticle[];
  eventHistory: string[];
}
