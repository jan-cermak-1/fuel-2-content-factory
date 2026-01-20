import React from 'react'
import { 
  Calendar, 
  BarChart3, 
  MessageCircle, 
  Users, 
  Star, 
  Headphones,
  Package
} from 'lucide-react'
import { getProductById, getProductsByIds } from '../../data/products'

// Icon mapping
const iconMap = {
  Calendar,
  BarChart3,
  MessageCircle,
  Users,
  Star,
  Headphones,
}

// Single product badge
function ProductBadge({ product, size = 'sm', showName = true }) {
  if (!product) return null
  
  const Icon = iconMap[product.icon] || Package
  
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-0.5',
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
  }
  
  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }
  
  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full
        ${product.bgColor} ${product.textColor}
        ${sizeClasses[size]}
      `}
      title={product.description}
    >
      <Icon className={iconSizes[size]} />
      {showName && <span>{product.shortName}</span>}
    </span>
  )
}

// Product badge by ID
export function ProductBadgeById({ productId, size = 'sm', showName = true }) {
  const product = getProductById(productId)
  return <ProductBadge product={product} size={size} showName={showName} />
}

// Multiple product badges
export default function ProductBadges({ 
  productIds = [],
  size = 'sm',
  showName = true,
  maxVisible = 4,
  className = '',
}) {
  if (!productIds || productIds.length === 0) {
    return (
      <span className="text-xs text-slate-400 italic">No products</span>
    )
  }

  const products = getProductsByIds(productIds)
  const visibleProducts = products.slice(0, maxVisible)
  const hiddenCount = products.length - maxVisible

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {visibleProducts.map(product => (
        <ProductBadge 
          key={product.id} 
          product={product} 
          size={size}
          showName={showName}
        />
      ))}
      {hiddenCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-full">
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}

// Inline text version (for headers)
export function ProductBadgesInline({ productIds = [], showIcon = true }) {
  if (!productIds || productIds.length === 0) return null
  
  const products = getProductsByIds(productIds)
  
  return (
    <span className="text-xs text-slate-500">
      Requires:{' '}
      {products.map((product, idx) => {
        const Icon = iconMap[product.icon] || Package
        return (
          <span key={product.id} className={product.textColor}>
            {showIcon && <Icon className="w-3 h-3 inline mr-0.5" />}
            {product.shortName}
            {idx < products.length - 1 && ', '}
          </span>
        )
      })}
    </span>
  )
}

// Compact row of just icons
export function ProductIconsRow({ productIds = [], size = 'sm' }) {
  if (!productIds || productIds.length === 0) return null
  
  const products = getProductsByIds(productIds)
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  }
  
  return (
    <div className="flex items-center gap-1">
      {products.map(product => {
        const Icon = iconMap[product.icon] || Package
        return (
          <span 
            key={product.id}
            className={`${product.bgColor} ${product.textColor} p-1 rounded`}
            title={product.name}
          >
            <Icon className={iconSizes[size]} />
          </span>
        )
      })}
    </div>
  )
}

// For use in detail headers - more prominent display
export function ProductRequirementsBanner({ productIds = [] }) {
  if (!productIds || productIds.length === 0) return null
  
  const products = getProductsByIds(productIds)
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Requires</span>
      <div className="flex flex-wrap gap-1">
        {products.map(product => (
          <ProductBadge key={product.id} product={product} size="sm" />
        ))}
      </div>
    </div>
  )
}

export { ProductBadge }
