import { 
  Zap, 
  Users, 
  Shield, 
  FileText, 
  Tag, 
  HeadphonesIcon, 
  Building2, 
  ToggleLeft, 
  Target, 
  Calendar, 
  Code, 
  Tags, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

const navSections = [
  {
    id: 'administration',
    title: 'Administration',
    items: [
      { id: 'users', label: 'Users', icon: Users },
      { id: 'permissions', label: 'Permissions', icon: Shield },
    ],
  },
  {
    id: 'page-info',
    title: 'Page Info',
    items: [
      { id: 'page-info', label: 'Page Info', icon: FileText },
      { id: 'page-tagging', label: 'Page Tagging', icon: Tag },
    ],
  },
  {
    id: 'support',
    title: 'Support Interface',
    items: [
      { id: 'accounts', label: 'Accounts', icon: Building2 },
      { id: 'support-users', label: 'Users', icon: HeadphonesIcon },
    ],
  },
  {
    id: 'omd',
    title: 'OMD',
    items: [
      { id: 'business-toggles', label: 'Business Toggles', icon: ToggleLeft },
    ],
  },
  {
    id: 'fuel',
    title: 'Fuel',
    highlight: true,
    items: [
      { id: 'objectives-tactics', label: 'Objectives & Tactics', icon: Target, active: true },
      { id: 'industry-events', label: 'Industry Events', icon: Calendar },
      { id: 'custom-scripts', label: 'Custom Scripts', icon: Code },
      { id: 'fuel-labels', label: 'Fuel Profile Labels', icon: Tags },
    ],
  },
  {
    id: 'library',
    title: 'Library',
    items: [
      { id: 'storybook', label: 'Storybook', icon: BookOpen },
    ],
  },
]

function NavSection({ section, isExpanded, onToggle, isCollapsed }) {
  if (isCollapsed) {
    return (
      <div className="mb-1 space-y-0.5">
        {section.items.map((item) => (
          <NavItem key={item.id} item={item} isCollapsed />
        ))}
      </div>
    )
  }
  
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider
          ${section.highlight ? 'text-teal-600' : 'text-slate-500'} hover:bg-slate-50 rounded-lg transition-colors`}
      >
        <span>{section.title}</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-1 space-y-0.5">
          {section.items.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function NavItem({ item, isCollapsed }) {
  const Icon = item.icon
  
  if (isCollapsed) {
    return (
      <a
        href="#"
        title={item.label}
        className={`flex items-center justify-center p-2 rounded-lg transition-colors
          ${item.active 
            ? 'bg-teal-50 text-teal-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
      >
        <Icon className="w-5 h-5" />
      </a>
    )
  }
  
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
        ${item.active 
          ? 'bg-teal-50 text-teal-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </a>
  )
}

export default function Sidebar({ isCollapsed, onToggleCollapse }) {
  const [expandedSections, setExpandedSections] = useState(['fuel', 'administration'])
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }
  
  return (
    <motion.aside 
      className="h-screen bg-white flex flex-col flex-shrink-0"
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-4 py-4 border-b border-slate-200`}>
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="font-bold text-slate-900">Butler</span>
            <span className="text-xs text-teal-600 font-medium">Fuel 2.0</span>
          </motion.div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-1.5' : 'px-2'} py-3`}>
        {navSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            isExpanded={expandedSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
      
      {/* Collapse toggle */}
      <div className={`px-2 py-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onToggleCollapse}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors w-full flex items-center justify-center gap-2"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
      
      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            EC
          </div>
          {!isCollapsed && (
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-medium text-slate-900 truncate">Elizabeth Choos</p>
              <p className="text-xs text-slate-500">Admin</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
