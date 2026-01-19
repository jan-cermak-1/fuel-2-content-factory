import { 
  ChevronRight, 
  Search, 
  Command,
  Bell,
  ChevronDown
} from 'lucide-react'
import { useFuel } from '../../context/FuelContext'
import { accountProfiles } from '../../data/accountProfiles'

export default function Header() {
  const { 
    viewAsAccount, 
    setViewAsAccount, 
    filters, 
    setFilters 
  } = useFuel()
  
  const currentAccount = viewAsAccount === 'all' 
    ? null 
    : accountProfiles.find(a => a.id === viewAsAccount)
  
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        <span className="text-slate-500">Fuel 2.0</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-900">Objectives & Tactics</span>
      </nav>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-16 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
              placeholder:text-slate-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
            <Command className="w-3 h-3" />
            <span className="text-xs">K</span>
          </div>
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* View as Account */}
        <div className="relative">
          <select
            value={viewAsAccount}
            onChange={(e) => setViewAsAccount(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            <option value="all">View as: All Accounts</option>
            {accountProfiles.map(account => (
              <option key={account.id} value={account.id}>
                View as: {account.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        
        {/* User avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            EC
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  )
}
