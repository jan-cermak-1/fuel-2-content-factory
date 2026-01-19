import { useState } from 'react'
import { 
  X, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  ChevronRight,
  Check,
  AlertCircle,
  Clock,
  User,
  Edit3,
  Link2,
  Target,
  Layers,
  BookOpen,
  ListChecks,
  Plus,
  Trash2,
  BarChart3
} from 'lucide-react'
import { useFuel } from '../../context/FuelContext'
import { accountProfiles } from '../../data/accountProfiles'
import { getBreadcrumbPath, getParentNames } from '../../data/relationships'
import { getChildrenOf, getParentsOf } from '../../data/seedData'
import StatusDropdown from '../table-view/StatusDropdown'
import QualityScore from '../table-view/QualityScore'
import { formatDistanceToNow } from 'date-fns'

const industries = ['Finance', 'Retail', 'Healthcare', 'Tech']
const regions = ['EMEA', 'NA', 'APAC']
const jobRoles = ['CMO', 'Social Media Manager', 'Content Creator', 'Analyst', 'PR Manager']

const typeConfig = {
  objective: { 
    label: 'Objective', 
    icon: Target, 
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    childType: 'tactics'
  },
  tactic: { 
    label: 'Tactic', 
    icon: Layers, 
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    childType: 'best practices'
  },
  bestPractice: { 
    label: 'Best Practice', 
    icon: BookOpen, 
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    childType: 'steps'
  },
  step: { 
    label: 'Step', 
    icon: ListChecks, 
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    childType: null
  },
}

export default function DetailPanel() {
  const { 
    selectedItem, 
    setDetailPanelOpen, 
    setAiPanelOpen,
    updateItem,
    items,
    viewAsAccount,
    setViewAsAccount
  } = useFuel()
  
  const [activeTab, setActiveTab] = useState('details')
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  
  if (!selectedItem) return null
  
  const config = typeConfig[selectedItem.type]
  const Icon = config.icon
  const breadcrumb = getBreadcrumbPath(selectedItem.id, items)
  const parentNames = getParentNames(selectedItem.id, items)
  const children = getChildrenOf(selectedItem.id, items)
  const parents = getParentsOf(selectedItem.id, items)
  const currentAccount = viewAsAccount !== 'all' 
    ? accountProfiles.find(a => a.id === viewAsAccount) 
    : null
  
  const handleSaveName = () => {
    if (editName.trim()) {
      updateItem(selectedItem.id, { name: editName.trim() })
    }
    setIsEditingName(false)
  }
  
  const handleSaveDescription = () => {
    updateItem(selectedItem.id, { description: editDescription })
    setIsEditingDescription(false)
  }
  
  const toggleTargeting = (field, value) => {
    const current = selectedItem.targeting?.[field] || []
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateItem(selectedItem.id, {
      targeting: { ...selectedItem.targeting, [field]: updated }
    })
  }
  
  // Quality audit items based on type
  const getAuditItems = () => {
    const baseItems = [
      { id: 1, check: selectedItem.qualityScore >= 70, text: 'Relevant to target audience' },
      { id: 2, check: selectedItem.description?.length > 50, text: 'Complete information' },
      { id: 3, check: true, text: 'Consistent with brand guidelines' },
    ]
    
    if (selectedItem.type === 'objective') {
      return [
        ...baseItems,
        { id: 4, check: !!selectedItem.metric, text: 'Success metric defined' },
        { id: 5, check: children.length > 0, text: 'Has associated tactics' },
      ]
    }
    if (selectedItem.type === 'tactic') {
      return [
        ...baseItems,
        { id: 4, check: children.length > 0, text: 'Has best practices' },
        { id: 5, check: parents.length > 0, text: 'Linked to objectives' },
      ]
    }
    if (selectedItem.type === 'bestPractice') {
      return [
        ...baseItems,
        { id: 4, check: children.length > 0, text: 'Has actionable steps' },
        { id: 5, check: selectedItem.qualityScore >= 80, text: 'High quality content' },
      ]
    }
    return [
      ...baseItems,
      { id: 4, check: selectedItem.description?.length > 30, text: 'Clear instructions' },
    ]
  }
  
  // Activity log
  const activityLog = [
    { user: selectedItem.lastEditedBy, action: 'edited', time: selectedItem.lastEditedAt },
    { user: 'AI Assistant', action: 'generated quality audit', time: new Date(Date.now() - 86400000 * 2).toISOString() },
    { user: selectedItem.owner, action: 'created', time: selectedItem.createdAt },
  ]
  
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'targeting', label: 'Targeting' },
    { id: 'children', label: config.childType ? `${config.childType.charAt(0).toUpperCase() + config.childType.slice(1)}` : 'Related' },
    { id: 'activity', label: 'Activity' },
  ]
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b border-slate-200 bg-gradient-to-r ${config.bgColor}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="flex-1 px-2 py-1 text-lg font-semibold border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button onClick={handleSaveName} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsEditingName(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <h2 
                  className="text-lg font-semibold text-slate-900 truncate cursor-pointer hover:text-teal-600"
                  onClick={() => {
                    setEditName(selectedItem.name)
                    setIsEditingName(true)
                  }}
                >
                  {selectedItem.name}
                </h2>
              )}
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <span className={`px-1.5 py-0.5 rounded ${config.bgColor} ${config.textColor} font-medium`}>
                  {config.label}
                </span>
                {breadcrumb.slice(0, -1).map((item, index) => (
                  <span key={item.id} className="flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">{item.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setDetailPanelOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Status and Score */}
        <div className="flex items-center gap-3 flex-wrap">
          <StatusDropdown 
            status={selectedItem.status}
            onChange={(status) => updateItem(selectedItem.id, { status })}
          />
          {selectedItem.qualityScore !== undefined && (
            <QualityScore score={selectedItem.qualityScore} size="md" />
          )}
          {selectedItem.usageCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-slate-600 bg-white/50 px-2 py-1 rounded-full">
              <BarChart3 className="w-3 h-3" />
              {selectedItem.usageCount} accounts
            </span>
          )}
          {parentNames.length > 1 && (
            <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              <Link2 className="w-3 h-3" />
              Used in {parentNames.length} items
            </span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors border-b-2
              ${activeTab === tab.id
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* View as Account */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                View as Account:
              </label>
              <select
                value={viewAsAccount}
                onChange={(e) => setViewAsAccount(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Accounts (Generic)</option>
                {accountProfiles.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {account.industry}
                  </option>
                ))}
              </select>
              
              {currentAccount && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Budget:</span>
                    <span className="ml-1 font-medium">{currentAccount.budget}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="ml-1 font-medium">{currentAccount.customizations.timeline}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <button
                  onClick={() => {
                    setEditDescription(selectedItem.description || '')
                    setIsEditingDescription(!isEditingDescription)
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              {isEditingDescription ? (
                <div>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setIsEditingDescription(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDescription}
                      className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                  {selectedItem.description || 'No description'}
                </p>
              )}
            </div>
            
            {/* Metric (for Objectives) */}
            {selectedItem.type === 'objective' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Success Metric</label>
                <div className="p-3 bg-violet-50 rounded-lg">
                  <p className="text-sm text-violet-700 font-medium">
                    {selectedItem.metric || 'No metric defined'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Parents (for Tactics, BP, Steps) */}
            {parents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Parent {selectedItem.type === 'tactic' ? 'Objectives' : selectedItem.type === 'bestPractice' ? 'Tactics' : 'Best Practices'}
                </label>
                <div className="space-y-2">
                  {parents.map(parent => (
                    <div key={parent.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${typeConfig[parent.type].bgColor} ${typeConfig[parent.type].textColor}`}>
                        {typeConfig[parent.type].label}
                      </span>
                      <span className="text-sm text-slate-700">{parent.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quality Audit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quality Audit</label>
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                {getAuditItems().map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    {item.check ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={`text-sm ${item.check ? 'text-slate-600' : 'text-amber-600'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Actions</label>
              <div className="space-y-2">
                <button
                  onClick={() => setAiPanelOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-lg hover:from-teal-100 hover:to-cyan-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">
                    Generate {config.childType || 'Content'}
                  </span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <Copy className="w-4 h-4" />
                  <span className="font-medium">Duplicate</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">View in app.emplifi.io</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Targeting Tab */}
        {activeTab === 'targeting' && (
          <div className="space-y-6">
            {/* Industries */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Industries</label>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => toggleTargeting('industries', industry)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                      ${selectedItem.targeting?.industries?.includes(industry)
                        ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Regions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Regions</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => toggleTargeting('regions', region)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                      ${selectedItem.targeting?.regions?.includes(region)
                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Job Roles */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Roles</label>
              <div className="flex flex-wrap gap-2">
                {jobRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleTargeting('jobRoles', role)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors
                      ${selectedItem.targeting?.jobRoles?.includes(role)
                        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Summary */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-2">Targeting Summary</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Industries:</span>{' '}
                  {selectedItem.targeting?.industries?.length > 0 
                    ? selectedItem.targeting.industries.join(', ')
                    : 'All industries'}
                </p>
                <p>
                  <span className="font-medium">Regions:</span>{' '}
                  {selectedItem.targeting?.regions?.length > 0 
                    ? selectedItem.targeting.regions.join(', ')
                    : 'All regions'}
                </p>
                <p>
                  <span className="font-medium">Job Roles:</span>{' '}
                  {selectedItem.targeting?.jobRoles?.length > 0 
                    ? selectedItem.targeting.jobRoles.join(', ')
                    : 'All roles'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Children Tab */}
        {activeTab === 'children' && (
          <div className="space-y-4">
            {config.childType && (
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700">
                  {children.length} {config.childType}
                </h3>
                <button className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                  <Plus className="w-3 h-3" />
                  Add {config.childType.slice(0, -1)}
                </button>
              </div>
            )}
            
            {children.length > 0 ? (
              <div className="space-y-2">
                {children.map(child => {
                  const childConfig = typeConfig[child.type]
                  const ChildIcon = childConfig.icon
                  return (
                    <div 
                      key={child.id}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className={`w-8 h-8 ${childConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <ChildIcon className={`w-4 h-4 ${childConfig.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{child.name}</p>
                        <p className="text-xs text-slate-500">{child.status}</p>
                      </div>
                      {child.qualityScore !== undefined && (
                        <QualityScore score={child.qualityScore} size="sm" />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No {config.childType || 'related items'} yet</p>
                {config.childType && (
                  <button className="mt-2 flex items-center gap-1 mx-auto text-sm text-teal-600 hover:text-teal-700 font-medium">
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="space-y-4">
              {activityLog.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    {activity.user === 'AI Assistant' ? (
                      <Sparkles className="w-4 h-4 text-teal-600" />
                    ) : (
                      <User className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">{activity.user}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {activity.time ? formatDistanceToNow(new Date(activity.time), { addSuffix: true }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={() => setDetailPanelOpen(false)}
          className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}
