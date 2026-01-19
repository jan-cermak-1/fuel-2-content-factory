import { Search, Command } from 'lucide-react'

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  showShortcut = false,
  className = '' 
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-16 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
          placeholder:text-slate-400"
      />
      {showShortcut && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          <Command className="w-3 h-3" />
          <span className="text-xs">K</span>
        </div>
      )}
    </div>
  )
}
