import { useState } from 'react'
import { X, Smartphone, Monitor, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFuel } from '../../context/FuelContext'
import { accountProfiles } from '../../data/accountProfiles'

export default function PreviewModal({ isOpen, onClose, item }) {
  const { viewAsAccount } = useFuel()
  const [device, setDevice] = useState('desktop')
  
  const currentAccount = viewAsAccount !== 'all' 
    ? accountProfiles.find(a => a.id === viewAsAccount) 
    : null
  
  if (!item) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h2 className="font-semibold text-slate-900">Preview in app.emplifi.io</h2>
                <p className="text-sm text-slate-500">
                  {currentAccount ? `Viewing as ${currentAccount.name}` : 'Generic view'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Device Toggle */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setDevice('mobile')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${device === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </button>
                  <button
                    onClick={() => setDevice('desktop')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                      ${device === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </button>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="p-8 bg-slate-100 flex items-center justify-center min-h-[500px]">
              <div 
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300
                  ${device === 'mobile' ? 'w-80' : 'w-full max-w-2xl'}`}
              >
                {/* Mock app header */}
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
                  <p className="text-xs opacity-80">app.emplifi.io</p>
                  <p className="font-semibold">Recommended for you</p>
                </div>
                
                {/* Content card */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{item.description}</p>
                  
                  {/* Targeting tags */}
                  {item.targeting && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.targeting.industries?.slice(0, 2).map(ind => (
                        <span key={ind} className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full">
                          {ind}
                        </span>
                      ))}
                      {item.targeting.regions?.slice(0, 2).map(reg => (
                        <span key={reg} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {reg}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* CTA */}
                  <button className="w-full py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <ExternalLink className="w-4 h-4" />
                Open in app
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
