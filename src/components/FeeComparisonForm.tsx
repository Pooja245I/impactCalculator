import React, { useState, useCallback } from 'react';
import { Calculator, Plus, Minus, AlertCircle } from 'lucide-react';
import { CalculationInput } from '../types';

interface FeeComparisonFormProps {
  onSubmit: (data: CalculationInput) => void;
  loading?: boolean;
  error?: string | null;
}

const FeeComparisonForm: React.FC<FeeComparisonFormProps> = ({
  onSubmit,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<CalculationInput>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturnRate: 7,
    feeStructures: [0.5, 1.0, 1.5],
    marginalTaxRate: 22,
    timeHorizonYears: 25
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((data: CalculationInput): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (data.initialInvestment < 0) {
      errors.initialInvestment = 'Initial investment must be positive';
    }

    if (data.monthlyContribution < 0) {
      errors.monthlyContribution = 'Monthly contribution must be positive';
    }

    if (data.annualReturnRate < 0 || data.annualReturnRate > 50) {
      errors.annualReturnRate = 'Return rate must be between 0% and 50%';
    }

    if (data.feeStructures.length === 0 || data.feeStructures.length > 5) {
      errors.feeStructures = 'Please provide 1-5 fee structures';
    }

    if (data.feeStructures.some(fee => fee < 0 || fee > 10)) {
      errors.feeStructures = 'Fee rates must be between 0% and 10%';
    }

    if (data.marginalTaxRate < 0 || data.marginalTaxRate > 50) {
      errors.marginalTaxRate = 'Tax rate must be between 0% and 50%';
    }

    if (data.timeHorizonYears < 1 || data.timeHorizonYears > 50) {
      errors.timeHorizonYears = 'Time horizon must be between 1 and 50 years';
    }

    return errors;
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  }, [formData, validateForm, onSubmit]);

  const handleInputChange = useCallback((field: keyof CalculationInput, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleFeeStructureChange = useCallback((index: number, value: number) => {
    setFormData(prev => ({
      ...prev,
      feeStructures: prev.feeStructures.map((fee, i) => i === index ? value : fee)
    }));
  }, []);

  const addFeeStructure = useCallback(() => {
    if (formData.feeStructures.length < 5) {
      setFormData(prev => ({
        ...prev,
        feeStructures: [...prev.feeStructures, 2.0]
      }));
    }
  }, [formData.feeStructures.length]);

  const removeFeeStructure = useCallback((index: number) => {
    if (formData.feeStructures.length > 1) {
      setFormData(prev => ({
        ...prev,
        feeStructures: prev.feeStructures.filter((_, i) => i !== index)
      }));
    }
  }, [formData.feeStructures.length]);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Investment Parameters</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-error-800 font-medium">Calculation Error</p>
            <p className="text-error-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initial Investment */}
          <div>
            <label htmlFor="initialInvestment" className="block text-sm font-medium text-gray-700 mb-2">
              Initial Investment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="initialInvestment"
                className={`input-field pl-8 ${validationErrors.initialInvestment ? 'border-error-500' : ''}`}
                value={formData.initialInvestment}
                onChange={(e) => handleInputChange('initialInvestment', Number(e.target.value))}
                min="0"
                step="1000"
                aria-describedby={validationErrors.initialInvestment ? 'initialInvestment-error' : undefined}
              />
            </div>
            {validationErrors.initialInvestment && (
              <p id="initialInvestment-error" className="mt-1 text-sm text-error-600">
                {validationErrors.initialInvestment}
              </p>
            )}
          </div>

          {/* Monthly Contribution */}
          <div>
            <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="monthlyContribution"
                className={`input-field pl-8 ${validationErrors.monthlyContribution ? 'border-error-500' : ''}`}
                value={formData.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                min="0"
                step="100"
                aria-describedby={validationErrors.monthlyContribution ? 'monthlyContribution-error' : undefined}
              />
            </div>
            {validationErrors.monthlyContribution && (
              <p id="monthlyContribution-error" className="mt-1 text-sm text-error-600">
                {validationErrors.monthlyContribution}
              </p>
            )}
          </div>

          {/* Annual Return Rate */}
          <div>
            <label htmlFor="annualReturnRate" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return
            </label>
            <div className="relative">
              <input
                type="number"
                id="annualReturnRate"
                className={`input-field pr-8 ${validationErrors.annualReturnRate ? 'border-error-500' : ''}`}
                value={formData.annualReturnRate}
                onChange={(e) => handleInputChange('annualReturnRate', Number(e.target.value))}
                min="0"
                max="50"
                step="0.1"
                aria-describedby={validationErrors.annualReturnRate ? 'annualReturnRate-error' : undefined}
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            {validationErrors.annualReturnRate && (
              <p id="annualReturnRate-error" className="mt-1 text-sm text-error-600">
                {validationErrors.annualReturnRate}
              </p>
            )}
          </div>

          {/* Marginal Tax Rate */}
          <div>
            <label htmlFor="marginalTaxRate" className="block text-sm font-medium text-gray-700 mb-2">
              Marginal Tax Rate
            </label>
            <div className="relative">
              <input
                type="number"
                id="marginalTaxRate"
                className={`input-field pr-8 ${validationErrors.marginalTaxRate ? 'border-error-500' : ''}`}
                value={formData.marginalTaxRate}
                onChange={(e) => handleInputChange('marginalTaxRate', Number(e.target.value))}
                min="0"
                max="50"
                step="1"
                aria-describedby={validationErrors.marginalTaxRate ? 'marginalTaxRate-error' : undefined}
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
            {validationErrors.marginalTaxRate && (
              <p id="marginalTaxRate-error" className="mt-1 text-sm text-error-600">
                {validationErrors.marginalTaxRate}
              </p>
            )}
          </div>
        </div>

        {/* Time Horizon */}
        <div>
          <label htmlFor="timeHorizonYears" className="block text-sm font-medium text-gray-700 mb-2">
            Investment Time Horizon: {formData.timeHorizonYears} years
          </label>
          <input
            type="range"
            id="timeHorizonYears"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            value={formData.timeHorizonYears}
            onChange={(e) => handleInputChange('timeHorizonYears', Number(e.target.value))}
            min="1"
            max="50"
            step="1"
            aria-describedby={validationErrors.timeHorizonYears ? 'timeHorizonYears-error' : undefined}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 year</span>
            <span>50 years</span>
          </div>
          {validationErrors.timeHorizonYears && (
            <p id="timeHorizonYears-error" className="mt-1 text-sm text-error-600">
              {validationErrors.timeHorizonYears}
            </p>
          )}
        </div>

        {/* Fee Structures */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Fee Structures to Compare
            </label>
            <button
              type="button"
              onClick={addFeeStructure}
              disabled={formData.feeStructures.length >= 5}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              aria-label="Add fee structure"
            >
              <Plus className="w-4 h-4" />
              Add Fee
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.feeStructures.map((fee, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    className="input-field pr-8"
                    value={fee}
                    onChange={(e) => handleFeeStructureChange(index, Number(e.target.value))}
                    min="0"
                    max="10"
                    step="0.1"
                    aria-label={`Fee structure ${index + 1}`}
                  />
                  <span className="absolute right-3 top-2 text-gray-500">%</span>
                </div>
                {formData.feeStructures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeeStructure(index)}
                    className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                    aria-label={`Remove fee structure ${index + 1}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {validationErrors.feeStructures && (
            <p className="mt-1 text-sm text-error-600">
              {validationErrors.feeStructures}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4" />
              Calculate Fee Impact
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeeComparisonForm;