// Static color class mappings for Tailwind CSS
// Tailwind cannot compile dynamic class names like `bg-${color}-100`
// so we need to use static classes that are included in the CSS bundle

export const colorClasses = {
  violet: {
    bg50: 'bg-violet-50',
    bg100: 'bg-violet-100',
    bg200: 'bg-violet-200',
    bg600: 'bg-violet-600',
    bg700: 'bg-violet-700',
    text600: 'text-violet-600',
    text700: 'text-violet-700',
    text800: 'text-violet-800',
    text900: 'text-violet-900',
    ring500: 'ring-violet-500',
    border200: 'border-violet-200',
    ringInset: 'ring-2 ring-violet-500',
  },
  blue: {
    bg50: 'bg-blue-50',
    bg100: 'bg-blue-100',
    bg200: 'bg-blue-200',
    bg600: 'bg-blue-600',
    bg700: 'bg-blue-700',
    text600: 'text-blue-600',
    text700: 'text-blue-700',
    text800: 'text-blue-800',
    text900: 'text-blue-900',
    ring500: 'ring-blue-500',
    border200: 'border-blue-200',
    ringInset: 'ring-2 ring-blue-500',
  },
  emerald: {
    bg50: 'bg-emerald-50',
    bg100: 'bg-emerald-100',
    bg200: 'bg-emerald-200',
    bg600: 'bg-emerald-600',
    bg700: 'bg-emerald-700',
    text600: 'text-emerald-600',
    text700: 'text-emerald-700',
    text800: 'text-emerald-800',
    text900: 'text-emerald-900',
    ring500: 'ring-emerald-500',
    border200: 'border-emerald-200',
    ringInset: 'ring-2 ring-emerald-500',
  },
  slate: {
    bg50: 'bg-slate-50',
    bg100: 'bg-slate-100',
    bg200: 'bg-slate-200',
    bg600: 'bg-slate-600',
    bg700: 'bg-slate-700',
    text600: 'text-slate-600',
    text700: 'text-slate-700',
    text800: 'text-slate-800',
    text900: 'text-slate-900',
    ring500: 'ring-slate-500',
    border200: 'border-slate-200',
    ringInset: 'ring-2 ring-slate-500',
  },
}

// Helper to get color classes with fallback
export const getColorClasses = (color) => {
  return colorClasses[color] || colorClasses.slate
}
