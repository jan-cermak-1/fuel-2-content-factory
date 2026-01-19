import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'

export default function InlineEditor({ value, onSave, onCancel }) {
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef(null)
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (editValue.trim()) {
        onSave(editValue.trim())
      }
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }
  
  return (
    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (editValue.trim() && editValue.trim() !== value) {
            onSave(editValue.trim())
          } else {
            onCancel()
          }
        }}
        className="flex-1 px-2 py-1 text-sm border border-teal-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        onClick={() => {
          if (editValue.trim()) {
            onSave(editValue.trim())
          }
        }}
        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="p-1 text-slate-400 hover:bg-slate-100 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
