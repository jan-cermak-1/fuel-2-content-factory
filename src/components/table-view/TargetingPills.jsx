import { Building2, Globe2, User } from 'lucide-react'

const iconMap = {
  industries: Building2,
  regions: Globe2,
  jobRoles: User,
}

const colorMap = {
  industries: 'bg-violet-50 text-violet-700',
  regions: 'bg-blue-50 text-blue-700',
  jobRoles: 'bg-amber-50 text-amber-700',
}

export default function TargetingPills({ targeting, maxPills = 3 }) {
  if (!targeting) return null
  
  const pills = []
  
  // Collect all targeting values
  Object.entries(targeting).forEach(([key, values]) => {
    if (key === 'accounts') return // Skip accounts
    if (!values || values.length === 0) return
    
    values.forEach(value => {
      pills.push({ key, value })
    })
  })
  
  if (pills.length === 0) return <span className="text-slate-400 text-xs">-</span>
  
  const visiblePills = pills.slice(0, maxPills)
  const hiddenCount = pills.length - maxPills
  
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visiblePills.map((pill, index) => {
        const Icon = iconMap[pill.key]
        return (
          <span
            key={`${pill.key}-${pill.value}-${index}`}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full ${colorMap[pill.key]}`}
            title={`${pill.key}: ${pill.value}`}
          >
            {Icon && <Icon className="w-3 h-3" />}
            <span className="truncate max-w-[60px]">{pill.value}</span>
          </span>
        )
      })}
      {hiddenCount > 0 && (
        <span className="text-xs text-slate-500">+{hiddenCount}</span>
      )}
    </div>
  )
}
