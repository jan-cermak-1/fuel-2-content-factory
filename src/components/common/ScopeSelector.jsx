import React, { useState } from 'react'
import { Building2, Briefcase, Lock, Globe, Plus, X, ChevronDown, Sparkles } from 'lucide-react'
import { scopeTypes, industries, regions, jobRoles } from '../../data/products'

const scopeIcons = {
  industry: Building2,
  account: Briefcase,
  internal: Lock,
  universal: Globe,
}

const scopeColors = {
  industry: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    activeBg: 'bg-blue-100',
    activeBorder: 'border-blue-500',
  },
  account: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    activeBg: 'bg-amber-100',
    activeBorder: 'border-amber-500',
  },
  internal: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    activeBg: 'bg-slate-100',
    activeBorder: 'border-slate-500',
  },
  universal: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    activeBg: 'bg-emerald-100',
    activeBorder: 'border-emerald-500',
  },
}

// Pill component for selected items
function SelectionPill({ label, onRemove, color = 'blue' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:bg-white/50 rounded-full p-0.5">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

// Dropdown for selecting multiple items
function MultiSelectDropdown({ label, options, selected, onChange, placeholder, color = 'blue' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase()) &&
    !selected.includes(opt)
  )

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:border-slate-300 transition-colors"
        >
          <span className="text-slate-500">{placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleToggle(option)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-400">No options available</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map(item => (
            <SelectionPill
              key={item}
              label={item}
              color={color}
              onRemove={() => handleToggle(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Account input with autocomplete
function AccountInput({ selected, onChange }) {
  const [inputValue, setInputValue] = useState('')
  
  // Mock accounts for demo
  const suggestedAccounts = ['Nike', 'Ford', 'Apple', 'Coca-Cola', 'Netflix', 'Spotify', 'Adobe', 'Salesforce']
  
  const handleAdd = () => {
    if (inputValue.trim() && !selected.includes(inputValue.trim())) {
      onChange([...selected, inputValue.trim()])
      setInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (account) => {
    onChange(selected.filter(a => a !== account))
  }

  const suggestions = suggestedAccounts.filter(a => 
    a.toLowerCase().includes(inputValue.toLowerCase()) && 
    !selected.includes(a)
  )

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">Accounts</label>
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type account name..."
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Suggestions dropdown */}
        {inputValue && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(account => (
              <button
                key={account}
                type="button"
                onClick={() => {
                  onChange([...selected, account])
                  setInputValue('')
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
              >
                {account}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected accounts */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map(account => (
            <SelectionPill
              key={account}
              label={account}
              color="amber"
              onRemove={() => handleRemove(account)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ScopeSelector({ 
  scope = { type: 'universal', industries: [], accounts: [], regions: [], jobRoles: [] }, 
  onChange,
  showAISuggestion = false,
  onAISuggest,
  compact = false,
  readOnly = false
}) {
  const handleTypeChange = (type) => {
    if (readOnly) return
    onChange({
      ...scope,
      type,
      // Reset specific fields when switching types
      industries: type === 'industry' ? scope.industries : [],
      accounts: type === 'account' ? scope.accounts : [],
    })
  }

  const handleIndustriesChange = (newIndustries) => {
    onChange({ ...scope, industries: newIndustries })
  }

  const handleAccountsChange = (newAccounts) => {
    onChange({ ...scope, accounts: newAccounts })
  }

  const handleRegionsChange = (newRegions) => {
    onChange({ ...scope, regions: newRegions })
  }

  const handleJobRolesChange = (newJobRoles) => {
    onChange({ ...scope, jobRoles: newJobRoles })
  }

  // Compact read-only view
  if (compact && readOnly) {
    const Icon = scopeIcons[scope.type] || Globe
    const colors = scopeColors[scope.type] || scopeColors.universal
    const scopeLabel = scopeTypes.find(s => s.id === scope.type)?.label || 'Universal'
    
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
          <Icon className="w-3.5 h-3.5" />
          {scopeLabel}
        </span>
        {scope.type === 'industry' && scope.industries.length > 0 && (
          <span className="text-slate-500">
            {scope.industries.slice(0, 2).join(', ')}
            {scope.industries.length > 2 && ` +${scope.industries.length - 2}`}
          </span>
        )}
        {scope.type === 'account' && scope.accounts.length > 0 && (
          <span className="text-slate-500">
            {scope.accounts.slice(0, 2).join(', ')}
            {scope.accounts.length > 2 && ` +${scope.accounts.length - 2}`}
          </span>
        )}
        {scope.regions?.length > 0 && (
          <span className="text-slate-400">
            • {scope.regions.slice(0, 2).join(', ')}
            {scope.regions.length > 2 && ` +${scope.regions.length - 2}`}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Who is this for?</h3>
        {showAISuggestion && onAISuggest && (
          <button
            type="button"
            onClick={onAISuggest}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Suggest
          </button>
        )}
      </div>

      {/* Scope Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {scopeTypes.map(({ id, label, description }) => {
          const Icon = scopeIcons[id]
          const colors = scopeColors[id]
          const isActive = scope.type === id
          
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTypeChange(id)}
              disabled={readOnly}
              className={`
                flex flex-col items-center p-3 rounded-lg border-2 transition-all
                ${isActive 
                  ? `${colors.activeBg} ${colors.activeBorder} ${colors.text}` 
                  : `${colors.bg} ${colors.border} ${colors.text} opacity-60 hover:opacity-100`
                }
                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium text-center">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Type-specific fields */}
      {scope.type === 'industry' && !readOnly && (
        <MultiSelectDropdown
          label="Industries"
          options={industries}
          selected={scope.industries || []}
          onChange={handleIndustriesChange}
          placeholder="Select industries..."
          color="blue"
        />
      )}

      {scope.type === 'account' && !readOnly && (
        <>
          <AccountInput 
            selected={scope.accounts || []} 
            onChange={handleAccountsChange}
          />
          <MultiSelectDropdown
            label="Related Industries (optional)"
            options={industries}
            selected={scope.industries || []}
            onChange={handleIndustriesChange}
            placeholder="Select industries..."
            color="blue"
          />
        </>
      )}

      {/* Regions - shown for all except universal */}
      {scope.type !== 'universal' && !readOnly && (
        <MultiSelectDropdown
          label="Regions"
          options={regions}
          selected={scope.regions || []}
          onChange={handleRegionsChange}
          placeholder="Select regions..."
          color="emerald"
        />
      )}

      {/* Job Roles - always shown */}
      {!readOnly && (
        <MultiSelectDropdown
          label="Job Roles"
          options={jobRoles}
          selected={scope.jobRoles || []}
          onChange={handleJobRolesChange}
          placeholder="Select job roles..."
          color="violet"
        />
      )}
    </div>
  )
}
