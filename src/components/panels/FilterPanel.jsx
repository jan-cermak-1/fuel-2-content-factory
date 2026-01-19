import { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Search, 
  Bookmark, 
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Building2,
  Globe2,
  Briefcase
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

const industryOptions = [
  'Advertising & Marketing',
  'Agriculture',
  'Automotive',
  'Banking & Financial Services',
  'Biotechnology',
  'Chemicals',
  'Construction',
  'Consumer Goods',
  'Defense & Aerospace',
  'E-commerce',
  'Education',
  'Energy & Utilities',
  'Entertainment & Media',
  'Fashion & Apparel',
  'Food & Beverage',
  'Gaming',
  'Government & Public Sector',
  'Healthcare & Pharmaceuticals',
  'Hospitality & Tourism',
  'Insurance',
  'Legal Services',
  'Logistics & Transportation',
  'Manufacturing',
  'Mining & Metals',
  'Non-profit & NGO',
  'Real Estate',
  'Retail',
  'Software & Technology',
  'Sports & Fitness',
  'Telecommunications',
]

const regionOptions = [
  // North America
  'United States',
  'Canada',
  'Mexico',
  // South America
  'Brazil',
  'Argentina',
  'Colombia',
  'Chile',
  'Peru',
  // Europe
  'United Kingdom',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Poland',
  'Belgium',
  'Austria',
  'Norway',
  'Denmark',
  'Finland',
  'Ireland',
  'Portugal',
  'Czech Republic',
  'Romania',
  'Greece',
  // Middle East
  'United Arab Emirates',
  'Saudi Arabia',
  'Israel',
  'Turkey',
  'Qatar',
  'Kuwait',
  // Africa
  'South Africa',
  'Nigeria',
  'Egypt',
  'Kenya',
  'Morocco',
  // Asia Pacific
  'China',
  'Japan',
  'India',
  'South Korea',
  'Australia',
  'Singapore',
  'Indonesia',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'New Zealand',
  'Hong Kong',
  'Taiwan',
]

const jobRoleOptions = [
  'CMO (Chief Marketing Officer)',
  'VP of Marketing',
  'Marketing Director',
  'Brand Manager',
  'Social Media Manager',
  'Content Marketing Manager',
  'Digital Marketing Manager',
  'Community Manager',
  'PR Manager',
  'Creative Director',
  'Content Creator',
  'Marketing Analyst',
  'Growth Marketing Manager',
  'Product Marketing Manager',
  'Influencer Marketing Manager',
  'Performance Marketing Manager',
]

// Multi-select dropdown component
function MultiSelectDropdown({ 
  label, 
  icon: Icon, 
  options, 
  selected, 
  onChange, 
  placeholder,
  colorClass = 'teal'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  )
  
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option))
    } else {
      onChange([...selected, option])
    }
  }
  
  const selectAll = () => {
    onChange([...options])
  }
  
  const clearAll = () => {
    onChange([])
  }
  
  const colorClasses = {
    teal: {
      badge: 'bg-teal-100 text-teal-700',
      ring: 'ring-teal-500',
      check: 'text-teal-600',
      hover: 'hover:bg-teal-50',
    },
    violet: {
      badge: 'bg-violet-100 text-violet-700',
      ring: 'ring-violet-500',
      check: 'text-violet-600',
      hover: 'hover:bg-violet-50',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-700',
      ring: 'ring-blue-500',
      check: 'text-blue-600',
      hover: 'hover:bg-blue-50',
    },
    amber: {
      badge: 'bg-amber-100 text-amber-700',
      ring: 'ring-amber-500',
      check: 'text-amber-600',
      hover: 'hover:bg-amber-50',
    },
  }
  
  const colors = colorClasses[colorClass]
  
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <span className="flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          {label}
        </span>
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white transition-all
          ${isOpen ? `border-${colorClass}-500 ring-2 ${colors.ring}` : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <span className={selected.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
          {selected.length === 0 
            ? placeholder 
            : `${selected.length} selected`
          }
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.slice(0, 3).map(item => (
            <span 
              key={item}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${colors.badge}`}
            >
              {item.length > 20 ? item.substring(0, 20) + '...' : item}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleOption(item)
                }}
                className="hover:bg-white/50 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selected.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-slate-500">
              +{selected.length - 3} more
            </span>
          )}
        </div>
      )}
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex items-center gap-2 px-2 py-1.5 border-b border-slate-100 bg-slate-50">
            <button
              onClick={selectAll}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              Select all
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear all
            </button>
          </div>
          
          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = selected.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                      ${isSelected ? `${colors.badge} ${colors.hover}` : 'hover:bg-slate-50'}
                    `}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center
                      ${isSelected ? `${colors.check} border-current bg-current/10` : 'border-slate-300'}
                    `}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={isSelected ? 'font-medium' : ''}>{option}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
        
        {/* Industry - Multi-select */}
        <MultiSelectDropdown
          label="Industry"
          icon={Building2}
          options={industryOptions}
          selected={filters.industries}
          onChange={(val) => setFilters(prev => ({ ...prev, industries: val }))}
          placeholder="Select industries..."
          colorClass="violet"
        />
        
        {/* Region - Multi-select */}
        <MultiSelectDropdown
          label="Region"
          icon={Globe2}
          options={regionOptions}
          selected={filters.regions}
          onChange={(val) => setFilters(prev => ({ ...prev, regions: val }))}
          placeholder="Select regions..."
          colorClass="blue"
        />
        
        {/* Job Role - Multi-select */}
        <MultiSelectDropdown
          label="Job Role"
          icon={Briefcase}
          options={jobRoleOptions}
          selected={filters.jobRoles}
          onChange={(val) => setFilters(prev => ({ ...prev, jobRoles: val }))}
          placeholder="Select job roles..."
          colorClass="amber"
        />
        
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
