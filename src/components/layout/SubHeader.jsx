import { useState } from 'react'
import { 
  Table2, 
  Kanban, 
  Filter, 
  Plus,
  Layers,
  BarChart3,
  Share2
} from 'lucide-react'
import { useFuel } from '../../context/FuelContext'
import CreateObjectiveModal from '../panels/CreateObjectiveModal'
import CreateTacticModal from '../panels/CreateTacticModal'

const tabs = [
  { id: 'content', label: 'Content', icon: Layers },
  { id: 'shared', label: 'Shared Components', icon: Share2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export default function SubHeader() {
  const { 
    activeTab, 
    setActiveTab, 
    viewMode, 
    setViewMode,
    filterPanelOpen,
    setFilterPanelOpen
  } = useFuel()
  
  const [showCreateObjective, setShowCreateObjective] = useState(false)
  const [showCreateTactic, setShowCreateTactic] = useState(false)
  
  return (
    <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* View Toggle - only show on Content tab */}
        {activeTab === 'content' && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 mr-2">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors
                ${viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Table2 className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('workshop')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors
                ${viewMode === 'workshop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Workshop</span>
            </button>
          </div>
        )}
        
        {/* Filters */}
        <button
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${filterPanelOpen
              ? 'bg-teal-50 text-teal-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
        
        {/* Create buttons */}
        <div className="flex items-center gap-1.5 ml-2">
          <button 
            onClick={() => setShowCreateTactic(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tactic</span>
          </button>
          <button 
            onClick={() => setShowCreateObjective(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Objective</span>
          </button>
        </div>
      </div>
      
      {/* Create Modals */}
      <CreateObjectiveModal 
        isOpen={showCreateObjective} 
        onClose={() => setShowCreateObjective(false)} 
      />
      <CreateTacticModal 
        isOpen={showCreateTactic} 
        onClose={() => setShowCreateTactic(false)} 
      />
    </div>
  )
}
