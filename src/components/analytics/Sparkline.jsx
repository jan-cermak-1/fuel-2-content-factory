export default function Sparkline({ data, color = 'text-teal-500', height = 32 }) {
  if (!data || data.length === 0) return null
  
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  // Create area fill path
  const areaPoints = `0,100 ${points} 100,100`
  
  // Get stroke color class to actual color
  const colorMap = {
    'text-violet-500': '#8B5CF6',
    'text-blue-500': '#3B82F6',
    'text-emerald-500': '#10B981',
    'text-rose-500': '#F43F5E',
    'text-teal-500': '#14B8A6',
  }
  
  const strokeColor = colorMap[color] || '#14B8A6'
  const fillColor = strokeColor + '20' // 20 = 12.5% opacity in hex
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      {/* Area fill */}
      <polygon
        points={areaPoints}
        fill={fillColor}
      />
      
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx="100"
          cy={100 - ((data[data.length - 1] - min) / range) * 100}
          r="3"
          fill={strokeColor}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )
}
