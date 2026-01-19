import { Layers, Building2, Users2 } from 'lucide-react'
import { useFuel } from '../../context/FuelContext'

const perspectives = [
  { id: 'hierarchy', label: 'By Hierarchy', icon: Layers },
  { id: 'industry', label: 'By Industry', icon: Building2 },
  { id: 'account', label: 'By Account', icon: Users2 },
]

export default function PerspectiveSwitcher() {
  const { perspective, setPerspective } = useFuel()
  
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
      {perspectives.map((p) => {
        const Icon = p.icon
        const isActive = perspective === p.id
        
        return (
          <button
            key={p.id}
            onClick={() => setPerspective(p.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Icon className="w-4 h-4" />
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
