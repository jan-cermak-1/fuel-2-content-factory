import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Sparkles,
  Trophy,
  Target,
  Layers,
  BarChart3,
  ArrowRight
} from 'lucide-react'
import { mockUsageData, getGapAnalysis, getRiskAlerts, getROIIndicators } from '../../data/mockUsageData'
import { successStories, getFeaturedStories } from '../../data/successStories'
import RiskAlertBanner from './RiskAlertBanner'
import SuccessStoriesWidget from './SuccessStoriesWidget'
import MetricsGrid from './MetricsGrid'
import Sparkline from './Sparkline'
import ROITable from './ROITable'
import GapAnalysis from './GapAnalysis'

export default function AnalyticsView() {
  const riskAlerts = getRiskAlerts('high')
  const featuredStories = getFeaturedStories()
  const gapAnalysis = getGapAnalysis()
  const roiIndicators = getROIIndicators()
  
  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <RiskAlertBanner alerts={riskAlerts} />
      )}
      
      {/* Metrics Grid */}
      <MetricsGrid />
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Success Stories */}
        <SuccessStoriesWidget stories={featuredStories} />
        
        {/* Gap Analysis */}
        <GapAnalysis gaps={gapAnalysis} />
      </div>
      
      {/* ROI Table */}
      <ROITable data={roiIndicators} />
      
      {/* Top/Bottom Performers */}
      <div className="grid grid-cols-2 gap-6">
        <PerformanceCard 
          title="Top Performing" 
          items={mockUsageData.topPerformers} 
          type="top"
        />
        <PerformanceCard 
          title="Needs Attention" 
          items={mockUsageData.lowestCompletion} 
          type="low"
        />
      </div>
    </div>
  )
}

function PerformanceCard({ title, items, type }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500">{items.length} items</span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">{item.usageCount} accounts</span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{item.completionRate}% completion</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium text-sm
                ${item.qualityScore >= 80 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : item.qualityScore >= 60 
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {item.qualityScore}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {item.trend === 'up' ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600">+{item.trendValue}%</span>
                  </>
                ) : item.trend === 'down' ? (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">{item.trendValue}%</span>
                  </>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
