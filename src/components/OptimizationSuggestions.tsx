import React from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';
import { OptimizationResult, Recommendation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface OptimizationSuggestionsProps {
  optimization: OptimizationResult;
}

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ optimization }) => {
  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'primary':
        return <Lightbulb className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getRecommendationStyles = (type: Recommendation['type']) => {
    switch (type) {
      case 'primary':
        return {
          container: 'bg-primary-50 border-primary-200',
          icon: 'text-primary-600',
          title: 'text-primary-900',
          message: 'text-primary-800',
        };
      case 'warning':
        return {
          container: 'bg-warning-50 border-warning-200',
          icon: 'text-warning-600',
          title: 'text-warning-900',
          message: 'text-warning-800',
        };
      case 'info':
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-800',
        };
      case 'success':
        return {
          container: 'bg-success-50 border-success-200',
          icon: 'text-success-600',
          title: 'text-success-900',
          message: 'text-success-800',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-900',
          message: 'text-gray-800',
        };
    }
  };

  const getImpactBadge = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error-100 text-error-800">
            High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
            Medium Impact
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Low Impact
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Optimization Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Potential Savings */}
          <div className="text-center p-4 bg-success-50 rounded-lg border border-success-200">
            <DollarSign className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-success-900">
              {formatCurrency(optimization.potentialSavings)}
            </div>
            <div className="text-sm text-success-700">Potential Savings</div>
            <div className="text-xs text-success-600 mt-1">
              vs. highest fee scenario
            </div>
          </div>

          {/* Fee Savings */}
          <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
            <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary-900">
              {formatCurrency(optimization.feeSavings)}
            </div>
            <div className="text-sm text-primary-700">Fee Savings</div>
            <div className="text-xs text-primary-600 mt-1">
              in total fees paid
            </div>
          </div>

          {/* Best Fee Rate */}
          <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
            <CheckCircle className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning-900">
              {formatPercentage(optimization.bestScenario.feeRate)}
            </div>
            <div className="text-sm text-warning-700">Optimal Fee Rate</div>
            <div className="text-xs text-warning-600 mt-1">
              for maximum growth
            </div>
          </div>
        </div>

        {/* Best vs Worst Comparison */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Best vs. Worst Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <h4 className="font-medium text-success-900 mb-2">
                Best: {optimization.bestScenario.feeLabel}
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-success-700">Final Value:</span>
                  <span className="font-semibold text-success-900">
                    {formatCurrency(optimization.bestScenario.finalBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-success-700">Total Fees:</span>
                  <span className="font-semibold text-success-900">
                    {formatCurrency(optimization.bestScenario.totalFeesPaid)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-error-50 rounded-lg border border-error-200">
              <h4 className="font-medium text-error-900 mb-2">
                Worst: {optimization.worstScenario.feeLabel}
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-error-700">Final Value:</span>
                  <span className="font-semibold text-error-900">
                    {formatCurrency(optimization.worstScenario.finalBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-error-700">Total Fees:</span>
                  <span className="font-semibold text-error-900">
                    {formatCurrency(optimization.worstScenario.totalFeesPaid)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h2>
        </div>

        <div className="space-y-4">
          {optimization.recommendations.map((recommendation, index) => {
            const styles = getRecommendationStyles(recommendation.type);
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${styles.container}`}
                role="article"
                aria-labelledby={`recommendation-${index}-title`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 ${styles.icon}`}>
                    {getRecommendationIcon(recommendation.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        id={`recommendation-${index}-title`}
                        className={`font-semibold ${styles.title}`}
                      >
                        {recommendation.title}
                      </h3>
                      {getImpactBadge(recommendation.impact)}
                      {recommendation.actionable && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Actionable
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${styles.message}`}>
                      {recommendation.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Tips */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Tips</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Consider tax-advantaged accounts (401k, IRA) to maximize growth</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Review and rebalance your portfolio annually</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Automate investments to benefit from dollar-cost averaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Compare expense ratios when selecting funds or ETFs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationSuggestions;