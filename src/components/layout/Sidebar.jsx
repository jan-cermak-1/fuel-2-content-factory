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
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

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

function NavSection({ section, isExpanded, onToggle }) {
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

function NavItem({ item }) {
  const Icon = item.icon
  
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

export default function Sidebar() {
  const [expandedSections, setExpandedSections] = useState(['fuel', 'administration'])
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }
  
  return (
    <aside className="w-60 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-200">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">Butler</span>
          <span className="text-xs text-teal-600 font-medium">Fuel 2.0</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navSections.map((section) => (
          <NavSection
            key={section.id}
            section={section}
            isExpanded={expandedSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </nav>
      
      {/* User */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            EC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Elizabeth Choos</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
