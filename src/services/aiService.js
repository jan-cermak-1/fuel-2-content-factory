// AI Service - Mock implementation for prototype
// In production, this would connect to OpenAI/Claude API

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Random helper
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Mock content templates
const objectiveTemplates = [
  { name: 'Increase Brand Awareness by {percent}%', metrics: ['Brand mention growth', 'Share of voice', 'Reach'] },
  { name: 'Boost Customer Engagement by {percent}%', metrics: ['Engagement rate', 'Comments per post', 'Shares'] },
  { name: 'Drive Website Traffic from Social', metrics: ['Click-through rate', 'Social referrals', 'Bounce rate'] },
  { name: 'Generate {count} Qualified Leads per Month', metrics: ['Lead volume', 'Cost per lead', 'Conversion rate'] },
  { name: 'Improve Customer Satisfaction Score', metrics: ['CSAT score', 'Response time', 'Resolution rate'] },
]

const tacticTemplates = [
  { name: 'Influencer Partnership Campaign', products: ['influencer', 'analytics'] },
  { name: 'Content Calendar Optimization', products: ['social-marketing'] },
  { name: 'Social Listening & Monitoring', products: ['listening', 'analytics'] },
  { name: 'Community Building Initiative', products: ['care', 'social-marketing'] },
  { name: 'Paid Social Advertising', products: ['social-marketing', 'analytics'] },
  { name: 'User-Generated Content Campaign', products: ['ugc', 'social-marketing'] },
  { name: 'Crisis Response Preparedness', products: ['care', 'listening'] },
]

const bestPracticeTemplates = [
  'Set up tracking and analytics',
  'Define clear KPIs and success metrics',
  'Create content templates and guidelines',
  'Establish approval workflow',
  'Monitor competitor activity',
  'Optimize posting schedule',
  'A/B test creative variations',
  'Build engagement playbook',
]

const stepTemplates = [
  'Research and analyze current state',
  'Define goals and objectives',
  'Set up required tools and integrations',
  'Create initial content drafts',
  'Review and approve content',
  'Schedule and publish content',
  'Monitor performance metrics',
  'Iterate based on results',
]

const industryAdaptations = {
  'Banking & Financial Services': {
    tone: 'professional and trustworthy',
    additions: ['GDPR compliance', 'regulatory considerations', 'ROI focus'],
    terminology: { 'customer': 'client', 'user': 'account holder' },
  },
  Healthcare: {
    tone: 'empathetic and authoritative',
    additions: ['HIPAA compliance', 'patient privacy', 'clinical accuracy'],
    terminology: { 'customer': 'patient', 'product': 'solution' },
  },
  Retail: {
    tone: 'engaging and promotional',
    additions: ['seasonal trends', 'visual content', 'promotions'],
    terminology: { 'user': 'shopper', 'engagement': 'interaction' },
  },
  'Software & Technology': {
    tone: 'innovative and technical',
    additions: ['feature highlights', 'integration benefits', 'developer focus'],
    terminology: { 'customer': 'user', 'purchase': 'subscription' },
  },
}

const regionAdaptations = {
  'North America': { language: 'en-US', culturalNotes: 'Direct communication, fast-paced' },
  'Western Europe': { language: 'en-UK', culturalNotes: 'Formal tone, GDPR emphasis' },
  'East Asia': { language: 'localized', culturalNotes: 'Relationship-focused, visual content' },
  'South America': { language: 'es/pt', culturalNotes: 'Warm tone, community focus' },
}

// Main AI Service
export const aiService = {
  /**
   * Generate content suggestions based on type and prompt
   */
  generateContent: async (type, prompt, context = {}) => {
    await delay(randomInt(1200, 2500))
    
    const suggestions = []
    const count = 3
    
    for (let i = 0; i < count; i++) {
      if (type === 'objective') {
        const template = objectiveTemplates[i % objectiveTemplates.length]
        const percent = randomInt(15, 40)
        const leadCount = randomInt(50, 200)
        
        suggestions.push({
          id: `suggestion-${Date.now()}-${i}`,
          name: template.name.replace('{percent}', percent).replace('{count}', leadCount),
          description: `Strategic initiative to ${prompt || 'achieve business goals'}. This objective focuses on measurable outcomes and sustainable growth through social media channels.`,
          metrics: template.metrics,
          confidence: (0.95 - i * 0.1).toFixed(2),
          reasoning: `Based on your input "${prompt?.slice(0, 50) || 'brand awareness'}...", this aligns with common ${type} patterns.`,
        })
      } else if (type === 'tactic') {
        const template = tacticTemplates[i % tacticTemplates.length]
        suggestions.push({
          id: `suggestion-${Date.now()}-${i}`,
          name: template.name,
          description: `Implement ${template.name.toLowerCase()} to support your objective. This tactic leverages best practices and proven methodologies.`,
          requiredProducts: template.products,
          confidence: (0.92 - i * 0.08).toFixed(2),
        })
      } else if (type === 'bestPractice') {
        suggestions.push({
          id: `suggestion-${Date.now()}-${i}`,
          name: bestPracticeTemplates[i % bestPracticeTemplates.length],
          description: `Essential practice for successful implementation. Follow industry standards and proven approaches.`,
          confidence: (0.90 - i * 0.07).toFixed(2),
        })
      } else if (type === 'step') {
        suggestions.push({
          id: `suggestion-${Date.now()}-${i}`,
          name: stepTemplates[i % stepTemplates.length],
          description: `Actionable step to progress toward your goals.`,
          confidence: (0.88 - i * 0.06).toFixed(2),
        })
      }
    }
    
    return {
      suggestions,
      generationTime: `${(randomInt(12, 25) / 10).toFixed(1)}s`,
      tokensUsed: randomInt(150, 350),
    }
  },

  /**
   * Generate variants for different segments (regions, industries, etc.)
   */
  generateVariants: async (content, segments) => {
    await delay(randomInt(1500, 3000))
    
    const variants = {}
    
    for (const segment of segments) {
      const adaptation = industryAdaptations[segment] || regionAdaptations[segment] || {}
      
      variants[segment] = {
        name: `${content.name} for ${segment}`,
        description: content.description + (adaptation.additions 
          ? ` Includes focus on ${adaptation.additions.join(', ')}.`
          : ''),
        adaptations: [
          `Adapted tone: ${adaptation.tone || 'professional'}`,
          ...(adaptation.additions || ['localized content', 'regional compliance']),
        ],
        confidence: (0.85 + Math.random() * 0.1).toFixed(2),
      }
    }
    
    return {
      variants,
      generationTime: `${(randomInt(15, 30) / 10).toFixed(1)}s`,
    }
  },

  /**
   * Improve existing content
   */
  improveContent: async (content, instruction) => {
    await delay(randomInt(1000, 2000))
    
    const improvements = {
      'Make it more specific': {
        suffix: ' with measurable targets and clear timeline',
        changes: ['Added measurable target', 'Specified timeline'],
      },
      'Add metrics': {
        suffix: ' tracking key performance indicators',
        changes: ['Added KPI focus', 'Included measurement criteria'],
      },
      'Simplify language': {
        transform: (text) => text.replace(/utilize/g, 'use').replace(/implement/g, 'set up'),
        changes: ['Simplified terminology', 'Reduced complexity'],
      },
      'Make it actionable': {
        suffix: ' with clear next steps and responsibilities',
        changes: ['Added action items', 'Clarified ownership'],
      },
    }
    
    const improvement = improvements[instruction] || improvements['Make it more specific']
    
    let improved = content.description || content.name
    if (improvement.transform) {
      improved = improvement.transform(improved)
    } else if (improvement.suffix) {
      improved = improved + improvement.suffix
    }
    
    return {
      original: content.description || content.name,
      improved,
      changes: improvement.changes.map(change => ({
        type: 'improvement',
        description: change,
      })),
      confidence: (0.85 + Math.random() * 0.1).toFixed(2),
    }
  },

  /**
   * Generate child elements (e.g., tactics for objective)
   */
  generateChildren: async (parentItem, childType, count = 3) => {
    await delay(randomInt(1500, 2800))
    
    const children = []
    let templates = []
    
    if (childType === 'tactic') {
      templates = tacticTemplates
    } else if (childType === 'bestPractice') {
      templates = bestPracticeTemplates.map(name => ({ name }))
    } else if (childType === 'step') {
      templates = stepTemplates.map(name => ({ name }))
    }
    
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length]
      children.push({
        id: `generated-${Date.now()}-${i}`,
        name: template.name || template,
        description: `Generated ${childType} for "${parentItem.name}". Aligned with parent goals and best practices.`,
        requiredProducts: template.products || [],
        confidence: (0.90 - i * 0.05).toFixed(2),
      })
    }
    
    return {
      children,
      generationTime: `${(randomInt(15, 28) / 10).toFixed(1)}s`,
      reasoning: `Based on "${parentItem.name}", these ${childType}s are commonly used for similar objectives.`,
    }
  },

  /**
   * Suggest products based on content
   */
  suggestProducts: async (content) => {
    await delay(randomInt(500, 1000))
    
    const contentLower = (content.name + ' ' + (content.description || '')).toLowerCase()
    
    const keywords = {
      'influencer': ['influencer', 'partnership', 'creator', 'ambassador'],
      'listening': ['monitoring', 'sentiment', 'listening', 'mentions', 'track', 'crisis'],
      'care': ['response', 'customer service', 'inbox', 'support', 'community', 'engagement'],
      'analytics': ['metrics', 'report', 'dashboard', 'performance', 'track', 'measure', 'roi'],
      'social-marketing': ['publish', 'schedule', 'calendar', 'post', 'content', 'campaign'],
      'ugc': ['user-generated', 'ugc', 'customer content', 'community content'],
    }
    
    const suggestions = []
    
    for (const [productId, productKeywords] of Object.entries(keywords)) {
      const matches = productKeywords.filter(kw => contentLower.includes(kw))
      if (matches.length > 0) {
        suggestions.push({
          id: productId,
          confidence: Math.min(0.95, 0.6 + matches.length * 0.15).toFixed(2),
          matchedKeywords: matches,
        })
      }
    }
    
    // Sort by confidence
    suggestions.sort((a, b) => parseFloat(b.confidence) - parseFloat(a.confidence))
    
    // Always include at least analytics
    if (!suggestions.find(s => s.id === 'analytics')) {
      suggestions.push({ id: 'analytics', confidence: '0.50', matchedKeywords: ['default'] })
    }
    
    return {
      suggestions: suggestions.slice(0, 4),
      reasoning: `Analyzed content for product-related keywords.`,
    }
  },

  /**
   * Find relevant templates based on context
   */
  findRelevantTemplates: async (context, type, existingItems = []) => {
    await delay(randomInt(800, 1500))
    
    // Simulate finding relevant items from existing data
    const relevantIds = existingItems
      .filter(item => item.type === type && item.usageCount > 50)
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 5)
      .map(item => ({
        ...item,
        matchScore: (0.75 + Math.random() * 0.2).toFixed(2),
        reasoning: `High usage (${item.usageCount} accounts) and similar scope`,
      }))
    
    return {
      recommendations: relevantIds,
      reasoning: `Found ${relevantIds.length} relevant templates based on usage and similarity.`,
    }
  },

  /**
   * AI Quality check for content before publishing
   */
  qualityCheck: async (items) => {
    await delay(randomInt(1000, 1800))
    
    const checks = []
    const warnings = []
    const suggestions = []
    
    for (const item of items) {
      // Check name length
      if (item.name && item.name.length < 10) {
        warnings.push({ item: item.name, issue: 'Name is too short', severity: 'medium' })
      }
      if (item.name && item.name.length > 100) {
        warnings.push({ item: item.name, issue: 'Name is too long', severity: 'low' })
      }
      
      // Check description
      if (!item.description || item.description.length < 20) {
        warnings.push({ item: item.name, issue: 'Description is missing or too short', severity: 'high' })
      }
      
      // Check metrics for objectives
      if (item.type === 'objective' && !item.metric) {
        suggestions.push({ item: item.name, suggestion: 'Add measurable metrics' })
      }
      
      // Check products
      if ((item.type === 'objective' || item.type === 'tactic') && (!item.requiredProducts || item.requiredProducts.length === 0)) {
        suggestions.push({ item: item.name, suggestion: 'Specify required products' })
      }
      
      checks.push({ item: item.name, passed: warnings.filter(w => w.item === item.name).length === 0 })
    }
    
    const passedCount = checks.filter(c => c.passed).length
    
    return {
      overallScore: Math.round((passedCount / items.length) * 100),
      checks,
      warnings,
      suggestions,
      summary: passedCount === items.length 
        ? 'All items passed quality checks!'
        : `${warnings.length} issues found, ${suggestions.length} suggestions available.`,
    }
  },

  /**
   * Suggest scope based on content
   */
  suggestScope: async (content) => {
    await delay(randomInt(600, 1200))
    
    const contentLower = (content.name + ' ' + (content.description || '')).toLowerCase()
    
    // Detect industry keywords
    const industryKeywords = {
      'Banking & Financial Services': ['financial', 'banking', 'investment', 'loan', 'credit', 'finance'],
      Healthcare: ['health', 'medical', 'patient', 'clinical', 'hospital', 'care'],
      Retail: ['retail', 'store', 'shopping', 'ecommerce', 'product', 'sale'],
      'Software & Technology': ['software', 'tech', 'digital', 'app', 'platform', 'saas'],
    }
    
    const detectedIndustries = []
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(kw => contentLower.includes(kw))) {
        detectedIndustries.push(industry)
      }
    }
    
    // Determine scope type
    let scopeType = 'universal'
    if (detectedIndustries.length > 0) {
      scopeType = 'industry'
    }
    
    return {
      suggestedScope: {
        type: scopeType,
        industries: detectedIndustries,
        regions: [],
        jobRoles: ['Social Media Manager'],
      },
      confidence: detectedIndustries.length > 0 ? '0.85' : '0.60',
      reasoning: detectedIndustries.length > 0 
        ? `Detected industry-specific content: ${detectedIndustries.join(', ')}`
        : 'No specific industry detected, suggesting universal scope.',
    }
  },
}

export default aiService
