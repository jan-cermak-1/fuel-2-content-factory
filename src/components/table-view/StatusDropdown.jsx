import { ChevronDown } from 'lucide-react'

const statusConfig = {
  'draft': { label: 'Draft', color: 'bg-sky-100 text-sky-700 border-sky-200' },
  'in-review': { label: 'In Review', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'approved': { label: 'Approved', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  'released': { label: 'Released', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

export default function StatusDropdown({ status, onChange }) {
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none text-xs font-medium px-2 py-1 pr-6 rounded-full border cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500
          ${config.color}`}
      >
        {Object.entries(statusConfig).map(([value, cfg]) => (
          <option key={value} value={value}>
            {cfg.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
    </div>
  )
}
