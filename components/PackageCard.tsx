'use client'

import { usePackageContext } from '@/context/PackageContext'

interface PackageItem {
  id: number
  name: string
  data: string
  duration: string
  type: string
  price: string
  category: string
  isSubscription?: boolean
}

interface PackageCardProps {
  packageItem: PackageItem
  showSubscriptionBadge?: boolean
  isGrid?: boolean
  index?: number
}

export default function PackageCard({ 
  packageItem, 
  showSubscriptionBadge = false, 
  isGrid = false,
  index = 0 
}: PackageCardProps) {
  const { showRecommendation } = usePackageContext()
  
  const staggerClass = `stagger-${Math.min((index % 5) + 1, 5)}`
  const cardClass = isGrid ? 'package-card-grid' : 'package-card'
  const nameClass = showSubscriptionBadge ? 'package-name' : 'package-name no-badge'

  const handleClick = () => {
    showRecommendation(packageItem)
  }

  return (
    <div 
      className={`${cardClass} ${staggerClass}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Paket ${packageItem.name} - ${packageItem.data}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {showSubscriptionBadge && (
        <div className="package-badge">Berlangganan</div>
      )}
      <div className={nameClass}>{packageItem.name}</div>
      <div className="package-data">{packageItem.data}</div>
      <div className="package-duration">{packageItem.duration}</div>
      <div className="package-type">{packageItem.type}</div>
      {packageItem.price && (
        <div className="package-price">{packageItem.price}</div>
      )}
    </div>
  )
}

