import { Target, Layers, BookOpen, ListChecks } from 'lucide-react'
import { motion } from 'framer-motion'

const types = [
  {
    id: 'objective',
    label: 'Objective',
    icon: Target,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    description: 'High-level goal with metrics and deadline',
    examples: ['Increase brand awareness by 25%', 'Acquire 1000 new leads', 'Improve engagement rate'],
    hint: 'Objectives define WHAT we want to achieve',
  },
  {
    id: 'tactic',
    label: 'Tactic',
    icon: Layers,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    description: 'Strategy and approach to reach the goal',
    examples: ['Influencer marketing campaign', 'Content calendar strategy', 'Paid social campaigns'],
    hint: 'Tactics define HOW we achieve the objective',
  },
  {
    id: 'bestPractice',
    label: 'Best Practice',
    icon: BookOpen,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    description: 'Recommended procedure or proven practice',
    examples: ['Micro-influencer outreach', 'A/B testing framework', 'Content pillar strategy'],
    hint: 'Best practices are specific guides within a tactic',
  },
  {
    id: 'step',
    label: 'Step',
    icon: ListChecks,
    color: 'slate',
    gradient: 'from-slate-500 to-slate-700',
    bgLight: 'bg-slate-100',
    description: 'Individual action or task to perform',
    examples: ['Set up UTM parameters', 'Check engagement metrics', 'Launch automation'],
    hint: 'Steps are specific TODO items',
  },
]

export default function TypeSelectionStep({ data, updateData }) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          What do you want to create?
        </h3>
        <p className="text-slate-600">
          Choose the type of content you need. AI will help you with the content.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {types.map((type, index) => {
          const Icon = type.icon
          const isSelected = data.type === type.id
          
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => updateData({ type: type.id })}
              className={`relative p-6 rounded-2xl text-left transition-all group
                ${isSelected 
                  ? `ring-2 ring-${type.color}-500 ${type.bgLight}` 
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selectedType"
                  className={`absolute inset-0 rounded-2xl ring-2 ring-${type.color}-500 ${type.bgLight}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Label & Description */}
                <h4 className="text-lg font-semibold text-slate-900 mb-1">
                  {type.label}
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  {type.description}
                </p>
                
                {/* Examples */}
                <div className="space-y-1">
                  {type.examples.map((example, i) => (
                    <p key={i} className="text-xs text-slate-500 flex items-center gap-2">
                      <span className={`w-1 h-1 rounded-full bg-${type.color}-400`} />
                      {example}
                    </p>
                  ))}
                </div>
                
                {/* Hint */}
                <p className={`mt-4 text-xs font-medium ${isSelected ? `text-${type.color}-600` : 'text-slate-400'}`}>
                  {type.hint}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
      
      {/* Hierarchy hint */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl">
        <p className="text-sm text-slate-600 text-center">
          <span className="font-medium">Hierarchy:</span>{' '}
          <span className="text-violet-600">Objective</span> → 
          <span className="text-blue-600"> Tactic</span> → 
          <span className="text-emerald-600"> Best Practice</span> → 
          <span className="text-slate-600"> Step</span>
        </p>
      </div>
    </div>
  )
}
