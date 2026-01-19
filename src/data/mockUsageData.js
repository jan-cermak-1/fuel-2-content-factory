// Mock usage data from app.emplifi.io
// Simulates real usage metrics, trends, and analytics

// 7-day trend data generator
function generateTrendData(baseValue, volatility = 0.15) {
  const data = []
  let current = baseValue
  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * current
    current = Math.max(1, current + change)
    data.push(Math.round(current))
  }
  return data
}

export const mockUsageData = {
  // Overall metrics
  summary: {
    totalObjectives: 24,
    totalTactics: 89,
    totalBestPractices: 156,
    totalSteps: 312,
    avgQualityScore: 82,
    avgCompletionRate: 76,
    contentHealthScore: 85,
    activeAccounts: 245,
  },
  
  // Trend data (7 days)
  trends: {
    objectives: generateTrendData(24, 0.05),
    tactics: generateTrendData(89, 0.08),
    adoption: generateTrendData(245, 0.1),
    completionRate: generateTrendData(76, 0.05),
    qualityScore: generateTrendData(82, 0.03),
  },
  
  // Top performing content
  topPerformers: [
    {
      id: 'tac-3',
      name: 'Social Listening & Monitoring',
      type: 'tactic',
      usageCount: 245,
      completionRate: 89,
      qualityScore: 94,
      trend: 'up',
      trendValue: 12,
    },
    {
      id: 'tac-2',
      name: 'Content Calendar Strategy',
      type: 'tactic',
      usageCount: 220,
      completionRate: 91,
      qualityScore: 91,
      trend: 'up',
      trendValue: 8,
    },
    {
      id: 'bp-5',
      name: 'Optimal Posting Schedule',
      type: 'bestPractice',
      usageCount: 201,
      completionRate: 94,
      qualityScore: 87,
      trend: 'up',
      trendValue: 5,
    },
    {
      id: 'bp-4',
      name: 'Content Pillar Strategy',
      type: 'bestPractice',
      usageCount: 189,
      completionRate: 88,
      qualityScore: 93,
      trend: 'stable',
      trendValue: 1,
    },
    {
      id: 'tac-1',
      name: 'Influencer Partnerships',
      type: 'tactic',
      usageCount: 180,
      completionRate: 82,
      qualityScore: 89,
      trend: 'up',
      trendValue: 15,
    },
  ],
  
  // Lowest completion content (needs attention)
  lowestCompletion: [
    {
      id: 'tac-11',
      name: 'Reputation Monitoring',
      type: 'tactic',
      usageCount: 19,
      completionRate: 32,
      qualityScore: 65,
      trend: 'down',
      trendValue: -8,
    },
    {
      id: 'tac-10',
      name: 'Crisis Response Protocol',
      type: 'tactic',
      usageCount: 23,
      completionRate: 41,
      qualityScore: 68,
      trend: 'stable',
      trendValue: 2,
    },
    {
      id: 'bp-23',
      name: 'Alert Threshold Configuration',
      type: 'bestPractice',
      usageCount: 10,
      completionRate: 45,
      qualityScore: 63,
      trend: 'down',
      trendValue: -5,
    },
    {
      id: 'tac-9',
      name: 'Social Media Contests & Giveaways',
      type: 'tactic',
      usageCount: 34,
      completionRate: 48,
      qualityScore: 71,
      trend: 'up',
      trendValue: 3,
    },
  ],
  
  // ROI indicators
  roiIndicators: [
    {
      tacticId: 'tac-1',
      tacticName: 'Influencer Partnerships',
      adoption: 180,
      impact: 'high',
      linkedRenewals: 23,
      linkedUpsells: 8,
      revenue: 125000,
    },
    {
      tacticId: 'tac-3',
      tacticName: 'Social Monitoring',
      adoption: 245,
      impact: 'high',
      linkedRenewals: 31,
      linkedUpsells: 12,
      revenue: 186000,
    },
    {
      tacticId: 'tac-2',
      tacticName: 'Content Calendar Strategy',
      adoption: 220,
      impact: 'high',
      linkedRenewals: 28,
      linkedUpsells: 9,
      revenue: 152000,
    },
    {
      tacticId: 'tac-5',
      tacticName: 'Paid Social Campaigns',
      adoption: 156,
      impact: 'medium',
      linkedRenewals: 18,
      linkedUpsells: 6,
      revenue: 98000,
    },
    {
      tacticId: 'tac-4',
      tacticName: 'SEO-Optimized Social Content',
      adoption: 134,
      impact: 'medium',
      linkedRenewals: 15,
      linkedUpsells: 4,
      revenue: 78000,
    },
  ],
  
  // Risk alerts
  riskAlerts: [
    {
      id: 'risk-1',
      type: 'churn',
      severity: 'high',
      title: '5 accounts have objectives but 0 tactics completed',
      description: 'These accounts may be at risk of churning due to low engagement with assigned content.',
      affectedAccounts: ['SMB Corp', 'TechStart Inc', 'Local Retail', 'Small Biz Co', 'Startup XYZ'],
      suggestedAction: 'Schedule check-in calls with CSM',
      createdAt: '2024-01-14T10:00:00Z',
    },
    {
      id: 'risk-2',
      type: 'quality',
      severity: 'medium',
      title: '12 tactics have quality scores below 70',
      description: 'Content with low quality scores may negatively impact customer outcomes.',
      affectedItems: ['tac-9', 'tac-10', 'tac-11', 'bp-18', 'bp-20', 'bp-21', 'bp-22', 'bp-23'],
      suggestedAction: 'Review and improve content quality',
      createdAt: '2024-01-13T14:30:00Z',
    },
    {
      id: 'risk-3',
      type: 'coverage',
      severity: 'medium',
      title: 'Healthcare industry has only 3 released tactics',
      description: 'Low content coverage for Healthcare may limit value for accounts in this segment.',
      suggestedAction: 'Generate Healthcare-specific content with AI',
      createdAt: '2024-01-12T09:00:00Z',
    },
  ],
  
  // Gap analysis (AI-powered recommendations)
  gapAnalysis: [
    {
      id: 'gap-1',
      category: 'industry',
      title: 'Finance industry lacks TikTok tactics',
      description: 'Finance accounts are requesting TikTok strategies but we have no content for this platform-industry combination.',
      priority: 'high',
      suggestedItems: 3,
      targetIndustry: 'Finance',
      targetPlatform: 'TikTok',
    },
    {
      id: 'gap-2',
      category: 'region',
      title: 'APAC region has low Influencer coverage',
      description: 'Only 2 influencer-related tactics are localized for APAC markets.',
      priority: 'medium',
      suggestedItems: 5,
      targetRegion: 'APAC',
    },
    {
      id: 'gap-3',
      category: 'seasonal',
      title: 'Q2 predicted demand: Social Commerce',
      description: 'Based on historical data and trends, expect 40% increase in social commerce content requests.',
      priority: 'high',
      suggestedItems: 8,
      predictedDemandIncrease: 40,
    },
    {
      id: 'gap-4',
      category: 'conversion',
      title: 'Only 2 Conversion-focused objectives',
      description: 'We have 12 Awareness objectives but only 2 focused on Conversion.',
      priority: 'medium',
      suggestedItems: 4,
      currentCount: 2,
      recommendedCount: 6,
    },
  ],
  
  // Usage by industry
  usageByIndustry: [
    { industry: 'Retail', accounts: 89, avgCompletion: 82, avgQuality: 85 },
    { industry: 'Finance', accounts: 45, avgCompletion: 71, avgQuality: 79 },
    { industry: 'Tech', accounts: 67, avgCompletion: 78, avgQuality: 83 },
    { industry: 'Healthcare', accounts: 28, avgCompletion: 68, avgQuality: 76 },
    { industry: 'Other', accounts: 16, avgCompletion: 65, avgQuality: 72 },
  ],
  
  // Usage by region
  usageByRegion: [
    { region: 'NA', accounts: 145, avgCompletion: 79, avgQuality: 84 },
    { region: 'EMEA', accounts: 72, avgCompletion: 74, avgQuality: 81 },
    { region: 'APAC', accounts: 28, avgCompletion: 68, avgQuality: 77 },
  ],
}

// Helper functions
export function getOverallMetrics() {
  return mockUsageData.summary
}

export function getTrendData(metric) {
  return mockUsageData.trends[metric] || []
}

export function getTopPerformers(limit = 5) {
  return mockUsageData.topPerformers.slice(0, limit)
}

export function getLowestCompletion(limit = 5) {
  return mockUsageData.lowestCompletion.slice(0, limit)
}

export function getRiskAlerts(severity = null) {
  if (!severity) return mockUsageData.riskAlerts
  return mockUsageData.riskAlerts.filter(alert => alert.severity === severity)
}

export function getGapAnalysis(priority = null) {
  if (!priority) return mockUsageData.gapAnalysis
  return mockUsageData.gapAnalysis.filter(gap => gap.priority === priority)
}

export function getROIIndicators() {
  return mockUsageData.roiIndicators
}

export default mockUsageData
