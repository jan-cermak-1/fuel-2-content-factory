// Account profiles for "View as Account" feature
// Each account has specific configurations that affect how content is customized

export const accountProfiles = [
  {
    id: 'acc-nike',
    name: 'Nike',
    logo: '👟',
    industry: 'Retail',
    segment: 'Enterprise',
    regions: ['EMEA', 'NA', 'APAC'],
    budget: '$50,000',
    budgetTier: 'high',
    teamSize: '15+ members',
    compliance: ['GDPR', 'CCPA'],
    features: ['Advanced Analytics', 'Multi-brand Management', 'Global Publishing'],
    customizations: {
      timeline: '3 months',
      approvalLevels: 3,
      contentVolume: 'high',
      preferredPlatforms: ['Instagram', 'TikTok', 'Twitter'],
    },
    metrics: {
      engagementRate: 4.2,
      followersGrowth: 12.5,
      contentPerformance: 89,
    },
    healthScore: 92,
    renewalDate: '2024-06-15',
    csm: 'Sarah Johnson',
  },
  {
    id: 'acc-ford',
    name: 'Ford',
    logo: '🚗',
    industry: 'Automotive',
    segment: 'Enterprise',
    regions: ['NA', 'EMEA'],
    budget: '$100,000',
    budgetTier: 'high',
    teamSize: '20+ members',
    compliance: ['GDPR', 'CCPA', 'FTC'],
    features: ['Crisis Management', 'Dealer Network', 'Global Publishing'],
    customizations: {
      timeline: '6 months',
      approvalLevels: 4,
      contentVolume: 'very high',
      preferredPlatforms: ['Facebook', 'LinkedIn', 'YouTube', 'Twitter'],
    },
    metrics: {
      engagementRate: 3.8,
      followersGrowth: 8.2,
      contentPerformance: 85,
    },
    healthScore: 88,
    renewalDate: '2024-09-01',
    csm: 'Filip',
  },
  {
    id: 'acc-adidas',
    name: 'Adidas',
    logo: '👟',
    industry: 'Retail',
    segment: 'Enterprise',
    regions: ['EMEA', 'APAC'],
    budget: '$45,000',
    budgetTier: 'high',
    teamSize: '12 members',
    compliance: ['GDPR'],
    features: ['Influencer Management', 'Sports Events', 'Global Publishing'],
    customizations: {
      timeline: '4 months',
      approvalLevels: 2,
      contentVolume: 'high',
      preferredPlatforms: ['Instagram', 'TikTok', 'YouTube'],
    },
    metrics: {
      engagementRate: 5.1,
      followersGrowth: 15.3,
      contentPerformance: 91,
    },
    healthScore: 95,
    renewalDate: '2024-08-01',
    csm: 'Elizabeth Choos',
  },
  {
    id: 'acc-generic',
    name: 'Generic SMB',
    logo: '🏢',
    industry: 'Various',
    segment: 'SMB',
    regions: ['NA'],
    budget: '$5,000',
    budgetTier: 'standard',
    teamSize: '2-3 members',
    compliance: [],
    features: ['Basic Analytics', 'Content Calendar'],
    customizations: {
      timeline: '6 weeks',
      approvalLevels: 1,
      contentVolume: 'low',
      preferredPlatforms: ['Facebook', 'Instagram'],
    },
    metrics: {
      engagementRate: 2.1,
      followersGrowth: 3.5,
      contentPerformance: 65,
    },
    healthScore: 72,
    renewalDate: '2024-04-01',
    csm: 'Support Team',
  },
  {
    id: 'acc-wellsfargo',
    name: 'Wells Fargo',
    logo: '🏦',
    industry: 'Finance',
    segment: 'Enterprise',
    regions: ['NA'],
    budget: '$75,000',
    budgetTier: 'high',
    teamSize: '10 members',
    compliance: ['FINRA', 'SEC', 'CCPA', 'SOC2'],
    features: ['Compliance Workflow', 'Risk Monitoring', 'Archive & Retention'],
    customizations: {
      timeline: '6 months',
      approvalLevels: 5,
      contentVolume: 'medium',
      preferredPlatforms: ['LinkedIn', 'Twitter', 'Facebook'],
    },
    metrics: {
      engagementRate: 1.8,
      followersGrowth: 4.2,
      contentPerformance: 78,
    },
    healthScore: 84,
    renewalDate: '2024-07-15',
    csm: 'Filip',
  },
  {
    id: 'acc-mayo',
    name: 'Mayo Clinic',
    logo: '🏥',
    industry: 'Healthcare',
    segment: 'Enterprise',
    regions: ['NA'],
    budget: '$40,000',
    budgetTier: 'high',
    teamSize: '8 members',
    compliance: ['HIPAA', 'FDA'],
    features: ['Medical Review Workflow', 'Patient Privacy', 'Educational Content'],
    customizations: {
      timeline: '4 months',
      approvalLevels: 4,
      contentVolume: 'medium',
      preferredPlatforms: ['Facebook', 'Twitter', 'LinkedIn', 'YouTube'],
    },
    metrics: {
      engagementRate: 2.5,
      followersGrowth: 6.8,
      contentPerformance: 82,
    },
    healthScore: 86,
    renewalDate: '2024-05-01',
    csm: 'Sarah Johnson',
  },
]

// Get account by ID
export function getAccountById(accountId) {
  return accountProfiles.find(acc => acc.id === accountId)
}

// Get accounts by industry
export function getAccountsByIndustry(industry) {
  return accountProfiles.filter(acc => acc.industry === industry)
}

// Get accounts by segment
export function getAccountsBySegment(segment) {
  return accountProfiles.filter(acc => acc.segment === segment)
}

// Get similar accounts (same industry and segment)
export function getSimilarAccounts(accountId) {
  const account = getAccountById(accountId)
  if (!account) return []
  return accountProfiles.filter(
    acc => acc.id !== accountId && 
    (acc.industry === account.industry || acc.segment === account.segment)
  )
}

// Get all industries
export function getAllIndustries() {
  return [...new Set(accountProfiles.map(acc => acc.industry))].filter(i => i !== 'Various')
}

// Get all regions
export function getAllRegions() {
  const regions = new Set()
  accountProfiles.forEach(acc => acc.regions.forEach(r => regions.add(r)))
  return [...regions]
}

export default accountProfiles
