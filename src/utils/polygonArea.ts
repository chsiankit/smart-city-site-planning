/**
 * Geospatial polygon area and perimeter calculator.
 * Uses the spherical projection formula for surface area on Earth (WGS84 mean radius = 6378137m).
 * Coordinates format: [longitude, latitude] in degrees.
 */

const EARTH_RADIUS_METERS = 6378137;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates geodesic area of a polygon in square kilometers.
 * @param coordinates Array of [longitude, latitude] points in degrees
 * @returns Area in square kilometers (km²)
 */
export function calculatePolygonAreaKm2(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 3) {
    return 0;
  }

  // Ensure polygon is closed for calculation
  const ring = [...coordinates];
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first);
  }

  let total = 0;
  const len = ring.length;

  for (let i = 0; i < len - 1; i++) {
    const p1 = ring[i];
    const p2 = ring[i + 1];

    const lambda1 = toRadians(p1[0]); // lng
    const phi1 = toRadians(p1[1]);     // lat
    const lambda2 = toRadians(p2[0]); // lng
    const phi2 = toRadians(p2[1]);     // lat

    total += (lambda2 - lambda1) * (2 + Math.sin(phi1) + Math.sin(phi2));
  }

  const areaM2 = Math.abs((total * EARTH_RADIUS_METERS * EARTH_RADIUS_METERS) / 2.0);
  return areaM2 / 1_000_000;
}

/**
 * Great-circle distance between two [lng, lat] points in km using Haversine formula
 */
export function calculateDistanceKm(p1: [number, number], p2: [number, number]): number {
  const lon1 = toRadians(p1[0]);
  const lat1 = toRadians(p1[1]);
  const lon2 = toRadians(p2[0]);
  const lat2 = toRadians(p2[1]);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (EARTH_RADIUS_METERS * c) / 1000;
}

/**
 * Calculates perimeter of a polygon in kilometers
 */
export function calculatePolygonPerimeterKm(coordinates: [number, number][]): number {
  if (!coordinates || coordinates.length < 2) return 0;
  let perimeter = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    perimeter += calculateDistanceKm(coordinates[i], coordinates[i + 1]);
  }
  return perimeter;
}

export type AreaValidationResult = {
  calculatedAreaKm2: number;
  perimeterKm: number;
  satisfiesRequirement: boolean; // >= 1.0 km²
  status: 'Requirement Satisfied (≥ 1 km²)' | 'Under Minimum Threshold (< 1 km²)' | 'Missing Coordinates';
  vertexCount: number;
};

export function validateSiteBoundary(coordinates: [number, number][] | undefined): AreaValidationResult {
  if (!coordinates || coordinates.length < 3) {
    return {
      calculatedAreaKm2: 0,
      perimeterKm: 0,
      satisfiesRequirement: false,
      status: 'Missing Coordinates',
      vertexCount: 0,
    };
  }

  const area = calculatePolygonAreaKm2(coordinates);
  const perimeter = calculatePolygonPerimeterKm(coordinates);
  const satisfies = area >= 1.0;

  return {
    calculatedAreaKm2: Number(area.toFixed(3)),
    perimeterKm: Number(perimeter.toFixed(2)),
    satisfiesRequirement: satisfies,
    status: satisfies ? 'Requirement Satisfied (≥ 1 km²)' : 'Under Minimum Threshold (< 1 km²)',
    vertexCount: coordinates.length,
  };
}
