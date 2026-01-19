import { Trophy, ArrowRight, Quote } from 'lucide-react'

export default function SuccessStoriesWidget({ stories }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Success Stories</h3>
        </div>
        <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
          View all
        </button>
      </div>
      
      <div className="divide-y divide-slate-100">
        {stories.map((story) => (
          <div key={story.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-xs font-medium text-slate-500">{story.accountName}</span>
                <p className="text-sm font-medium text-slate-900 mt-0.5">
                  {story.tacticName}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                {story.headline}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {story.summary}
            </p>
            
            {/* Metrics */}
            <div className="flex items-center gap-4 mb-3">
              {story.metrics.engagementIncrease && (
                <div className="text-xs">
                  <span className="text-slate-500">Engagement:</span>
                  <span className="ml-1 font-medium text-emerald-600">+{story.metrics.engagementIncrease}%</span>
                </div>
              )}
              {story.metrics.roi && (
                <div className="text-xs">
                  <span className="text-slate-500">ROI:</span>
                  <span className="ml-1 font-medium text-emerald-600">{story.metrics.roi}%</span>
                </div>
              )}
              <div className="text-xs">
                <span className="text-slate-500">Used by:</span>
                <span className="ml-1 font-medium">{story.usedBy} accounts</span>
              </div>
            </div>
            
            {/* Testimonial */}
            {story.testimonial && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <Quote className="w-4 h-4 text-slate-300 mb-1" />
                <p className="text-xs text-slate-600 italic line-clamp-2">
                  "{story.testimonial.quote}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  — {story.testimonial.author}, {story.testimonial.role}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
