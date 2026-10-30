import { describe, it, expect } from 'vitest';
import { calculatePolygonAreaKm2, validateSiteBoundary } from '../utils/polygonArea';
import { calculateNormalizedScores } from '../utils/scoring';
import { validateProjectData } from '../utils/validation';
import projectData from '../data/project.json';

describe('Smart City Site Planning Unit Tests', () => {
  it('1. Calculates polygon area correctly for a ~1.25 km² site boundary', () => {
    const coords: [number, number][] = [
      [72.6800, 23.1560],
      [72.6900, 23.1560],
      [72.6910, 23.1670],
      [72.6805, 23.1670],
      [72.6800, 23.1560],
    ];
    const area = calculatePolygonAreaKm2(coords);
    expect(area).toBeGreaterThan(1.0);
    expect(area).toBeLessThan(1.5);
  });

  it('2. Validates mandatory minimum 1.0 km² area constraint', () => {
    const smallCoords: [number, number][] = [
      [72.6780, 23.1560],
      [72.6790, 23.1560],
      [72.6790, 23.1570],
      [72.6780, 23.1560],
    ];
    const validation = validateSiteBoundary(smallCoords);
    expect(validation.satisfiesRequirement).toBe(false);
    expect(validation.status).toBe('Under Minimum Threshold (< 1 km²)');

    const validBoundary = (projectData as any).site.boundaryGeoJSON.coordinates[0];
    const validCheck = validateSiteBoundary(validBoundary);
    expect(validCheck.satisfiesRequirement).toBe(true);
    expect(validCheck.status).toBe('Requirement Satisfied (≥ 1 km²)');
  });

  it('3. Calculates normalized weighted scores with direction rules', () => {
    const mockProposals: any = [
      {
        id: 'p1',
        name: 'Proposal 1',
        metrics: {
          embodiedCarbon: 300, // lower is better
          greenSpacePercent: 35, // higher is better
        },
      },
      {
        id: 'p2',
        name: 'Proposal 2',
        metrics: {
          embodiedCarbon: 400, // higher carbon -> lower score
          greenSpacePercent: 25, // lower green -> lower score
        },
      },
    ];

    const metricsConfig: any = [
      { key: 'embodiedCarbon', direction: 'lower_is_better', weight: 8 },
      { key: 'greenSpacePercent', direction: 'higher_is_better', weight: 8 },
    ];

    const scores = calculateNormalizedScores(mockProposals, metricsConfig);
    expect(scores[0].totalScore).toBeGreaterThan(scores[1].totalScore!);
    expect(scores[0].normalizedMetrics.embodiedCarbon).toBe(100);
    expect(scores[1].normalizedMetrics.embodiedCarbon).toBe(0);
  });

  it('4. Handles missing metrics gracefully without failing or defaulting to zero', () => {
    const mockProposals: any = [
      {
        id: 'p1',
        name: 'Proposal 1',
        metrics: {
          embodiedCarbon: null,
          greenSpacePercent: 30,
        },
      },
    ];

    const metricsConfig: any = [
      { key: 'embodiedCarbon', direction: 'lower_is_better', weight: 8 },
      { key: 'greenSpacePercent', direction: 'higher_is_better', weight: 8 },
    ];

    const scores = calculateNormalizedScores(mockProposals, metricsConfig);
    expect(scores[0].normalizedMetrics.embodiedCarbon).toBeNull();
    expect(scores[0].missingMetricsCount).toBe(1);
  });

  it('5. Validates central project.json against Zod schema', () => {
    const val = validateProjectData(projectData);
    expect(val.isValid).toBe(true);
    expect(val.errors.filter((e) => e.category === 'Critical')).toHaveLength(0);
    expect(val.parsedData?.project.name).toBe('SMART CITY SITE PLANNING');
  });
});
