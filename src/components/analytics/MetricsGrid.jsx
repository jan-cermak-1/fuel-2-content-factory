import { Target, Layers, BarChart3, Heart, TrendingUp, TrendingDown } from 'lucide-react'
import { mockUsageData } from '../../data/mockUsageData'
import Sparkline from './Sparkline'

const metrics = [
  {
    id: 'objectives',
    label: 'Total Objectives',
    value: mockUsageData.summary.totalObjectives,
    trend: mockUsageData.trends.objectives,
    change: '+3',
    changeType: 'positive',
    icon: Target,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'tactics',
    label: 'Total Tactics',
    value: mockUsageData.summary.totalTactics,
    trend: mockUsageData.trends.tactics,
    change: '+12',
    changeType: 'positive',
    icon: Layers,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'quality',
    label: 'Avg Quality Score',
    value: mockUsageData.summary.avgQualityScore,
    trend: mockUsageData.trends.qualityScore,
    change: '+5',
    changeType: 'positive',
    icon: BarChart3,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    suffix: '/100',
  },
  {
    id: 'health',
    label: 'Content Health',
    value: mockUsageData.summary.contentHealthScore,
    trend: mockUsageData.trends.completionRate,
    change: '+8%',
    changeType: 'positive',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    suffix: '%',
  },
]

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        
        return (
          <div 
            key={metric.id}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  metric.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <p className="text-2xl font-bold text-slate-900">
              {metric.value}
              {metric.suffix && (
                <span className="text-sm font-normal text-slate-500">{metric.suffix}</span>
              )}
            </p>
            <p className="text-sm text-slate-500 mt-1">{metric.label}</p>
            
            {/* Sparkline */}
            <div className="mt-3 h-8">
              <Sparkline data={metric.trend} color={metric.color} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
