import { DollarSign, Users, RefreshCcw, ArrowUpRight, Flame } from 'lucide-react'

export default function ROITable({ data }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-900">ROI Indicators</h3>
        </div>
        <span className="text-xs text-slate-500">Linked to business outcomes</span>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_100px_120px_120px_100px] gap-4 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider">
        <div>Tactic</div>
        <div>Adoption</div>
        <div>Impact</div>
        <div>Renewals</div>
        <div>Upsells</div>
        <div>Revenue</div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div 
            key={item.tacticId}
            className="grid grid-cols-[1fr_100px_100px_120px_120px_100px] gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors"
          >
            {/* Tactic Name */}
            <div className="text-sm font-medium text-slate-900 truncate">
              {item.tacticName}
            </div>
            
            {/* Adoption */}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">{item.adoption}</span>
            </div>
            
            {/* Impact */}
            <div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                ${item.impact === 'high' 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.impact === 'high' && <Flame className="w-3 h-3" />}
                {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
              </span>
            </div>
            
            {/* Linked Renewals */}
            <div className="flex items-center gap-1.5">
              <RefreshCcw className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-600">{item.linkedRenewals} accounts</span>
            </div>
            
            {/* Linked Upsells */}
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-600">{item.linkedUpsells} accounts</span>
            </div>
            
            {/* Revenue */}
            <div className="text-sm font-medium text-emerald-600">
              ${(item.revenue / 1000).toFixed(0)}k
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="grid grid-cols-[1fr_100px_100px_120px_120px_100px] gap-4 px-4 py-3 bg-slate-50 border-t border-slate-200">
        <div className="text-sm font-semibold text-slate-900">Total</div>
        <div className="text-sm font-semibold text-slate-900">
          {data.reduce((sum, item) => sum + item.adoption, 0)}
        </div>
        <div></div>
        <div className="text-sm font-semibold text-slate-900">
          {data.reduce((sum, item) => sum + item.linkedRenewals, 0)} accounts
        </div>
        <div className="text-sm font-semibold text-slate-900">
          {data.reduce((sum, item) => sum + item.linkedUpsells, 0)} accounts
        </div>
        <div className="text-sm font-semibold text-emerald-600">
          ${(data.reduce((sum, item) => sum + item.revenue, 0) / 1000).toFixed(0)}k
        </div>
      </div>
    </div>
  )
}
