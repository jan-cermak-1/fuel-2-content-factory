import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import SubHeader from './SubHeader'
import { useFuel } from '../../context/FuelContext'
import TableView from '../table-view/TableView'
import WorkshopView from '../workshop-view/WorkshopView'
import SharedComponentsView from '../shared-components/SharedComponentsView'
import AnalyticsView from '../analytics/AnalyticsView'
import DetailPanel from '../panels/DetailPanel'
import AIGenerationPanel from '../panels/AIGenerationPanel'
import FilterPanel from '../panels/FilterPanel'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { 
    activeTab, 
    viewMode, 
    detailPanelOpen, 
    aiPanelOpen, 
    filterPanelOpen 
  } = useFuel()
  
  const renderMainContent = () => {
    switch (activeTab) {
      case 'content':
        return viewMode === 'table' ? <TableView /> : <WorkshopView />
      case 'shared':
        return <SharedComponentsView />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <TableView />
    }
  }
  
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <SubHeader />
        
        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <main className="flex-1 overflow-auto p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${viewMode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Filter Panel */}
          <AnimatePresence>
            {filterPanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-l border-slate-200"
              >
                <FilterPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Detail Panel - slides in from right */}
      <AnimatePresence>
        {detailPanelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl border-l border-slate-200 z-40"
          >
            <DetailPanel />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Generation Panel - slides in from right */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl border-l border-slate-200 z-50"
          >
            <AIGenerationPanel />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop when panels are open */}
      <AnimatePresence>
        {(detailPanelOpen || aiPanelOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => {
              // Close panels when clicking backdrop
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
