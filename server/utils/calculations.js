/**
 * Calculate compound growth with fees and taxes
 */
function calculateCompoundGrowth({
  initialInvestment,
  monthlyContribution,
  annualReturnRate,
  feeRate,
  marginalTaxRate,
  timeHorizonYears
}) {
  const monthlyReturnRate = (annualReturnRate - feeRate) / 12 / 100;
  const months = timeHorizonYears * 12;
  
  let balance = initialInvestment;
  let totalContributions = initialInvestment;
  let totalFeesPaid = 0;
  const yearlyData = [];
  
  for (let month = 1; month <= months; month++) {
    // Add monthly contribution
    if (month > 1) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
    }
    
    // Calculate monthly return
    const monthlyReturn = balance * monthlyReturnRate;
    balance += monthlyReturn;
    
    // Calculate and deduct fees (monthly)
    const monthlyFee = balance * (feeRate / 12 / 100);
    balance -= monthlyFee;
    totalFeesPaid += monthlyFee;
    
    // Store yearly data
    if (month % 12 === 0) {
      const year = month / 12;
      const grossGains = balance - totalContributions;
      const taxableGains = Math.max(0, grossGains);
      const taxes = taxableGains * (marginalTaxRate / 100);
      const netBalance = balance - taxes;
      
      yearlyData.push({
        year,
        balance: Math.round(balance * 100) / 100,
        netBalance: Math.round(netBalance * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalFeesPaid: Math.round(totalFeesPaid * 100) / 100,
        grossGains: Math.round(grossGains * 100) / 100,
        taxes: Math.round(taxes * 100) / 100
      });
    }
  }
  
  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalFeesPaid: Math.round(totalFeesPaid * 100) / 100,
    netGains: Math.round((balance - totalContributions) * 100) / 100,
    yearlyData,
    feeRate
  };
}

/**
 * Calculate growth scenarios for multiple fee structures
 */
function calculateGrowthScenarios({
  initialInvestment,
  monthlyContribution,
  annualReturnRate,
  feeStructures,
  marginalTaxRate,
  timeHorizonYears
}) {
  return feeStructures.map(feeRate => {
    const scenario = calculateCompoundGrowth({
      initialInvestment,
      monthlyContribution,
      annualReturnRate,
      feeRate,
      marginalTaxRate,
      timeHorizonYears
    });
    
    return {
      ...scenario,
      feeLabel: `${feeRate}% Fee`,
      effectiveReturnRate: Math.round((annualReturnRate - feeRate) * 100) / 100
    };
  });
}

/**
 * Find optimal fee structure and generate recommendations
 */
function findOptimalFeeStructure({
  initialInvestment,
  monthlyContribution,
  annualReturnRate,
  feeStructures,
  marginalTaxRate,
  timeHorizonYears
}) {
  const scenarios = calculateGrowthScenarios({
    initialInvestment,
    monthlyContribution,
    annualReturnRate,
    feeStructures,
    marginalTaxRate,
    timeHorizonYears
  });
  
  // Find best and worst scenarios
  const bestScenario = scenarios.reduce((best, current) => 
    current.finalBalance > best.finalBalance ? current : best
  );
  
  const worstScenario = scenarios.reduce((worst, current) => 
    current.finalBalance < worst.finalBalance ? current : worst
  );
  
  // Calculate savings potential
  const potentialSavings = bestScenario.finalBalance - worstScenario.finalBalance;
  const feeSavings = worstScenario.totalFeesPaid - bestScenario.totalFeesPaid;
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    scenarios,
    bestScenario,
    worstScenario,
    potentialSavings,
    feeSavings,
    timeHorizonYears
  });
  
  return {
    bestScenario,
    worstScenario,
    potentialSavings: Math.round(potentialSavings * 100) / 100,
    feeSavings: Math.round(feeSavings * 100) / 100,
    recommendations,
    scenarios
  };
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations({
  scenarios,
  bestScenario,
  worstScenario,
  potentialSavings,
  feeSavings,
  timeHorizonYears
}) {
  const recommendations = [];
  
  // Primary recommendation
  if (potentialSavings > 1000) {
    recommendations.push({
      type: 'primary',
      title: 'Significant Fee Savings Opportunity',
      message: `Switching from ${worstScenario.feeRate}% to ${bestScenario.feeRate}% fees could save you $${potentialSavings.toLocaleString()} over ${timeHorizonYears} years.`,
      impact: 'high',
      actionable: true
    });
  }
  
  // Fee impact analysis
  const avgFeeRate = scenarios.reduce((sum, s) => sum + s.feeRate, 0) / scenarios.length;
  if (avgFeeRate > 1.0) {
    recommendations.push({
      type: 'warning',
      title: 'High Average Fee Structure',
      message: `Your average fee rate of ${avgFeeRate.toFixed(2)}% is above the recommended 1.0% threshold. Consider low-cost index funds or ETFs.`,
      impact: 'medium',
      actionable: true
    });
  }
  
  // Long-term impact
  const feeImpactPercentage = (feeSavings / bestScenario.finalBalance) * 100;
  if (feeImpactPercentage > 10) {
    recommendations.push({
      type: 'info',
      title: 'Long-term Fee Impact',
      message: `Fees represent ${feeImpactPercentage.toFixed(1)}% of your potential portfolio value. Even small fee reductions compound significantly over time.`,
      impact: 'medium',
      actionable: false
    });
  }
  
  // Specific action items
  recommendations.push({
    type: 'success',
    title: 'Optimization Strategy',
    message: `Focus on investments with fees below 0.75%. Popular low-cost options include Vanguard Total Stock Market (0.03%) and Fidelity Zero funds (0.00%).`,
    impact: 'high',
    actionable: true
  });
  
  return recommendations;
}

module.exports = {
  calculateGrowthScenarios,
  findOptimalFeeStructure,
  calculateCompoundGrowth
};