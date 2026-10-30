import { ComparisonMetricConfig, Proposal } from '../data/schema';

export interface ProposalScoreResult {
  proposalId: string;
  proposalName: string;
  totalScore: number | null; // 0 - 100, or null if insufficient data
  normalizedMetrics: Record<string, number | null>; // 0 - 100 per metric
  metricValues: Record<string, number | null>;
  missingMetricsCount: number;
  availableMetricsCount: number;
}

/**
 * Normalizes metrics across all proposals using Min-Max scaling taking into account direction.
 * Higher is better: (val - min) / (max - min) * 100
 * Lower is better: (max - val) / (max - min) * 100
 * If min === max: 100 (if non-zero) or 50
 */
export function calculateNormalizedScores(
  proposals: Proposal[],
  metricsConfig: ComparisonMetricConfig[],
  customWeights?: Record<string, number>
): ProposalScoreResult[] {
  // Extract min and max per metric across valid proposal values
  const minMaxMap: Record<string, { min: number; max: number; count: number }> = {};

  metricsConfig.forEach((cfg) => {
    let min = Infinity;
    let max = -Infinity;
    let count = 0;

    proposals.forEach((p) => {
      const val = p.metrics?.[cfg.key];
      if (typeof val === 'number' && !isNaN(val)) {
        if (val < min) min = val;
        if (val > max) max = val;
        count++;
      }
    });

    minMaxMap[cfg.key] = { min, max, count };
  });

  return proposals.map((p) => {
    const normalizedMetrics: Record<string, number | null> = {};
    const metricValues: Record<string, number | null> = {};
    let weightedSum = 0;
    let totalWeight = 0;
    let missingCount = 0;
    let availableCount = 0;

    metricsConfig.forEach((cfg) => {
      const val = p.metrics?.[cfg.key];
      const weight = customWeights?.[cfg.key] ?? cfg.weight ?? 5;

      if (typeof val !== 'number' || isNaN(val)) {
        normalizedMetrics[cfg.key] = null;
        metricValues[cfg.key] = null;
        missingCount++;
        return;
      }

      metricValues[cfg.key] = val;
      availableCount++;

      const range = minMaxMap[cfg.key];
      let normScore = 100;

      if (range.min === range.max) {
        normScore = 80; // Baseline when uniform
      } else {
        if (cfg.direction === 'higher_is_better') {
          normScore = ((val - range.min) / (range.max - range.min)) * 100;
        } else if (cfg.direction === 'lower_is_better') {
          normScore = ((range.max - val) / (range.max - range.min)) * 100;
        } else {
          normScore = 75; // Neutral
        }
      }

      // Bound 0 - 100
      normScore = Math.max(0, Math.min(100, Math.round(normScore * 10) / 10));
      normalizedMetrics[cfg.key] = normScore;

      if (weight > 0) {
        weightedSum += normScore * weight;
        totalWeight += weight;
      }
    });

    // If more than half the metrics are missing, classify as insufficient data
    const hasEnoughData = availableCount > 0 && availableCount >= Math.ceil(metricsConfig.length * 0.4);
    const totalScore = hasEnoughData && totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : null;

    return {
      proposalId: p.id,
      proposalName: p.name,
      totalScore,
      normalizedMetrics,
      metricValues,
      missingMetricsCount: missingCount,
      availableMetricsCount: availableCount,
    };
  });
}
