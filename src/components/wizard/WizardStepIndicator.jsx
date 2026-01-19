import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WizardStepIndicator({ steps, currentStep, onStepClick }) {
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = index < currentStep
        
        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick(index)}
            disabled={!isClickable}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
              ${isCurrent ? 'bg-slate-800' : ''}
              ${isClickable ? 'hover:bg-slate-800 cursor-pointer' : 'cursor-default'}
            `}
          >
            {/* Step Number / Check */}
            <div className={`
              relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
              ${isCompleted 
                ? 'bg-teal-500 text-white' 
                : isCurrent 
                  ? 'bg-teal-500 text-white ring-4 ring-teal-500/20' 
                  : 'bg-slate-700 text-slate-400'
              }
            `}>
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate transition-colors
                ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}
              `}>
                {step.label}
              </p>
              <p className={`text-xs truncate transition-colors
                ${isCurrent ? 'text-slate-400' : 'text-slate-600'}
              `}>
                {step.description}
              </p>
            </div>
          </button>
        )
      })}
      
      {/* Progress Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Postup</span>
          <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}
