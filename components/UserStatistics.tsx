'use client'

import { usePackageContext } from '../context/PackageContext'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import styles from './UserStatistics.module.css'

export default function UserStatistics() {
  const { recommendationData } = usePackageContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Skeleton loading state
  if (!recommendationData) {
    return (
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <div className={`${styles.skeleton} ${styles.skeletonTitle}`}></div>
              <div className={`${styles.skeleton} ${styles.skeletonSubtitle}`}></div>
            </div>
            <div className={`${styles.skeleton} ${styles.skeletonBadge}`}></div>
          </div>

          <div className={styles.grid}>
            {/* Skeleton Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.card}>
                <div className={`${styles.skeleton} ${styles.skeletonCardTitle}`}></div>
                <div className={styles.skeletonChartArea}>
                  {i === 1 && (
                    <div className={styles.skeletonBars}>
                      {[40, 60, 55, 65, 70, 75].map((height, idx) => (
                        <div key={idx} className={styles.skeletonBar} style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div className={styles.skeletonLines}>
                      {[1, 2, 3, 4, 5].map((_, idx) => (
                        <div key={idx} className={styles.skeletonLine}>
                          <div className={`${styles.skeleton} ${styles.skeletonLineText}`}></div>
                          <div className={`${styles.skeleton} ${styles.skeletonProgressBar}`}></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {i === 3 && (
                    <div className={styles.skeletonStats}>
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className={styles.skeletonStatItem}>
                          <div className={`${styles.skeleton} ${styles.skeletonIcon}`}></div>
                          <div>
                            <div className={`${styles.skeleton} ${styles.skeletonStatValue}`}></div>
                            <div className={`${styles.skeleton} ${styles.skeletonStatLabel}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const { profile } = recommendationData

  // Data untuk grafik pengeluaran (simulasi 6 bulan terakhir)
  const avgPrice = profile.price_behaviour?.avg_price || 100000
  const maxPrice = profile.price_behaviour?.max_price || 100000
  const spendingData = [
    { month: 'Jul', amount: avgPrice * 0.75 },
    { month: 'Agu', amount: avgPrice * 0.82 },
    { month: 'Sep', amount: avgPrice * 0.95 },
    { month: 'Okt', amount: avgPrice * 0.88 },
    { month: 'Nov', amount: avgPrice * 0.92 },
    { month: 'Des', amount: avgPrice * 0.9 },
  ]

  // Data usage pattern dari needs (dalam GB) - konversi ke persentase
  const totalNeeds = profile.needs?.need_total || 1
  const usageData = [
    { name: 'Video', value: ((profile.needs?.need_video || 0) / totalNeeds) * 100, gb: profile.needs?.need_video || 0, color: '#ED1C24' },
    { name: 'Gaming', value: ((profile.needs?.need_game || 0) / totalNeeds) * 100, gb: profile.needs?.need_game || 0, color: '#ED1C24' },
    { name: 'Social', value: ((profile.needs?.need_social || 0) / totalNeeds) * 100, gb: profile.needs?.need_social || 0, color: '#ED1C24' },
    { name: 'Work', value: ((profile.needs?.need_work || 0) / totalNeeds) * 100, gb: profile.needs?.need_work || 0, color: '#ED1C24' },
  ].filter(item => item.value > 0)

  // Hitung lainnya (total - sum of categories)
  const sumCategories = (profile.needs?.need_video || 0) + (profile.needs?.need_game || 0) + 
                        (profile.needs?.need_social || 0) + (profile.needs?.need_work || 0)
  const otherUsage = totalNeeds - sumCategories
  if (otherUsage > 0) {
    usageData.push({ 
      name: 'Lainnya', 
      value: (otherUsage / totalNeeds) * 100, 
      gb: otherUsage, 
      color: '#ED1C24' 
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].payload.month}</p>
          <p className={styles.tooltipValue}>{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  // Sensitivity badge color
  const sensitivityColors: Record<string, string> = {
    HIGH: '#EF4444',
    MEDIUM: '#F59E0B',
    LOW: '#10B981',
  }
  const sensitivityLabels: Record<string, string> = {
    HIGH: 'Sangat Hemat',
    MEDIUM: 'Cukup Hemat',
    LOW: 'Fleksibel',
  }

  return (
    <section className={styles.statsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Analisis Kebutuhan Anda</h2>
            <p className={styles.subtitle}>Data berdasarkan pola penggunaan</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Budget & Spending Chart */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Budget & Pengeluaran</h3>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={spendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e5e5e5' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e5e5e5' }}
                    tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(237, 28, 36, 0.05)' }} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {spendingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === spendingData.length - 1 ? '#ED1C24' : '#FCA5A5'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Avg Price</span>
                <span className={styles.statValue}>{formatCurrency(avgPrice)}</span>
              </div>
            </div>
          </div>

          {/* Data Needs Pattern */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Kebutuhan Data (GB)</h3>
            <div className={styles.totalNeedsHeader}>
              <span className={styles.totalNeedsLabel}>Total Kebutuhan</span>
              <span className={styles.totalNeedsValue}>{totalNeeds} GB</span>
            </div>
            <div className={styles.usageList}>
              {usageData.map((item, index) => (
                <div key={index} className={styles.usageItem}>
                  <div className={styles.usageInfo}>
                    <span className={styles.usageName}>{item.name}</span>
                    <span className={styles.usageGb}>{item.gb.toFixed(1)} GB</span>
                    <span className={styles.usagePercent}>{item.value.toFixed(1)}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Sensitivity */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Sensitivitas Harga</h3>
            <div className={styles.sensitivityContainer}>
              <div className={styles.sensitivityItem}>
                <span className={styles.sensitivityLabel}>Tipe Pengguna</span>
                <span 
                  className={styles.sensitivityBadge}
                  style={{ backgroundColor: sensitivityColors[profile.price_behaviour?.price_sensitivity] || '#666' }}
                >
                  {sensitivityLabels[profile.price_behaviour?.price_sensitivity] || 'Unknown'}
                </span>
              </div>
              <div className={styles.sensitivityDivider}></div>
              <div className={styles.sensitivityItem}>
                <span className={styles.sensitivityLabel}>Budget Maksimal</span>
                <span className={styles.sensitivityValue}>{formatCurrency(maxPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
