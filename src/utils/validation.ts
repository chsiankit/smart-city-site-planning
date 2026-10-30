import { ProjectDataSchema, ProjectData } from '../data/schema';
import { validateSiteBoundary } from './polygonArea';

export interface ValidationErrorItem {
  field: string;
  category: 'Critical' | 'Warning' | 'Info';
  message: string;
  path: string;
}

export function validateProjectData(data: unknown): {
  isValid: boolean;
  errors: ValidationErrorItem[];
  parsedData: ProjectData | null;
} {
  const result = ProjectDataSchema.safeParse(data);
  const errors: ValidationErrorItem[] = [];

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors.push({
        field: issue.path.join('.'),
        category: 'Critical',
        message: issue.message,
        path: issue.path.join(' > '),
      });
    });
    return { isValid: false, errors, parsedData: null };
  }

  const project = result.data;

  // Domain checks
  // 1. Check Site Area (Project requirement: minimum 1.0 km²)
  const boundaryCoords = project.site.boundaryGeoJSON?.coordinates?.[0];
  if (!boundaryCoords || boundaryCoords.length < 3) {
    errors.push({
      field: 'site.boundaryGeoJSON',
      category: 'Critical',
      message: 'Site boundary GeoJSON has insufficient coordinates to form a polygon.',
      path: 'site > boundaryGeoJSON',
    });
  } else {
    const areaCheck = validateSiteBoundary(boundaryCoords);
    if (!areaCheck.satisfiesRequirement) {
      errors.push({
        field: 'site.calculatedAreaKm2',
        category: 'Warning',
        message: `Calculated area is ${areaCheck.calculatedAreaKm2} km², which is less than the planned 1.0 km² project threshold.`,
        path: 'site > calculatedAreaKm2',
      });
    }
  }

  // 2. Check Proposals count (Must have at least 2 proposals for comparative benchmarking)
  if (project.proposals.length < 2) {
    errors.push({
      field: 'proposals',
      category: 'Critical',
      message: `At least 2 design proposals are required for comparative benchmarking. Found ${project.proposals.length}.`,
      path: 'proposals',
    });
  }

  // 3. Check Land Use distribution sums to ~100%
  project.proposals.forEach((prop, idx) => {
    if (prop.landUseDistribution && prop.landUseDistribution.length > 0) {
      const sum = prop.landUseDistribution.reduce((acc, curr) => acc + curr.percent, 0);
      if (Math.abs(sum - 100) > 1) {
        errors.push({
          field: `proposals[${idx}].landUseDistribution`,
          category: 'Warning',
          message: `${prop.name} land use distribution sums to ${sum}%, expected 100%.`,
          path: `proposals > ${prop.name} > landUseDistribution`,
        });
      }
    }
  });

  // 4. Slide count check (5 to 7 slides)
  if (typeof project.submission.currentSlideCount === 'number') {
    const slides = project.submission.currentSlideCount;
    if (slides < 5 || slides > 7) {
      errors.push({
        field: 'submission.currentSlideCount',
        category: 'Warning',
        message: `Current slide count is ${slides}. The project deck target is 5 to 7 slides.`,
        path: 'submission > currentSlideCount',
      });
    }
  }

  return {
    isValid: errors.filter((e) => e.category === 'Critical').length === 0,
    errors,
    parsedData: project,
  };
}
