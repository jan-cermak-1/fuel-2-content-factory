import React from 'react'
import { 
  ArrowLeft, 
  X, 
  Target, 
  Layers, 
  BookOpen, 
  CheckSquare,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  Building2,
  Briefcase,
  Lock,
  Globe
} from 'lucide-react'
import ProductBadges from '../../common/ProductBadges'
import ScopeSelector from '../../common/ScopeSelector'

// Type configurations
const typeConfig = {
  objective: {
    icon: Target,
    label: 'Objective',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
  },
  tactic: {
    icon: Layers,
    label: 'Tactic',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
  },
  bestPractice: {
    icon: BookOpen,
    label: 'Best Practice',
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
  },
  step: {
    icon: CheckSquare,
    label: 'Step',
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-300',
  },
}

// Status badge
function StatusBadge({ status }) {
  const statusStyles = {
    draft: 'bg-slate-100 text-slate-600',
    'in-review': 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    released: 'bg-emerald-100 text-emerald-700',
  }
  
  const statusLabels = {
    draft: 'Draft',
    'in-review': 'In Review',
    approved: 'Approved',
    released: 'Released',
  }
  
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.draft}`}>
      {statusLabels[status] || status}
    </span>
  )
}

// Quality score indicator
function QualityScore({ score }) {
  const getColor = (s) => {
    if (s >= 90) return 'text-emerald-600'
    if (s >= 75) return 'text-blue-600'
    if (s >= 60) return 'text-amber-600'
    return 'text-red-600'
  }
  
  return (
    <span className={`text-sm font-medium ${getColor(score)}`}>
      Quality: {score}
    </span>
  )
}

// Breadcrumb component
function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-slate-500 overflow-x-auto">
      {items.map((item, idx) => {
        const config = typeConfig[item.type] || typeConfig.objective
        const Icon = config.icon
        const isLast = idx === items.length - 1
        
        return (
          <React.Fragment key={item.id}>
            <button
              onClick={() => !isLast && onNavigate(item)}
              disabled={isLast}
              className={`
                inline-flex items-center gap-1 px-1.5 py-0.5 rounded
                ${isLast 
                  ? `${config.bgColor} ${config.textColor} font-medium` 
                  : 'hover:bg-slate-100 transition-colors'
                }
              `}
            >
              <Icon className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{item.name}</span>
            </button>
            {!isLast && <span className="text-slate-300">/</span>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Scope type icon
const scopeIcons = {
  industry: Building2,
  account: Briefcase,
  internal: Lock,
  universal: Globe,
}

export default function DetailHeader({
  item,
  breadcrumb = [],
  onBack,
  onClose,
  onNavigate,
  onEdit,
  onDuplicate,
  onDelete,
}) {
  const config = typeConfig[item?.type] || typeConfig.objective
  const TypeIcon = config.icon
  const ScopeIcon = scopeIcons[item?.scope?.type] || Globe
  
  const [showMenu, setShowMenu] = React.useState(false)

  if (!item) return null

  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {onBack && breadcrumb.length > 1 && (
            <button
              onClick={onBack}
              className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-500"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {breadcrumb.length > 0 && (
            <Breadcrumb items={breadcrumb} onNavigate={onNavigate} />
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                  {onEdit && (
                    <button
                      onClick={() => { onEdit(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      onClick={() => { onDuplicate(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                  )}
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in new tab
                  </button>
                  {onDelete && (
                    <>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => { onDelete(); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Main header content */}
      <div className="px-4 py-4">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}>
            <TypeIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
          <StatusBadge status={item.status} />
          {item.qualityScore && <QualityScore score={item.qualityScore} />}
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-800 mb-3">
          {item.name}
        </h2>
        
        {/* Scope and Products row */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Scope info */}
          {item.scope && (
            <ScopeSelector 
              scope={item.scope} 
              readOnly 
              compact 
            />
          )}
          
          {/* Divider */}
          {item.scope && item.requiredProducts?.length > 0 && (
            <div className="w-px h-4 bg-slate-200" />
          )}
          
          {/* Required products */}
          {item.requiredProducts?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Requires:</span>
              <ProductBadges productIds={item.requiredProducts} size="xs" maxVisible={4} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { typeConfig, StatusBadge, QualityScore, Breadcrumb }
