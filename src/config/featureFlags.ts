type FeatureFlagLeaf = boolean

type FeatureFlagNode = {
  [key: string]: FeatureFlagLeaf | FeatureFlagNode
}

const DEFAULT_FEATURE_FLAGS = Object.freeze({
  showHome: {
    showRibbon: false,
    showHeroSection: true,
    showResearchInterests: true, // repurposed as the "Technical Skills" grid
    showExperience: true,
    showEducation: {
      main: true,
      showCourseDetailsInfo: false,
    },
    showAwards: false,
    showAchivement: false,
  },

  showProjectsPublications: {
    showArticles: {
      showGeneralArticles: false,
      showJournalArticles: false,
    },
    // Controls whether collapsible article sections start expanded (true) or collapsed (false)
    expandArticleSectionsByDefault: {
      generalArticles: false,
      journalArticles: false,
    },
    showProjects: {
      showResearchProjects: false,
      showTechnicalProjects: true,
      showOtherProjects: false,
    },
    // Controls whether collapsible project sections start expanded (true) or collapsed (false)
    expandProjectSectionsByDefault: {
      technicalProjects: true,
      otherProjects: false,
    },
    showPublications: false,
    showPosters: false,
  },

  showGallery: false,

  showBlog: false,

  showCocurricular: {
    showLeadershipOrganizations: false,
    showVolunteering: false,
  },

  showOngoingProjects: false,

  showInternshipCertifications: {
    showInternships: false,
    showCertifications: false,
  },

  showWorkshopsAttended: {
    showConferences: false,
    showFDPs: false,
    showWorkshops: {
      main: false,
      others: false,
    },
    showBootcamps: false,
    showOther: false,
  },

  showTeachings: {
    showCoursesTaught: false,
    showProjectsMentored: false,
    showOtherTeachings: false,
  },

  showAffiliations: {
    showAffiliations: false,
    showCollaborators: false,
    showMemberships: false,
  },

  showProfessionalActivity: {
    showInvitedTalks: false,
    showHostedEvents: {
      main: false,
      others: false,
    },
  },

  showResources: {
    main: false,
    showRibbon: false,
  },

  // Controls the "Did you know?" facts page (/facts) and its nav link.
  showFacts: false,

  // Controls the quote pane rendered between page content and the footer.
  showPageQuotePane: true,

  // Controls the subtitle/description line under each page's title.
  // Text for each page lives in src/content/profile_info/description.yml.
  // `enabled` is the master switch: when false, every page description is hidden
  // regardless of its per-page flag. When true, each page's own flag decides.
  showPageDescriptions: {
    enabled: false,
    projectsPublications: false,
    internshipCertifications: true,
    cocurricular: true,
    affiliations: true,
    resources: true,
    contact: true,
    ongoingProjects: true,
    professionalActivity: true,
    teachings: true,
    workshopsAttended: true,
    facts: true,
  },
}) satisfies FeatureFlagNode

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function resolveFlagNode(
  flagPath?: string | string[],
  source: FeatureFlagNode = featureFlags,
): FeatureFlagLeaf | FeatureFlagNode | undefined {
  if (!flagPath) return source

  const segments = Array.isArray(flagPath)
    ? flagPath
    : String(flagPath).split('.').filter(Boolean)

  let node: FeatureFlagLeaf | FeatureFlagNode | undefined = source

  for (const segment of segments) {
    if (!isPlainObject(node) || !(segment in node)) return undefined
    node = node[segment] as FeatureFlagLeaf | FeatureFlagNode
  }

  return node
}

function evaluateAll(node: FeatureFlagLeaf | FeatureFlagNode | undefined): boolean {
  if (typeof node === 'boolean') return node
  if (!isPlainObject(node)) return false

  const children = Object.values(node)
  if (children.length === 0) return false

  return children.every((child) =>
    evaluateAll(child as FeatureFlagLeaf | FeatureFlagNode),
  )
}

function evaluateAny(node: FeatureFlagLeaf | FeatureFlagNode | undefined): boolean {
  if (typeof node === 'boolean') return node
  if (!isPlainObject(node)) return false

  const children = Object.values(node)
  if (children.length === 0) return false

  return children.some((child) =>
    evaluateAny(child as FeatureFlagLeaf | FeatureFlagNode),
  )
}

export const featureFlags: FeatureFlagNode = DEFAULT_FEATURE_FLAGS

type FeatureCheckOptions = {
  mode?: 'all' | 'any'
}

export function isFeatureEnabled(
  flagPath?: string | string[],
  options: FeatureCheckOptions = {},
): boolean {
  const mode = options.mode === 'any' ? 'any' : 'all'
  const target = resolveFlagNode(flagPath, featureFlags)
  return mode === 'any' ? evaluateAny(target) : evaluateAll(target)
}

// Whether a given page's title description line should render.
// Gated by the master switch `showPageDescriptions.enabled`: if that is off,
// no page description shows; if on, the page's own flag decides.
export function isPageDescriptionEnabled(page: string): boolean {
  return (
    isFeatureEnabled('showPageDescriptions.enabled') &&
    isFeatureEnabled(`showPageDescriptions.${page}`)
  )
}
