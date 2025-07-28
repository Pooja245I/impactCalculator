import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { GrowthScenario } from '../types';
import { formatCurrency, getChartColors } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GrowthChartProps {
  scenarios: GrowthScenario[];
  timeHorizonYears: number;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ scenarios, timeHorizonYears }) => {
  const chartData = useMemo(() => {
    if (!scenarios.length) return null;

    const years = Array.from({ length: timeHorizonYears }, (_, i) => i + 1);
    const colors = getChartColors(scenarios.length);

    return {
      labels: years,
      datasets: scenarios.map((scenario, index) => ({
        label: scenario.feeLabel,
        data: scenario.yearlyData.map(data => data.balance),
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0.1,
        fill: false,
      })),
    };
  }, [scenarios, timeHorizonYears]);

  const chartOptions: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      title: {
        display: true,
        text: 'Portfolio Growth Comparison Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            const year = context[0].label;
            return `Year ${year}`;
          },
          label: (context) => {
            const scenario = scenarios[context.datasetIndex];
            const yearData = scenario.yearlyData[context.dataIndex];
            const value = context.parsed.y;
            
            return [
              `${context.dataset.label}: ${formatCurrency(value)}`,
              `Fees Paid: ${formatCurrency(yearData.totalFeesPaid)}`,
              `Net Gains: ${formatCurrency(yearData.grossGains)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Years',
          font: {
            size: 12,
            weight: '600',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Portfolio Value',
          font: {
            size: 12,
            weight: '600',
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number, { compact: true });
          },
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round' as const,
        borderCapStyle: 'round' as const,
      },
    },
  }), [scenarios]);

  if (!chartData) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="h-96 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Portfolio Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => {
            const colors = getChartColors(scenarios.length);
            return (
              <div
                key={scenario.feeRate}
                className="p-4 rounded-lg border-2"
                style={{ borderColor: colors[index] + '40', backgroundColor: colors[index] + '08' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="font-medium text-gray-900">{scenario.feeLabel}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Final Value:</span>
                    <span className="font-semibold">{formatCurrency(scenario.finalBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fees:</span>
                    <span className="text-error-600">{formatCurrency(scenario.totalFeesPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Gains:</span>
                    <span className="text-success-600">{formatCurrency(scenario.netGains)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GrowthChart;