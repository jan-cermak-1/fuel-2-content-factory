import { useState } from 'react'
import { 
  X, 
  Search, 
  Bookmark, 
  Plus,
  Trash2,
  Check
} from 'lucide-react'
import { useFuel } from '../../context/FuelContext'

const typeOptions = [
  { id: 'objective', label: 'Objectives' },
  { id: 'tactic', label: 'Tactics' },
  { id: 'bestPractice', label: 'Best Practices' },
  { id: 'step', label: 'Steps' },
]

const statusOptions = [
  { id: 'draft', label: 'Draft' },
  { id: 'in-review', label: 'In Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'released', label: 'Released' },
]

const industryOptions = ['Finance', 'Retail', 'Healthcare', 'Tech']
const regionOptions = ['EMEA', 'NA', 'APAC']
const jobRoleOptions = ['CMO', 'Social Media Manager', 'Content Creator', 'Analyst', 'PR Manager']

export default function FilterPanel() {
  const { 
    filters, 
    setFilters, 
    setFilterPanelOpen,
    savedViews,
    setSavedViews
  } = useFuel()
  
  const [newViewName, setNewViewName] = useState('')
  const [showSaveView, setShowSaveView] = useState(false)
  
  const toggleFilter = (field, value) => {
    const current = filters[field] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setFilters(prev => ({ ...prev, [field]: updated }))
  }
  
  const resetFilters = () => {
    setFilters({
      search: '',
      types: ['objective', 'tactic', 'bestPractice', 'step'],
      statuses: ['draft', 'in-review', 'approved', 'released'],
      industries: [],
      regions: [],
      jobRoles: [],
      minQuality: 0,
      minUsage: 0,
    })
  }
  
  const saveCurrentView = () => {
    if (!newViewName.trim()) return
    
    const newView = {
      id: `sv-${Date.now()}`,
      name: newViewName.trim(),
      filters: { ...filters },
    }
    
    setSavedViews(prev => [...prev, newView])
    setNewViewName('')
    setShowSaveView(false)
  }
  
  const applyView = (view) => {
    setFilters(prev => ({ ...prev, ...view.filters }))
  }
  
  const deleteView = (viewId) => {
    setSavedViews(prev => prev.filter(v => v.id !== viewId))
  }
  
  // Count active filters
  const activeFilterCount = [
    filters.types.length < 4 ? 1 : 0,
    filters.statuses.length < 4 ? 1 : 0,
    filters.industries.length > 0 ? 1 : 0,
    filters.regions.length > 0 ? 1 : 0,
    filters.jobRoles.length > 0 ? 1 : 0,
    filters.minQuality > 0 ? 1 : 0,
    filters.minUsage > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0)
  
  return (
    <div className="h-full flex flex-col bg-white w-80">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <button
          onClick={() => setFilterPanelOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search content..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Try: "show me Draft tactics for Nike"
          </p>
        </div>
        
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
          <div className="space-y-2">
            {typeOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(option.id)}
                  onChange={() => toggleFilter('types', option.id)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(option.id)}
                  onChange={() => toggleFilter('statuses', option.id)}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map((industry) => (
              <button
                key={industry}
                onClick={() => toggleFilter('industries', industry)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                  ${filters.industries.includes(industry)
                    ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
        
        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
          <div className="flex flex-wrap gap-2">
            {regionOptions.map((region) => (
              <button
                key={region}
                onClick={() => toggleFilter('regions', region)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                  ${filters.regions.includes(region)
                    ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
        
        {/* Job Role */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Job Role</label>
          <div className="flex flex-wrap gap-2">
            {jobRoleOptions.map((role) => (
              <button
                key={role}
                onClick={() => toggleFilter('jobRoles', role)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors
                  ${filters.jobRoles.includes(role)
                    ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
        
        {/* Quality Score */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Quality Score: {filters.minQuality}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minQuality}
            onChange={(e) => setFilters(prev => ({ ...prev, minQuality: Number(e.target.value) }))}
            className="w-full accent-teal-500"
          />
        </div>
        
        {/* Usage */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Usage: {filters.minUsage} accounts
          </label>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={filters.minUsage}
            onChange={(e) => setFilters(prev => ({ ...prev, minUsage: Number(e.target.value) }))}
            className="w-full accent-teal-500"
          />
        </div>
        
        {/* Saved Views */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Saved Views</label>
            <button
              onClick={() => setShowSaveView(!showSaveView)}
              className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700"
            >
              <Plus className="w-3 h-3" />
              Save current
            </button>
          </div>
          
          {showSaveView && (
            <div className="mb-3 p-3 bg-slate-50 rounded-lg">
              <input
                type="text"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View name..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveCurrentView}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveView(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {savedViews.map((view) => (
              <div 
                key={view.id}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <button
                  onClick={() => applyView(view)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  <Bookmark className="w-4 h-4" />
                  {view.name}
                </button>
                <button
                  onClick={() => deleteView(view.id)}
                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center gap-2 p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={resetFilters}
          className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => setFilterPanelOpen(false)}
          className="flex-1 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
