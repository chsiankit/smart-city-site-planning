import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { validateSiteBoundary } from '../../utils/polygonArea';
import { Badge } from '../common/Badge';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, ShieldCheck } from 'lucide-react';

interface SiteMapProps {
  coordinates: [number, number][]; // [lng, lat]
  center: { lat: number; lng: number };
  siteName: string;
  location: string;
  className?: string;
  showContextOverlays?: boolean;
}

export const SiteMap: React.FC<SiteMapProps> = ({
  coordinates,
  center,
  siteName,
  location,
  className = '',
  showContextOverlays = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);

  const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite'>('standard');
  const [mapZoom, setMapZoom] = useState(15);
  const areaValidation = validateSiteBoundary(coordinates);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default marker icon issues in bundled environments
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 15,
        zoomControl: false,
      });

      // OpenStreetMap standard tile layer
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      map.on('zoomend', () => {
        setMapZoom(map.getZoom());
      });
    }

    const map = mapInstanceRef.current;

    // Draw GeoJSON Polygon if coordinates exist
    if (coordinates && coordinates.length >= 3) {
      if (polygonLayerRef.current) {
        map.removeLayer(polygonLayerRef.current);
      }

      // Convert [lng, lat] to Leaflet [lat, lng]
      const latLngs = coordinates.map((pt) => [pt[1], pt[0]] as [number, number]);

      const polygon = L.polygon(latLngs, {
        color: '#0F766E', // Teal primary
        weight: 3,
        opacity: 0.9,
        fillColor: '#14B8A6',
        fillOpacity: 0.25,
        dashArray: '6, 6',
      }).addTo(map);

      polygon.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <strong style="color: #102A43; font-size: 14px;">${siteName}</strong><br/>
          <span style="color: #64748B;">${location}</span><br/>
          <hr style="margin: 6px 0; border: none; border-top: 1px solid #E2E8F0;" />
          <strong>Calculated Area:</strong> ${areaValidation.calculatedAreaKm2} km²<br/>
          <strong>Perimeter:</strong> ${areaValidation.perimeterKm} km<br/>
          <strong>Site Threshold:</strong> <span style="color: ${areaValidation.satisfiesRequirement ? '#0F766E' : '#E11D48'}; font-weight: bold;">${areaValidation.status}</span>
        </div>
      `);

      polygonLayerRef.current = polygon;

      // Fit bounds to polygon
      map.fitBounds(polygon.getBounds(), { padding: [40, 40] });
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, center.lat, center.lng, siteName, location]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    if (polygonLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(polygonLayerRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 ${className}`}>
      {/* Map Header Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
          <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E
          </span>
          <Badge source="CALCULATED FROM PROVIDED DATA" className="text-[10px]" />
        </div>

        {/* Site Area Validation Pill */}
        <div
          className={`pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-md shadow-md text-xs font-bold ${
            areaValidation.satisfiesRequirement
              ? 'bg-teal-500/10 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-500/30'
              : 'bg-rose-500/10 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-500/30'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Area: {areaValidation.calculatedAreaKm2} km²</span>
          <span className="hidden sm:inline font-normal">| {areaValidation.status}</span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Map Control Bar Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400 transition-colors"
          title="Recenter Site Boundary"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 shadow">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded bg-teal-500 inline-block border border-teal-600" />
          <span>Site Boundary (1.28 km²)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          <span>Site Centroid</span>
        </div>
        <span className="text-slate-400">OSM Tile Provider</span>
      </div>
    </div>
  );
};
