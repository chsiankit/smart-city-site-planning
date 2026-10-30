import { z } from 'zod';

export const DataSourceBadgeEnum = z.enum([
  'TEAM VERIFIED',
  'LIVE API DATA',
  'CALCULATED FROM PROVIDED DATA',
  'PLACEHOLDER',
  'NOT AVAILABLE',
]);

export type DataSourceBadge = z.infer<typeof DataSourceBadgeEnum>;

export const StatusEnum = z.enum(['Completed', 'In Progress', 'Pending', 'Verified']);
export type Status = z.infer<typeof StatusEnum>;

export const LandUseItemSchema = z.object({
  name: z.string(),
  percent: z.number().min(0).max(100),
  color: z.string(),
  areaM2: z.number().optional(),
});

export const ProposalSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  designPhilosophy: z.string(),
  planningStrategy: z.string(),
  siteUtilization: z.string(),
  buildingsCount: z.number().nullable().optional(),
  grossFloorAreaM2: z.number().nullable().optional(),
  greenSpacePercent: z.number().min(0).max(100).nullable().optional(),
  transportationHighlights: z.string(),
  landUseDistribution: z.array(LandUseItemSchema),
  formaScreenshots: z.array(z.string()).default([]),
  teamNotes: z.string().optional(),
  metrics: z.record(z.string(), z.number().nullable()).default({}),
});

export const AnalysisModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  whatItMeasures: z.string(),
  formaScreenshot: z.string().nullable().optional(),
  proposalAResults: z.string(),
  proposalBResults: z.string(),
  unit: z.string(),
  keyInsight: z.string(),
  dataSource: DataSourceBadgeEnum,
  verificationStatus: StatusEnum,
  chartType: z.enum(['bar', 'radar', 'line', 'comparison']),
  chartData: z.array(
    z.object({
      label: z.string(),
      proposalA: z.number().nullable().optional(),
      proposalB: z.number().nullable().optional(),
      unit: z.string().optional(),
    })
  ),
});

export const MandatoryElementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: StatusEnum,
  supportingScreenshot: z.string().nullable().optional(),
  relatedProposal: z.string(),
  evidenceLink: z.string().optional(),
  dataSource: DataSourceBadgeEnum,
});

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  department: z.string(),
  institution: z.string().optional(),
  photoPlaceholder: z.string().optional(),
  email: z.string().optional(),
  portfolio: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

export const SmartCityFeatureSchema = z.object({
  id: z.string(),
  category: z.enum([
    'Transportation',
    'Green Infrastructure',
    'Energy',
    'Water',
    'Environmental Comfort',
    'Resilience',
  ]),
  title: z.string(),
  description: z.string(),
  status: z.enum(['Planned', 'Implemented', 'Verified']),
  relatedProposal: z.string(),
  relatedAnalysis: z.string().optional(),
  evidenceImage: z.string().nullable().optional(),
  dataSource: DataSourceBadgeEnum,
});

export const ChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  deliverableType: z.string(),
  completed: z.boolean(),
  evidenceRequired: z.string(),
});

export const GalleryItemSchema = z.object({
  id: z.string(),
  category: z.enum([
    'Forma Screenshots',
    'Proposal A',
    'Proposal B',
    'Analysis',
    'Revit',
    'Forma Board',
    'Final Renders',
  ]),
  title: z.string(),
  caption: z.string(),
  sourceLabel: DataSourceBadgeEnum,
  imageUrl: z.string(),
  proposalId: z.string().optional(),
});

export const ComparisonMetricConfigSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string(),
  direction: z.enum(['higher_is_better', 'lower_is_better', 'neutral']),
  weight: z.number().min(0).max(10),
  description: z.string(),
});

export const ProjectDataSchema = z.object({
  project: z.object({
    name: z.string(),
    subtitle: z.string(),
    competition: z.string().optional(),
    problemStatementId: z.string().optional(),
    organization: z.string().optional(),
    projectType: z.string().default('Independent Urban Planning Initiative'),
    category: z.string().default('Urban Planning & Architecture'),
    theme: z.string().default('Sustainable & Resilient Smart Cities'),
    abstract: z.string(),
    objectives: z.array(z.string()),
    noAiDeclaration: z.string(),
    workflowSteps: z.array(
      z.object({
        step: z.number(),
        name: z.string(),
        description: z.string(),
        software: z.string(),
      })
    ),
  }),
  site: z.object({
    name: z.string(),
    location: z.string(),
    centerCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    boundaryGeoJSON: z.object({
      type: z.literal('Polygon'),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    }),
    zoning: z.string(),
    climateZone: z.string(),
    terrainDescription: z.string(),
    manuallyStatedAreaKm2: z.number().nullable().optional(),
    dataSource: DataSourceBadgeEnum,
  }),
  context: z.object({
    terrain: z.string(),
    existingBuildings: z.string(),
    roads: z.string(),
    climate: z.string(),
    nearbyInfrastructure: z.string(),
    greenSpaces: z.string(),
  }),
  mandatoryElements: z.array(MandatoryElementSchema),
  proposals: z.array(ProposalSchema),
  analyses: z.record(z.string(), AnalysisModuleSchema),
  comparison: z.object({
    metrics: z.array(ComparisonMetricConfigSchema),
    recommendedProposalId: z.string().nullable().optional(),
    teamDecision: z.string(),
    teamJustification: z.string(),
    scoringDisclaimer: z.string(),
  }),
  smartCityFeatures: z.array(SmartCityFeatureSchema),
  team: z.array(TeamMemberSchema),
  mentor: z.object({
    facultySpoc: z.string(),
    facultyDepartment: z.string(),
    industryMentor: z.string().optional(),
    spocVerified: z.boolean(),
  }),
  gallery: z.array(GalleryItemSchema),
  video: z.object({
    title: z.string(),
    durationSeconds: z.number(),
    localVideoUrl: z.string().nullable().optional(),
    youtubeUrl: z.string().nullable().optional(),
    placeholderMessage: z.string(),
    chapters: z.array(
      z.object({
        timestamp: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
  }),
  revit: z.object({
    workflowSteps: z.array(
      z.object({
        order: z.number(),
        title: z.string(),
        status: StatusEnum,
        description: z.string(),
      })
    ),
    siteBimModelUrl: z.string().nullable().optional(),
    buildingDrawingBlockPreview: z.string().nullable().optional(),
    revitSyncConfirmed: z.boolean(),
    teamEvidenceNotes: z.string(),
    deliverableStatus: z.object({
      formaModel: StatusEnum,
      siteBimExport: StatusEnum,
      revitSync: StatusEnum,
      drawingBlock: StatusEnum,
    }),
  }),
  submission: z.object({
    milestonePhase: z.string().optional(),
    targetDate: z.string().optional(),
    deadline: z.string().optional(),
    presentationMinSlides: z.number().default(5),
    presentationMaxSlides: z.number().default(7),
    currentSlideCount: z.number().nullable().optional(),
    checklist: z.array(ChecklistItemSchema),
    driveFolderUrl: z.string().nullable().optional(),
  }),
  resources: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      url: z.string(),
      description: z.string(),
    })
  ),
  contact: z.object({
    primaryEmail: z.string(),
    department: z.string(),
    institution: z.string(),
  }),
});

export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type Proposal = z.infer<typeof ProposalSchema>;
export type AnalysisModule = z.infer<typeof AnalysisModuleSchema>;
export type MandatoryElement = z.infer<typeof MandatoryElementSchema>;
export type SmartCityFeature = z.infer<typeof SmartCityFeatureSchema>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type ComparisonMetricConfig = z.infer<typeof ComparisonMetricConfigSchema>;
