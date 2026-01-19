export default function QualityScore({ score, size = 'sm' }) {
  const getColorClass = () => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50'
    if (score >= 60) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }
  
  return (
    <div 
      className={`${sizeClasses[size]} ${getColorClass()} rounded-full flex items-center justify-center font-semibold`}
      title={`Quality Score: ${score}/100`}
    >
      {score}
    </div>
  )
}
