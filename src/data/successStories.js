// Success stories for the Analytics Dashboard
// Case studies showing ROI and impact of content strategies

export const successStories = [
  {
    id: 'ss-1',
    accountId: 'acc-nike',
    accountName: 'Nike',
    tacticId: 'tac-1',
    tacticName: 'Influencer Partnerships',
    headline: '+35% engagement increase',
    summary: 'Nike implemented micro-influencer partnerships resulting in significant engagement boost across Instagram and TikTok.',
    metrics: {
      engagementIncrease: 35,
      reachIncrease: 48,
      conversionRate: 4.2,
      roi: 320,
    },
    usedBy: 180,
    testimonial: {
      quote: 'The micro-influencer strategy transformed our social presence. We saw immediate results within the first month.',
      author: 'Jessica Martinez',
      role: 'Social Media Director',
      company: 'Nike',
    },
    tags: ['Influencer', 'Engagement', 'Retail'],
    datePublished: '2024-01-10',
    featured: true,
  },
  {
    id: 'ss-2',
    accountId: 'acc-ford',
    accountName: 'Ford',
    tacticId: 'tac-10',
    tacticName: 'Crisis Response Protocol',
    headline: '100% completion rate',
    summary: 'Ford implemented comprehensive crisis communication protocols that prevented 3 potential PR incidents.',
    metrics: {
      responseTimeReduction: 65,
      incidentsPrevented: 3,
      sentimentRecovery: 92,
      roi: 450,
    },
    usedBy: 23,
    testimonial: {
      quote: 'Having pre-approved response templates saved us countless hours and protected our brand reputation.',
      author: 'Michael Chen',
      role: 'PR Director',
      company: 'Ford',
    },
    tags: ['Crisis Management', 'Automotive', 'Enterprise'],
    datePublished: '2024-01-05',
    featured: true,
  },
  {
    id: 'ss-3',
    accountId: 'acc-wellsfargo',
    accountName: 'Wells Fargo',
    tacticId: 'tac-8',
    tacticName: 'LinkedIn Lead Generation',
    headline: '200+ qualified leads/month',
    summary: 'Wells Fargo B2B division leveraged LinkedIn lead generation tactics to dramatically increase qualified leads.',
    metrics: {
      leadsPerMonth: 215,
      leadQualityScore: 8.5,
      costPerLead: 45,
      roi: 280,
    },
    usedBy: 67,
    testimonial: {
      quote: 'The LinkedIn strategy aligned perfectly with our B2B focus. Lead quality improved significantly.',
      author: 'David Thompson',
      role: 'Marketing VP',
      company: 'Wells Fargo',
    },
    tags: ['Lead Generation', 'Finance', 'B2B'],
    datePublished: '2023-12-20',
    featured: false,
  },
  {
    id: 'ss-4',
    accountId: 'acc-adidas',
    accountName: 'Adidas',
    tacticId: 'tac-3',
    tacticName: 'Social Listening & Monitoring',
    headline: '50% faster trend identification',
    summary: 'Adidas implemented comprehensive social listening that helped identify emerging trends 50% faster than competitors.',
    metrics: {
      trendIdentificationSpeed: 50,
      competitorBenchmarking: 85,
      sentimentAccuracy: 94,
      roi: 180,
    },
    usedBy: 245,
    testimonial: {
      quote: 'Social listening gave us a competitive edge. We now spot trends before they peak.',
      author: 'Emma Wilson',
      role: 'Digital Strategy Lead',
      company: 'Adidas',
    },
    tags: ['Social Listening', 'Retail', 'Competitive Intelligence'],
    datePublished: '2023-12-15',
    featured: true,
  },
  {
    id: 'ss-5',
    accountId: 'acc-mayo',
    accountName: 'Mayo Clinic',
    tacticId: 'tac-6',
    tacticName: 'Community Building',
    headline: '10K+ active community members',
    summary: 'Mayo Clinic built a thriving patient support community that improved engagement and health outcomes.',
    metrics: {
      communityMembers: 10500,
      activeEngagement: 42,
      patientSatisfaction: 4.8,
      roi: 220,
    },
    usedBy: 112,
    testimonial: {
      quote: 'Our community has become a valuable resource for patients. The engagement is genuine and meaningful.',
      author: 'Dr. Sarah Mitchell',
      role: 'Community Health Director',
      company: 'Mayo Clinic',
    },
    tags: ['Community', 'Healthcare', 'Patient Engagement'],
    datePublished: '2023-12-01',
    featured: false,
  },
]

// Get featured success stories
export function getFeaturedStories() {
  return successStories.filter(story => story.featured)
}

// Get success stories by account
export function getStoriesByAccount(accountId) {
  return successStories.filter(story => story.accountId === accountId)
}

// Get success stories by tactic
export function getStoriesByTactic(tacticId) {
  return successStories.filter(story => story.tacticId === tacticId)
}

// Get success stories by tag
export function getStoriesByTag(tag) {
  return successStories.filter(story => story.tags.includes(tag))
}

// Get all unique tags
export function getAllTags() {
  const tags = new Set()
  successStories.forEach(story => story.tags.forEach(tag => tags.add(tag)))
  return [...tags]
}

export default successStories
