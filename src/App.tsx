import React, { useState, useCallback } from 'react';
import { Calculator, BarChart3, Lightbulb } from 'lucide-react';
import FeeComparisonForm from './components/FeeComparisonForm';
import GrowthChart from './components/GrowthChart';
import OptimizationSuggestions from './components/OptimizationSuggestions';
import LoadingSpinner from './components/LoadingSpinner';
import { CalculationInput, GrowthScenario, OptimizationResult } from './types';
import { calculateGrowthScenarios, getOptimizationRecommendations, ApiError } from './utils/api';

function App() {
  const [scenarios, setScenarios] = useState<GrowthScenario[]>([]);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<CalculationInput | null>(null);

  const handleCalculation = useCallback(async (input: CalculationInput) => {
    setLoading(true);
    setError(null);
    setCurrentInput(input);

    try {
      // Calculate growth scenarios
      const growthData = await calculateGrowthScenarios(input);
      setScenarios(growthData);

      // Get optimization recommendations
      const optimizationData = await getOptimizationRecommendations(input);
      setOptimization(optimizationData);

    } catch (err) {
      console.error('Calculation failed:', err);
      
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.details && err.details.length > 0) {
          setError(`${err.message}: ${err.details.join(', ')}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // Clear previous results on error
      setScenarios([]);
      setOptimization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const hasResults = scenarios.length > 0 && optimization;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calculator className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fee Impact Calculator
              </h1>
              <p className="text-gray-600 mt-1">
                Compare investment fee structures and optimize your portfolio growth
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <FeeComparisonForm
              onSubmit={handleCalculation}
              loading={loading}
              error={error}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-8">
            {loading && (
              <div className="card">
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Calculating Fee Impact
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Analyzing your investment scenarios and generating optimization recommendations...
                  </p>
                </div>
              </div>
            )}

            {!loading && !hasResults && !error && (
              <div className="card">
                <div className="text-center py-12">
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="p-3 bg-success-100 rounded-lg">
                      <Lightbulb className="w-8 h-8 text-success-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Optimize Your Investments?
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Enter your investment parameters to see how different fee structures 
                    impact your long-term portfolio growth and get personalized recommendations.
                  </p>
                </div>
              </div>
            )}

            {hasResults && (
              <>
                {/* Growth Chart */}
                <GrowthChart 
                  scenarios={scenarios} 
                  timeHorizonYears={currentInput?.timeHorizonYears || 25} 
                />

                {/* Optimization Suggestions */}
                <OptimizationSuggestions optimization={optimization} />
              </>
            )}
          </div>
        </div>

        {/* Educational Content */}
        {!loading && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-primary-100 rounded-lg w-fit mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
                <p className="text-sm text-gray-600">
                  Our calculator uses compound interest formulas with monthly contributions 
                  and tax considerations for precise projections.
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-success-100 rounded-lg w-fit mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-success-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Visual Comparisons</h3>
                <p className="text-sm text-gray-600">
                  Compare up to 5 different fee structures side-by-side with 
                  interactive charts and detailed breakdowns.
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-warning-100 rounded-lg w-fit mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-warning-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get actionable advice on optimizing your investment strategy 
                  and specific fund recommendations.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              This calculator is for educational purposes only and should not be considered 
              as financial advice. Please consult with a qualified financial advisor for 
              personalized investment guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;