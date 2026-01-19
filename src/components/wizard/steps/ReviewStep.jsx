import { useState } from 'react'
import { 
  Check, 
  Loader2, 
  Target,
  Layers,
  BookOpen,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../../context/FuelContext'

const typeConfig = {
  objective: { 
    label: 'Objective', 
    icon: Target, 
    color: 'violet',
    childType: 'tactic',
    childLabel: 'Tactics',
  },
  tactic: { 
    label: 'Tactic', 
    icon: Layers, 
    color: 'blue',
    childType: 'bestPractice',
    childLabel: 'Best Practices',
  },
  bestPractice: { 
    label: 'Best Practice', 
    icon: BookOpen, 
    color: 'emerald',
    childType: 'step',
    childLabel: 'Steps',
  },
  step: { 
    label: 'Step', 
    icon: ListChecks, 
    color: 'slate',
    childType: null,
    childLabel: null,
  },
}

export default function ReviewStep({ data, updateData, onClose }) {
  const { addItem, updateItem, items } = useFuel()
  const [isCreating, setIsCreating] = useState(false)
  const [createdItems, setCreatedItems] = useState([])
  const [expandedItems, setExpandedItems] = useState(new Set(['main']))
  const [editingItem, setEditingItem] = useState(null)
  
  const config = typeConfig[data.type]
  const Icon = config?.icon || Layers
  
  // Get all items to create
  const mainItem = {
    id: 'main',
    type: data.type,
    name: data.name || data.generatedContent?.name || 'Unnamed Item',
    description: data.description || data.generatedContent?.description || '',
    isMain: true,
    settings: data.generatedContent?.settings,
    contentOutline: data.generatedContent?.contentOutline,
  }
  
  const variantItems = (data.generatedVariants || []).map(v => ({
    ...v,
    type: data.type,
    isVariant: true,
  }))
  
  const allItems = [mainItem, ...variantItems]
  
  // Suggested children from AI
  const suggestedChildren = data.generatedContent?.suggestedTactics 
    || data.generatedContent?.suggestedBestPractices 
    || data.generatedContent?.suggestedSteps 
    || []
  
  const toggleItemExpanded = (id) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }
  
  const handleCreate = async () => {
    setIsCreating(true)
    const created = []
    
    // Create all items with delay for visual feedback
    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i]
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newItemId = `${data.type}-${Date.now()}-${i}`
      
      const newItem = {
        id: newItemId,
        type: item.type,
        name: item.name,
        description: item.description,
        status: data.status || 'draft',
        qualityScore: Math.floor(Math.random() * 15) + 80,
        usageCount: 0,
        targeting: item.targeting || {
          industries: [],
          regions: [],
          jobRoles: [],
          accounts: ['all'],
        },
        parentIds: data.parentId ? [data.parentId] : [],
        childIds: [],
        owner: 'Current User',
        lastEditedBy: 'Current User',
        lastEditedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ...(item.settings && { settings: item.settings }),
        ...(data.type === 'objective' && data.metrics?.length && { metric: data.metrics[0] }),
      }
      
      addItem(newItem)
      
      // Update parent if exists
      if (data.parentId) {
        const parent = items.find(i => i.id === data.parentId)
        if (parent) {
          updateItem(data.parentId, {
            childIds: [...(parent.childIds || []), newItemId]
          })
        }
      }
      
      created.push({ ...newItem, originalId: item.id })
      setCreatedItems([...created])
      
      // Create children if enabled
      if (data.includeChildren && suggestedChildren.length > 0 && item.isMain) {
        for (let j = 0; j < Math.min(suggestedChildren.length, data.childCount || 3); j++) {
          await new Promise(resolve => setTimeout(resolve, 200))
          
          const child = suggestedChildren[j]
          const childId = `${config.childType}-${Date.now()}-${j}`
          
          const childItem = {
            id: childId,
            type: config.childType,
            name: child.name,
            description: child.description || '',
            status: 'draft',
            qualityScore: Math.floor(Math.random() * 15) + 75,
            usageCount: 0,
            targeting: { industries: [], regions: [], jobRoles: [], accounts: ['all'] },
            parentIds: [newItemId],
            childIds: [],
            owner: 'Current User',
            lastEditedBy: 'Current User',
            lastEditedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            ...(child.actionType && { actionType: child.actionType }),
          }
          
          addItem(childItem)
          
          // Update the parent item to include this child
          // Note: We need to update the item we just created
          const parentItem = items.find(i => i.id === newItemId) || newItem
          updateItem(newItemId, {
            childIds: [...(parentItem.childIds || []), childId]
          })
          
          created.push({ ...childItem, isChild: true })
          setCreatedItems([...created])
        }
      }
    }
    
    setIsCreating(false)
  }
  
  const renderItemPreview = (item, index) => {
    const itemConfig = typeConfig[item.type]
    const ItemIcon = itemConfig?.icon || Layers
    const isExpanded = expandedItems.has(item.id)
    const isCreated = createdItems.some(c => c.originalId === item.id)
    
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`border rounded-xl overflow-hidden transition-all
          ${isCreated 
            ? 'border-emerald-300 bg-emerald-50' 
            : 'border-slate-200 bg-white'
          }`}
      >
        <button
          onClick={() => toggleItemExpanded(item.id)}
          className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors"
        >
          {/* Status indicator */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
            ${isCreated 
              ? 'bg-emerald-200' 
              : `bg-${itemConfig?.color || 'slate'}-100`
            }`}
          >
            {isCreated ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <ItemIcon className={`w-4 h-4 text-${itemConfig?.color || 'slate'}-600`} />
            )}
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-900">{item.name}</p>
              {item.isMain && (
                <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-600 rounded">Main</span>
              )}
              {item.isVariant && (
                <span className={`px-1.5 py-0.5 text-xs bg-${itemConfig?.color || 'slate'}-100 text-${itemConfig?.color || 'slate'}-700 rounded`}>
                  Variant
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {itemConfig?.label} • {item.targeting?.industries?.[0] || item.targeting?.regions?.[0] || item.targeting?.jobRoles?.[0] || 'All segments'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCreated && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingItem(item.id)
                }}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 text-slate-400" />
              </button>
            )}
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-slate-100">
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <p className="text-sm text-slate-700">{item.description || 'No description'}</p>
                  </div>
                  
                  {item.settings && (
                    <div className="p-3 bg-violet-50 rounded-lg text-xs space-y-1">
                      <div><span className="font-medium text-violet-700">Metrics:</span> {item.settings.metrics?.join(', ')}</div>
                      <div><span className="font-medium text-violet-700">Baseline → Target:</span> {item.settings.baseline} → {item.settings.target}</div>
                    </div>
                  )}
                  
                  {item.targeting && Object.values(item.targeting).some(v => v?.length > 0 && v[0] !== 'all') && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <label className="block text-xs font-medium text-slate-500 mb-2">Targeting</label>
                      <div className="flex flex-wrap gap-1.5">
                        {item.targeting.industries?.map((ind, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded-full">{ind}</span>
                        ))}
                        {item.targeting.regions?.map((reg, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{reg}</span>
                        ))}
                        {item.targeting.jobRoles?.map((role, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">{role}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
  
  // Success state
  if (createdItems.length > 0 && !isCreating) {
    const mainCreated = createdItems.filter(c => !c.isChild)
    const childrenCreated = createdItems.filter(c => c.isChild)
    
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Done!
        </h3>
        <p className="text-slate-600 mb-8">
          Successfully created {mainCreated.length} {mainCreated.length === 1 ? 'item' : 'items'}
          {childrenCreated.length > 0 && ` and ${childrenCreated.length} ${config.childLabel?.toLowerCase() || 'nested items'}`}.
        </p>
        
        <div className="space-y-3 text-left mb-8">
          {createdItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg
                ${item.isChild ? 'bg-slate-50 ml-8' : 'bg-emerald-50'}`}
            >
              <CheckCircle2 className={`w-5 h-5 ${item.isChild ? 'text-slate-400' : 'text-emerald-600'}`} />
              <div className="flex-1">
                <p className={`font-medium ${item.isChild ? 'text-slate-700' : 'text-slate-900'}`}>
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  {typeConfig[item.type]?.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
        >
          Close wizard
        </button>
      </div>
    )
  }
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Review and create
        </h3>
        <p className="text-slate-600">
          Overview of all items to create. You can edit them before saving.
        </p>
      </div>
      
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-slate-900">{allItems.length}</p>
          <p className="text-sm text-slate-600">{config?.label || 'Items'}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-slate-900">{variantItems.length}</p>
          <p className="text-sm text-slate-600">Variants</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-slate-900">
            {data.includeChildren ? Math.min(suggestedChildren.length, data.childCount || 3) : 0}
          </p>
          <p className="text-sm text-slate-600">{config?.childLabel || 'Children'}</p>
        </div>
      </div>
      
      {/* Items to create */}
      <div className="space-y-3 mb-6">
        {allItems.map((item, index) => renderItemPreview(item, index))}
      </div>
      
      {/* Children toggle */}
      {config?.childType && suggestedChildren.length > 0 && (
        <div className="p-4 bg-teal-50 rounded-xl mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.includeChildren}
              onChange={(e) => updateData({ includeChildren: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
            />
            <div className="flex-1">
              <p className="font-medium text-teal-900">
                Also generate {config.childLabel}
              </p>
              <p className="text-sm text-teal-700 mb-3">
                AI suggested {suggestedChildren.length} items that you can create right away.
              </p>
              
              {data.includeChildren && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-teal-700">Count:</label>
                    <input
                      type="range"
                      min="1"
                      max={suggestedChildren.length}
                      value={data.childCount || 3}
                      onChange={(e) => updateData({ childCount: Number(e.target.value) })}
                      className="flex-1 accent-teal-500"
                    />
                    <span className="text-sm font-medium text-teal-900 w-4">{data.childCount || 3}</span>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg">
                    {suggestedChildren.slice(0, data.childCount || 3).map((child, i) => (
                      <div key={i} className="flex items-center gap-2 py-1 text-sm">
                        <Plus className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-slate-700">{child.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      )}
      
      {/* Create button */}
      <button
        onClick={handleCreate}
        disabled={isCreating}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating {createdItems.length} of {allItems.length + (data.includeChildren ? Math.min(suggestedChildren.length, data.childCount || 3) : 0)}...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Create {allItems.length} {allItems.length === 1 ? 'item' : 'items'}
            {data.includeChildren && suggestedChildren.length > 0 && 
              ` + ${Math.min(suggestedChildren.length, data.childCount || 3)} ${config.childLabel?.toLowerCase()}`
            }
          </>
        )}
      </button>
      
      {/* Warning */}
      {allItems.some(item => !item.name) && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Some items don't have a name. We recommend naming them before creating.
          </p>
        </div>
      )}
    </div>
  )
}
