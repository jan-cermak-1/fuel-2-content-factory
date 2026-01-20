// Emplifi Product definitions
// These represent the different modules/products a user needs to have
// to be able to achieve certain objectives or tactics

export const emplifiProducts = [
  {
    id: 'social-marketing',
    name: 'Social Marketing Cloud',
    shortName: 'Social',
    description: 'Publishing, scheduling, content calendar',
    icon: 'Calendar',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    shortName: 'Analytics',
    description: 'Performance metrics, dashboards, reports',
    icon: 'BarChart3',
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-300',
  },
  {
    id: 'care',
    name: 'Care',
    shortName: 'Care',
    description: 'Customer service, unified inbox, response management',
    icon: 'MessageCircle',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'ugc',
    name: 'UGC',
    shortName: 'UGC',
    description: 'User-generated content collection and rights management',
    icon: 'Users',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  {
    id: 'influencer',
    name: 'Influencer Marketing',
    shortName: 'Influencer',
    description: 'Influencer discovery, campaigns, tracking',
    icon: 'Star',
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-300',
  },
  {
    id: 'listening',
    name: 'Social Listening',
    shortName: 'Listening',
    description: 'Brand monitoring, sentiment analysis, trends',
    icon: 'Headphones',
    color: 'cyan',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-300',
  },
]

// Helper to get product by ID
export function getProductById(productId) {
  return emplifiProducts.find(p => p.id === productId)
}

// Helper to get multiple products by IDs
export function getProductsByIds(productIds = []) {
  return productIds.map(id => getProductById(id)).filter(Boolean)
}

// Scope types for content targeting
export const scopeTypes = [
  {
    id: 'industry',
    label: 'Industry-specific',
    description: 'Content for specific industries',
    icon: 'Building2',
  },
  {
    id: 'account',
    label: 'Account-specific',
    description: 'Content for specific customer accounts',
    icon: 'Briefcase',
  },
  {
    id: 'internal',
    label: 'Internal',
    description: 'For Emplifi employees only',
    icon: 'Lock',
  },
  {
    id: 'universal',
    label: 'Universal',
    description: 'Applicable to all users',
    icon: 'Globe',
  },
]

// Available industries
export const industries = [
  'Advertising & Marketing',
  'Automotive',
  'Banking & Financial Services',
  'Consumer Goods',
  'E-commerce',
  'Education',
  'Entertainment & Media',
  'Fashion & Apparel',
  'Food & Beverage',
  'Healthcare',
  'Hospitality & Tourism',
  'Insurance',
  'Real Estate',
  'Retail',
  'Software & Technology',
  'Telecommunications',
]

// Available regions
export const regions = [
  'North America',
  'South America',
  'Western Europe',
  'Eastern Europe',
  'Middle East',
  'North Africa',
  'Sub-Saharan Africa',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Australia & New Zealand',
]

// Available job roles
export const jobRoles = [
  'CMO (Chief Marketing Officer)',
  'VP of Marketing',
  'Marketing Director',
  'Brand Manager',
  'Social Media Manager',
  'Content Marketing Manager',
  'Digital Marketing Manager',
  'Community Manager',
  'PR Manager',
  'Creative Director',
  'Content Creator',
  'Marketing Analyst',
]

export default emplifiProducts
