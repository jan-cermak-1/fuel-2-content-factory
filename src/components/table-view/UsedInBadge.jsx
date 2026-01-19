import { Link2 } from 'lucide-react'

export default function UsedInBadge({ count, type }) {
  if (count <= 1) return null
  
  const getParentType = () => {
    switch (type) {
      case 'tactic': return 'objectives'
      case 'bestPractice': return 'tactics'
      case 'step': return 'best practices'
      default: return 'items'
    }
  }
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-purple-600 bg-purple-50 rounded-full"
      title={`Used in ${count} ${getParentType()}`}
    >
      <Link2 className="w-3 h-3" />
      Used in {count}
    </span>
  )
}
