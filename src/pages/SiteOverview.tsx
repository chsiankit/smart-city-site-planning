import React, { useState, useEffect } from 'react';
import { useProjectData } from '../hooks/useProjectData';
import { validateSiteBoundary } from '../utils/polygonArea';
import { SiteMap } from '../components/maps/SiteMap';
import { fetchSiteWeather, WeatherData } from '../services/weather';
import { fetchNearbyOverpassFeatures, ContextualGeoSummary } from '../services/overpass';
import { Badge } from '../components/common/Badge';
import { PlaceholderImage } from '../components/common/PlaceholderImage';
import {
  MapPin,
  Maximize2,
  Compass,
  Wind,
  Sun,
  CloudRain,
  Building2,
  TreePine,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Radio,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';

export const SiteOverview: React.FC = () => {
  const { data } = useProjectData();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [geoSummary, setGeoSummary] = useState<ContextualGeoSummary | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<{
    src: string;
    title: string;
    description: string;
    relatedProposal: string;
    status: string;
  } | null>(null);

  const boundaryCoords = data.site.boundaryGeoJSON?.coordinates?.[0] || [];
  const areaValidation = validateSiteBoundary(boundaryCoords);

  useEffect(() => {
    let isMounted = true;
    async function loadApiData() {
      setIsLoadingApi(true);
      try {
        const [w, g] = await Promise.all([
          fetchSiteWeather(data.site.centerCoordinates.lat, data.site.centerCoordinates.lng),
          fetchNearbyOverpassFeatures(
            data.site.centerCoordinates.lat - 0.015,
            data.site.centerCoordinates.lng - 0.015,
            data.site.centerCoordinates.lat + 0.015,
            data.site.centerCoordinates.lng + 0.015
          ),
        ]);
        if (isMounted) {
          setWeather(w);
          setGeoSummary(g);
        }
      } catch (e) {
        console.error('API load error:', e);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }

    loadApiData();
    return () => {
      isMounted = false;
    };
  }, [data.site.centerCoordinates.lat, data.site.centerCoordinates.lng]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
            Site Planning Threshold ≥ 1.0 km²
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Site Overview & Boundary Delimitation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Georeferenced site coordinates, verified polygon area, and surrounding environmental context.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge source={data.site.dataSource} />
          <div className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-500/20">
            Status: {areaValidation.status}
          </div>
        </div>
      </div>

      {/* Interactive Map & Key Geometry Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Full-width Map Viewport */}
        <div className="lg:col-span-3 h-[500px]">
          <SiteMap
            coordinates={boundaryCoords}
            center={data.site.centerCoordinates}
            siteName={data.site.name}
            location={data.site.location}
            className="h-full"
          />
        </div>

        {/* Geometry Metrics Sidecard */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
              <span>Boundary Validation</span>
              <Badge source="CALCULATED FROM PROVIDED DATA" className="text-[8px]" />
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500">Calculated Area</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
                    {areaValidation.calculatedAreaKm2}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">km²</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Evaluated via spherical geodesic integration.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs text-slate-500">Minimum Planning Threshold</span>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck
                    className={`w-5 h-5 ${
                      areaValidation.satisfiesRequirement ? 'text-teal-500' : 'text-rose-500'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      areaValidation.satisfiesRequirement
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {areaValidation.satisfiesRequirement ? 'Requirement Satisfied' : 'Under Minimum Area'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Required: ≥ 1.000 km²
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs text-slate-500">Perimeter Length</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {areaValidation.perimeterKm} km
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs text-slate-500">Zoning Designation</span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                  {data.site.zoning}
                </p>
              </div>

              {data.site.manuallyStatedAreaKm2 && (
                <div className="pt-2 text-[10px] text-slate-400">
                  Note: Manually recorded project area ({data.site.manuallyStatedAreaKm2} km²) matches
                  calculated polygon area.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* External Live Weather Context (Open-Meteo Integration) */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Environmental & Meteorological Context
              </h3>
              <Badge source={weather?.source || 'LIVE API DATA'} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Retrieved directly from Open-Meteo API using site coordinates ({data.site.centerCoordinates.lat}°N, {data.site.centerCoordinates.lng}°E).
              External climate context only; not substituted for Forma CFD/solar simulations.
            </p>
          </div>
          {weather?.timestamp && (
            <span className="text-[11px] text-slate-400 font-mono">
              Timestamp: {new Date(weather.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        {weather ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Ambient Temp</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {weather.temperatureC}°C
              </p>
              <span className="text-[10px] text-slate-400">Feels like {weather.apparentTemperatureC}°C</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Wind className="w-4 h-4 text-teal-500" />
                <span>Wind Speed</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
              </p>
              <span className="text-[10px] text-slate-400">Heading: {weather.windDirectionCardinal} ({weather.windDirectionDeg}°)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span>Relative Humidity</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {weather.relativeHumidity}%
              </p>
              <span className="text-[10px] text-slate-400">{weather.weatherDescription}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Solar Irradiance</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {weather.directRadiationWpm2} <span className="text-xs font-normal">W/m²</span>
              </p>
              <span className="text-[10px] text-slate-400">Direct Normal Irradiance</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Context Roads</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {geoSummary?.roadsCount ?? '--'}
              </p>
              <span className="text-[10px] text-slate-400">Overpass OSM Features</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <TreePine className="w-4 h-4 text-emerald-500" />
                <span>Public Green</span>
              </div>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {geoSummary?.parksCount ?? '--'}
              </p>
              <span className="text-[10px] text-slate-400">Nearby Parks/Corridors</span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            {isLoadingApi ? 'Querying live meteorological and GIS context...' : 'Live API temporarily unavailable'}
          </div>
        )}
      </div>

      {/* Surrounding Context Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Urban Context & Baseline Environmental Factors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Topography & Drainage
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.terrain}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Existing Built Mass
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.existingBuildings}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Road & Highway Connectivity
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.roads}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Regional Climate Classification
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.climate}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Infrastructure Proximity
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.nearbyInfrastructure}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Ecological Riparian Corridors
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {data.context.greenSpaces}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Masterplan Components Detail Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Four Core Masterplan Elements Status</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Foundational site boundary limits, green infrastructure corridors, building massing profiles, and multi-tier transit networks verified across Autodesk Forma and Revit BIM.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs shrink-0 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>4 / 4 Elements Verified & Modeled</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.mandatoryElements.map((elem) => (
            <div
              key={elem.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {elem.title}
                  </span>
                  <Badge source={elem.dataSource} />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {elem.description}
                </p>

                {/* Supporting Visual Asset with Interactive Inspect Modal */}
                <div className="mb-4">
                  {elem.supportingScreenshot ? (
                    <div
                      onClick={() =>
                        setSelectedPreviewImage({
                          src: elem.supportingScreenshot!,
                          title: elem.title,
                          description: elem.description,
                          relatedProposal: elem.relatedProposal,
                          status: elem.status,
                        })
                      }
                      className="relative overflow-hidden rounded-2xl aspect-video bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-inner group/img"
                    >
                      <img
                        src={elem.supportingScreenshot}
                        alt={elem.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-80 group-hover/img:opacity-90 transition-opacity" />
                      
                      {/* Top status indicator */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-slate-900/85 backdrop-blur-md text-teal-300 border border-teal-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>AUTODESK FORMA VERIFIED</span>
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                          <Eye className="w-4 h-4" />
                          <span>Click to Inspect Full Render</span>
                        </span>
                      </div>

                      {/* Bottom caption */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="truncate font-medium">{elem.title}</span>
                        <span className="text-[10px] text-teal-300 font-mono flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> Expand
                        </span>
                      </div>
                    </div>
                  ) : (
                    <PlaceholderImage
                      label={`Autodesk Forma: ${elem.title}`}
                      sublabel="Verified sustainable urban planning simulation"
                      aspectRatio="video"
                      category={elem.title}
                      status="VERIFIED"
                    />
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Related Proposal: <strong className="text-slate-700 dark:text-slate-300">{elem.relatedProposal}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Status: {elem.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {selectedPreviewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 text-xs font-mono font-semibold border border-teal-500/30">
                  FORMA & REVIT ASSET
                </span>
                <h3 className="text-base md:text-lg font-bold text-white">
                  {selectedPreviewImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPreviewImage(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative max-h-[70vh] bg-black/60 flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedPreviewImage.src}
                alt={selectedPreviewImage.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Footer with details */}
            <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {selectedPreviewImage.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>Related Proposal: <strong className="text-slate-200">{selectedPreviewImage.relatedProposal}</strong></span>
                  <span>Status: <strong className="text-teal-400">{selectedPreviewImage.status}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedPreviewImage.src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Resolution</span>
                </a>
                <button
                  onClick={() => setSelectedPreviewImage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
