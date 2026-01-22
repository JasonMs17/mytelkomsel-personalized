'use client'

import { useState } from 'react'
import { usePackageContext } from '@/context/PackageContext'
import styles from './PackageCard.module.css'

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
  const [showModal, setShowModal] = useState(false)
  
  const staggerClass = `stagger-${Math.min((index % 5) + 1, 5)}`
  const cardClass = isGrid ? 'package-card-grid' : 'package-card'
  const nameClass = showSubscriptionBadge ? 'package-name' : 'package-name no-badge'

  const handleClick = () => {
    setShowModal(true)
  }

  return (
    <>
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

      {/* Modal Detail */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{packageItem.name}</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <span className={styles.detailIcon}>📊</span>
                  <span className={styles.detailLabel}>Kuota Data</span>
                  <span className={styles.detailValue}>{packageItem.data}</span>
                </div>

                <div className={styles.detailCard}>
                  <span className={styles.detailIcon}>📅</span>
                  <span className={styles.detailLabel}>Durasi</span>
                  <span className={styles.detailValue}>{packageItem.duration}</span>
                </div>

                <div className={styles.detailCard}>
                  <span className={styles.detailIcon}>💰</span>
                  <span className={styles.detailLabel}>Harga</span>
                  <span className={styles.detailValue}>{packageItem.price}</span>
                </div>

                <div className={styles.detailCard}>
                  <span className={styles.detailIcon}>🏷️</span>
                  <span className={styles.detailLabel}>Tipe Paket</span>
                  <span className={styles.detailValue}>{packageItem.type}</span>
                </div>
              </div>

              <div className={styles.description}>
                <h4>Tentang Paket Ini</h4>
                <p>{packageItem.name} - {packageItem.data}</p>
                <p>Paket berlaku untuk durasi {packageItem.duration} dengan harga {packageItem.price}</p>
              </div>

              <div className={styles.actions}>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => {
                    showRecommendation(packageItem)
                    setShowModal(false)
                  }}
                >
                  Pilih Paket Ini
                </button>
                <button 
                  className={styles.btnSecondary}
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

