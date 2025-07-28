/**
 * Validation utilities for API inputs
 */

function validateCalculationInput(data) {
  const errors = [];
  
  // Required fields
  const requiredFields = [
    'initialInvestment',
    'monthlyContribution', 
    'annualReturnRate',
    'feeStructures',
    'marginalTaxRate',
    'timeHorizonYears'
  ];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`${field} is required`);
    }
  }
  
  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }
  
  // Type and range validation
  const {
    initialInvestment,
    monthlyContribution,
    annualReturnRate,
    feeStructures,
    marginalTaxRate,
    timeHorizonYears
  } = data;
  
  if (typeof initialInvestment !== 'number' || initialInvestment < 0) {
    errors.push('Initial investment must be a positive number');
  }
  
  if (typeof monthlyContribution !== 'number' || monthlyContribution < 0) {
    errors.push('Monthly contribution must be a positive number');
  }
  
  if (typeof annualReturnRate !== 'number' || annualReturnRate < 0 || annualReturnRate > 50) {
    errors.push('Annual return rate must be between 0% and 50%');
  }
  
  if (!Array.isArray(feeStructures) || feeStructures.length === 0 || feeStructures.length > 5) {
    errors.push('Fee structures must be an array with 1-5 fee rates');
  } else {
    for (const fee of feeStructures) {
      if (typeof fee !== 'number' || fee < 0 || fee > 10) {
        errors.push('Each fee rate must be between 0% and 10%');
        break;
      }
    }
  }
  
  if (typeof marginalTaxRate !== 'number' || marginalTaxRate < 0 || marginalTaxRate > 50) {
    errors.push('Marginal tax rate must be between 0% and 50%');
  }
  
  if (typeof timeHorizonYears !== 'number' || timeHorizonYears < 1 || timeHorizonYears > 50) {
    errors.push('Time horizon must be between 1 and 50 years');
  }
  
  if (errors.length > 0) {
    return { error: { details: errors.map(msg => ({ message: msg })) } };
  }
  
  return { value: data };
}

function validateOptimizationInput(data) {
  // Same validation as calculation input
  return validateCalculationInput(data);
}

module.exports = {
  validateCalculationInput,
  validateOptimizationInput
};