import { Flame, TrendingUp, AlertTriangle } from 'lucide-react'

export default function ImpactBadge({ usageCount, qualityScore }) {
  // Determine impact level
  const getImpact = () => {
    if (!usageCount) return null
    if (usageCount >= 150 && qualityScore >= 80) {
      return { level: 'high', label: 'High', icon: Flame, color: 'text-orange-500 bg-orange-50' }
    }
    if (usageCount >= 50 || qualityScore >= 70) {
      return { level: 'growing', label: 'Growing', icon: TrendingUp, color: 'text-green-500 bg-green-50' }
    }
    return { level: 'low', label: 'Low', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' }
  }
  
  const impact = getImpact()
  
  if (!impact) return <span className="text-slate-400 text-xs">-</span>
  
  const Icon = impact.icon
  
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${impact.color}`}
      title={`Impact: ${impact.label}`}
    >
      <Icon className="w-3 h-3" />
      {impact.label}
    </span>
  )
}
