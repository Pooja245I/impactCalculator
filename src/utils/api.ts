import { CalculationInput, GrowthScenario, OptimizationResult, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status?: number, public details?: string[]) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0
    );
  }
}

export async function calculateGrowthScenarios(
  input: CalculationInput
): Promise<GrowthScenario[]> {
  const response = await apiRequest<ApiResponse<GrowthScenario[]>>('/api/calculate', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  
  return response.data;
}

export async function getOptimizationRecommendations(
  input: CalculationInput
): Promise<OptimizationResult> {
  const response = await apiRequest<ApiResponse<OptimizationResult>>('/api/optimize', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  
  return response.data;
}

export { ApiError };