export interface CalculationInput {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnRate: number;
  feeStructures: number[];
  marginalTaxRate: number;
  timeHorizonYears: number;
}

export interface YearlyData {
  year: number;
  balance: number;
  netBalance: number;
  totalContributions: number;
  totalFeesPaid: number;
  grossGains: number;
  taxes: number;
}

export interface GrowthScenario {
  finalBalance: number;
  totalContributions: number;
  totalFeesPaid: number;
  netGains: number;
  yearlyData: YearlyData[];
  feeRate: number;
  feeLabel: string;
  effectiveReturnRate: number;
}

export interface Recommendation {
  type: 'primary' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface OptimizationResult {
  bestScenario: GrowthScenario;
  worstScenario: GrowthScenario;
  potentialSavings: number;
  feeSavings: number;
  recommendations: Recommendation[];
  scenarios: GrowthScenario[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata?: {
    calculatedAt: string;
    timeHorizonYears?: number;
    scenarioCount?: number;
  };
  error?: string;
  details?: string[];
}