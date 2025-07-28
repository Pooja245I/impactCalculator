const express = require('express');
const router = express.Router();
const { calculateGrowthScenarios, findOptimalFeeStructure } = require('../utils/calculations');
const { validateCalculationInput, validateOptimizationInput } = require('../utils/validation');

// POST /api/calculate - Calculate growth scenarios for different fee structures
router.post('/calculate', (req, res) => {
  try {
    const { error, value } = validateCalculationInput(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const {
      initialInvestment,
      monthlyContribution,
      annualReturnRate,
      feeStructures,
      marginalTaxRate,
      timeHorizonYears
    } = value;

    const scenarios = calculateGrowthScenarios({
      initialInvestment,
      monthlyContribution,
      annualReturnRate,
      feeStructures,
      marginalTaxRate,
      timeHorizonYears
    });

    res.json({
      success: true,
      data: scenarios,
      metadata: {
        calculatedAt: new Date().toISOString(),
        timeHorizonYears,
        scenarioCount: scenarios.length
      }
    });

  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
});

// GET /api/optimize - Get optimal fee structure recommendation
router.post('/optimize', (req, res) => {
  try {
    const { error, value } = validateOptimizationInput(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const optimization = findOptimalFeeStructure(value);

    res.json({
      success: true,
      data: optimization,
      metadata: {
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      error: 'Optimization failed',
      message: error.message
    });
  }
});

module.exports = router;