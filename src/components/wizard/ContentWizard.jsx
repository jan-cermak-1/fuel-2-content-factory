import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import WizardStepIndicator from './WizardStepIndicator'
import TypeSelectionStep from './steps/TypeSelectionStep'
import BasicInfoStep from './steps/BasicInfoStep'
import AIGenerationStep from './steps/AIGenerationStep'
import VariantsStep from './steps/VariantsStep'
import ReviewStep from './steps/ReviewStep'

const STEPS = [
  { id: 'type', label: 'Type', description: 'Choose what to create' },
  { id: 'info', label: 'Basic Info', description: 'Name and description' },
  { id: 'ai', label: 'AI Generation', description: 'Let AI create content' },
  { id: 'variants', label: 'Variants', description: 'Customize for segments' },
  { id: 'review', label: 'Review', description: 'Review and save' },
]

const initialWizardData = {
  // Step 1: Type
  type: 'tactic',
  
  // Step 2: Basic Info
  name: '',
  description: '',
  parentId: '',
  status: 'draft',
  
  // Step 3: AI Generation
  prompt: '',
  generatedContent: null,
  
  // Objective-specific
  metrics: [],
  dataSources: [],
  baseline: '',
  targetValue: '',
  deadline: '',
  formula: '',
  
  // Tactic-specific
  contentStructure: '',
  includeMedia: { images: true, videos: false, tables: true },
  
  // Step 4: Variants
  generateVariants: false,
  variantBy: null, // 'industry' | 'region' | 'jobRole'
  selectedVariants: [],
  generatedVariants: [],
  
  // Step 5: Review
  includeChildren: true,
  childCount: 3,
}

export default function ContentWizard({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState(initialWizardData)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const updateWizardData = useCallback((updates) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }, [])
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Type selection
        return !!wizardData.type
      case 1: // Basic info
        return wizardData.name.trim().length > 0
      case 2: // AI Generation
        return true // Can skip AI generation
      case 3: // Variants
        return true // Can skip variants
      case 4: // Review
        return true
      default:
        return true
    }
  }
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const handleClose = () => {
    setCurrentStep(0)
    setWizardData(initialWizardData)
    onClose()
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'Enter' && !e.shiftKey && canProceed()) {
      e.preventDefault()
      handleNext()
    }
  }
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TypeSelectionStep
            data={wizardData}
            updateData={updateWizardData}
          />
        )
      case 1:
        return (
          <BasicInfoStep
            data={wizardData}
            updateData={updateWizardData}
          />
        )
      case 2:
        return (
          <AIGenerationStep
            data={wizardData}
            updateData={updateWizardData}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )
      case 3:
        return (
          <VariantsStep
            data={wizardData}
            updateData={updateWizardData}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )
      case 4:
        return (
          <ReviewStep
            data={wizardData}
            updateData={updateWizardData}
            onClose={handleClose}
          />
        )
      default:
        return null
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Wizard Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative flex w-full h-full"
      >
        {/* Left Sidebar - Step Indicator */}
        <div className="w-72 bg-slate-900 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">Content Wizard</h1>
              <p className="text-xs text-slate-400">Create content with AI</p>
            </div>
          </div>
          
          <WizardStepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(index) => index < currentStep && setCurrentStep(index)}
          />
          
          <div className="mt-auto pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> for next step
            </p>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {STEPS[currentStep].label}
              </h2>
              <p className="text-sm text-slate-500">
                {STEPS[currentStep].description}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Footer Navigation */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              {currentStep > 1 && currentStep < 4 && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Skip
                </button>
              )}
              
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
