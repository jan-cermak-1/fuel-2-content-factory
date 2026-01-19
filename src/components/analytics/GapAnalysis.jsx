import { Lightbulb, Sparkles, Building2, Globe2, Calendar, Target, ArrowRight } from 'lucide-react'
import { useFuel } from '../../context/FuelContext'

const categoryIcons = {
  industry: Building2,
  region: Globe2,
  seasonal: Calendar,
  conversion: Target,
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50/50',
  medium: 'border-l-amber-500 bg-amber-50/50',
  low: 'border-l-blue-500 bg-blue-50/50',
}

export default function GapAnalysis({ gaps }) {
  const { setAiPanelOpen } = useFuel()
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Gap Analysis</h3>
        </div>
        <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
          AI-Powered
        </span>
      </div>
      
      <div className="p-4 space-y-3">
        {gaps.map((gap) => {
          const Icon = categoryIcons[gap.category] || Lightbulb
          
          return (
            <div 
              key={gap.id}
              className={`p-3 rounded-lg border-l-4 ${priorityColors[gap.priority]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{gap.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{gap.description}</p>
                    
                    {gap.predictedDemandIncrease && (
                      <p className="text-xs text-emerald-600 mt-1">
                        +{gap.predictedDemandIncrease}% predicted demand
                      </p>
                    )}
                    
                    {gap.currentCount !== undefined && (
                      <p className="text-xs text-slate-500 mt-1">
                        Current: {gap.currentCount} → Recommended: {gap.recommendedCount}
                      </p>
                    )}
                  </div>
                </div>
                
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0
                  ${gap.priority === 'high' 
                    ? 'bg-red-100 text-red-700' 
                    : gap.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {gap.priority}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
                <span className="text-xs text-slate-500">
                  Suggested: {gap.suggestedItems} items
                </span>
                <button
                  onClick={() => setAiPanelOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Generate with AI
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
