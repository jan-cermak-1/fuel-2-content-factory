import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'

export default function RiskAlertBanner({ alerts }) {
  const [dismissed, setDismissed] = useState([])
  
  const visibleAlerts = alerts.filter(alert => !dismissed.includes(alert.id))
  
  if (visibleAlerts.length === 0) return null
  
  const alert = visibleAlerts[0] // Show first alert
  
  const severityColors = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800',
  }
  
  const iconColors = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
  }
  
  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${severityColors[alert.severity]}`}>
      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[alert.severity]}`} />
      <div className="flex-1">
        <p className="font-medium">{alert.title}</p>
        <p className="text-sm opacity-80 mt-1">{alert.description}</p>
        {alert.affectedAccounts && (
          <p className="text-xs opacity-60 mt-2">
            Affected: {alert.affectedAccounts.slice(0, 3).join(', ')}
            {alert.affectedAccounts.length > 3 && ` +${alert.affectedAccounts.length - 3} more`}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-white/50 rounded-lg hover:bg-white transition-colors">
          {alert.suggestedAction || 'View Details'}
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDismissed([...dismissed, alert.id])}
          className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
