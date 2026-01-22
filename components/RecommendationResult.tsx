'use client'

import { useState, useEffect } from 'react'
import styles from './RecommendationResult.module.css'

// Interface untuk coverage scores dari SAW
interface CoverageScores {
  cov_total: number
  cov_video: number
  cov_game: number
  cov_social: number
  cov_work: number
  score_cost: number
}

// Interface untuk SAW weights
interface SAWWeights {
  w_cost: number
  w_total: number
  w_video: number
  w_game: number
  w_social: number
  w_work: number
}

// Interface untuk user needs
interface UserNeeds {
  need_total: number
  need_video: number
  need_game: number
  need_social: number
  need_work: number
}

// Interface untuk user price behaviour
interface UserPriceBehaviour {
  avg_price: number
  max_price: number
  price_sensitivity: 'HIGH' | 'MEDIUM' | 'LOW'
}

// Interface untuk user lifecycle
interface UserLifecycle {
  lifecycle_status: 'ACTIVE' | 'WARNING' | 'CHURN_RISK'
}

// Interface untuk paket yang sudah discore dengan SAW
interface ScoredPackage {
  package_id: string
  name: string
  type: 'REGULAR' | 'COMBO' | 'APP_ONLY'
  price: number
  days: number
  main_gb: number
  video_gb: number
  game_gb: number
  social_gb: number
  work_gb: number
  price_per_day: number
  coverage: CoverageScores
  score: number
  score_percent: number
  explanation: string
}

// Interface untuk SAW debug info
interface SAWDebug {
  weights: SAWWeights
  candidates_count: number
  filtered_count: number
  fallback_used: boolean
  fallback_reason?: string
}

interface RecommendationResultProps {
  data: {
    user_id: string
    profile: {
      needs: UserNeeds
      price_behaviour: UserPriceBehaviour
      lifecycle: UserLifecycle
    }
    saw_debug: SAWDebug
    recommendations: ScoredPackage[]
  }
}

export default function RecommendationResult({ data }: RecommendationResultProps) {
  if (!data) return null

  const { user_id, profile, saw_debug, recommendations } = data
  const [selectedPackage, setSelectedPackage] = useState<ScoredPackage | null>(null)
  const [analysis, setAnalysis] = useState<string>('')
  const [loadingAnalysis, setLoadingAnalysis] = useState(true)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Get top 3 recommendations
        const topThree = recommendations.slice(0, 3)

        if (topThree.length === 0) {
          setLoadingAnalysis(false)
          return
        }

        // Fetch single analysis for top 1 (first recommendation)
        const topRecommendation = topThree[0]
        
        const response = await fetch('/api/analyze-recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userProfile: profile,
            sawDebug: saw_debug,
            topRecommendation: topRecommendation,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          if (result.analysis) {
            setAnalysis(result.analysis)
          }
        } else {
          console.error('API error:', response.status)
        }
      } catch (error) {
        console.error('Error fetching analysis:', error)
      } finally {
        setLoadingAnalysis(false)
      }
    }

    fetchAnalysis()
  }, [data, profile, saw_debug])

  // Helper untuk mendapatkan total kuota
  const getTotalQuota = (pkg: ScoredPackage) => pkg.main_gb + pkg.video_gb + pkg.game_gb + pkg.social_gb + pkg.work_gb

  // Helper untuk warna berdasarkan coverage
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 0.8) return '#22c55e' // green
    if (coverage >= 0.5) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  return (
    <div className={styles.container}>

      {/* Fallback Warning */}
      {saw_debug?.fallback_used && (
        <div className={styles.fallbackWarning}>
          ⚠️ {saw_debug.fallback_reason}
        </div>
      )}

      <div className={styles.recommendationsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.title}>AI Recommendation</h2>
            <p className={styles.subtitle}>Paket terbaik untuk kebutuhan anda</p>
          </div>
          {saw_debug && (
            <div className={styles.weightsTooltip}>
              <span className={styles.infoIcon}>ⓘ</span>
              <div className={styles.tooltipContent}>
                <div className={styles.tooltipTitle}>SAW Weights:</div>
                <div className={styles.tooltipWeights}>
                  <div>Total: <strong>{(saw_debug.weights.w_total * 100).toFixed(0)}%</strong></div>
                  <div>Video: <strong>{(saw_debug.weights.w_video * 100).toFixed(0)}%</strong></div>
                  <div>Game: <strong>{(saw_debug.weights.w_game * 100).toFixed(0)}%</strong></div>
                  <div>Social: <strong>{(saw_debug.weights.w_social * 100).toFixed(0)}%</strong></div>
                  <div>Work: <strong>{(saw_debug.weights.w_work * 100).toFixed(0)}%</strong></div>
                  <div>Cost: <strong>{(saw_debug.weights.w_cost * 100).toFixed(0)}%</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.recommendationGrid}>
          {recommendations && recommendations.length > 0 ? (
            <>
              {/* Analysis Box - Above Cards */}
              {!loadingAnalysis && analysis && (
                <div className={styles.analysisBoxTop}>
                  <div className={styles.suggestionBox}>
                    <div className={styles.suggestionIcon}>✨</div>
                    <div className={styles.suggestionContent}>
                      <p className={styles.suggestionTitle}>AI Analysis</p>
                      <p className={styles.suggestionText}>{analysis}</p>
                    </div>
                  </div>
                </div>
              )}

              {loadingAnalysis && (
                <div className={styles.analysisBoxTop}>
                  <div className={styles.analysisSkeleton}>
                    <div className={styles.skeletonLine}></div>
                    <div className={styles.skeletonLine} style={{ width: '90%' }}></div>
                    <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                  </div>
                </div>
              )}

              {/* Cards Row */}
              <div className={styles.recommendationRow}>
                {recommendations.slice(0, 3).map((pkg, index) => (
                  <div 
                    key={`card-${pkg.package_id}`}
                    className={styles.aiPackageCard}
                    onClick={() => setSelectedPackage(pkg)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedPackage(pkg)
                      }
                    }}
                  >
                    <div className={styles.rankBadge}>#{index + 1}</div>
                    
                    {/* Header dengan gradient background */}
                    <div className={styles.cardHeader}>
                      <h4 className={styles.cardTitle}>{pkg.name}</h4>
                      
                      <div className={styles.quotaDisplay}>
                        <span className={styles.quotaLarge}>{pkg.main_gb + pkg.video_gb + pkg.game_gb} GB</span>
                        <span className={styles.quotaDivider}>|</span>
                        <span className={styles.quotaDays}>{pkg.days} hari</span>
                      </div>
                    </div>

                    {/* Body section */}
                    <div className={styles.cardBody}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Internet</span>
                        <span className={styles.detailValue}>{pkg.main_gb + pkg.video_gb + pkg.game_gb} GB</span>
                      </div>
                      
                      {pkg.type === 'COMBO' && pkg.video_gb > 0 && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Video</span>
                          <span className={styles.detailValue}>{pkg.video_gb} GB</span>
                        </div>
                      )}
                      
                      {pkg.type === 'COMBO' && pkg.game_gb > 0 && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Game</span>
                          <span className={styles.detailValue}>{pkg.game_gb} GB</span>
                        </div>
                      )}
                    </div>

                    {/* Footer - Price */}
                    <div className={styles.cardFooter}>
                      <div className={styles.priceDisplay}>
                        <span className={styles.priceText}>Rp {pkg.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className={styles.matchScore}>
                        <span className={styles.matchLabel}>Match:</span>
                        <span className={styles.matchValue}>{pkg.score_percent.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Tidak ada rekomendasi tersedia</p>
          )}
        </div>
      </div>

      {/* Modal Coverage Detail */}
      {selectedPackage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPackage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{selectedPackage.name}</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setSelectedPackage(null)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Coverage Scores */}
              <div className={styles.coverageSection}>
                <h4>📊 Coverage Analysis</h4>
                <div className={styles.coverageGrid}>
                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>📱</span>
                      <span className={styles.coverageTitle}>Total Coverage</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.cov_total * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.cov_total)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.cov_total * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      {selectedPackage.main_gb + selectedPackage.video_gb + selectedPackage.game_gb + selectedPackage.social_gb + selectedPackage.work_gb}GB / {profile.needs.need_total}GB kebutuhan
                    </span>
                  </div>

                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>🎥</span>
                      <span className={styles.coverageTitle}>Video Coverage</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.cov_video * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.cov_video)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.cov_video * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      {selectedPackage.main_gb + selectedPackage.video_gb}GB tersedia / {profile.needs.need_video}GB kebutuhan
                    </span>
                  </div>

                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>🎮</span>
                      <span className={styles.coverageTitle}>Game Coverage</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.cov_game * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.cov_game)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.cov_game * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      {selectedPackage.main_gb + selectedPackage.game_gb}GB tersedia / {profile.needs.need_game}GB kebutuhan
                    </span>
                  </div>

                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>📱</span>
                      <span className={styles.coverageTitle}>Social Coverage</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.cov_social * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.cov_social)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.cov_social * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      {selectedPackage.main_gb + selectedPackage.social_gb}GB tersedia / {profile.needs.need_social}GB kebutuhan
                    </span>
                  </div>

                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>💼</span>
                      <span className={styles.coverageTitle}>Work Coverage</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.cov_work * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.cov_work)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.cov_work * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      {selectedPackage.main_gb + selectedPackage.work_gb}GB tersedia / {profile.needs.need_work}GB kebutuhan
                    </span>
                  </div>

                  <div className={styles.coverageCard}>
                    <div className={styles.coverageHeader}>
                      <span className={styles.coverageIcon}>💰</span>
                      <span className={styles.coverageTitle}>Cost Efficiency</span>
                    </div>
                    <div className={styles.coverageBarContainer}>
                      <div 
                        className={styles.coverageBarFill}
                        style={{ 
                          width: `${selectedPackage.coverage.score_cost * 100}%`,
                          backgroundColor: getCoverageColor(selectedPackage.coverage.score_cost)
                        }}
                      />
                    </div>
                    <span className={styles.coveragePercent}>
                      {(selectedPackage.coverage.score_cost * 100).toFixed(1)}%
                    </span>
                    <span className={styles.coverageDesc}>
                      Rp{Math.round(selectedPackage.price_per_day).toLocaleString('id-ID')}/hari
                    </span>
                  </div>
                </div>
              </div>

              {/* Quota Breakdown */}
              <div className={styles.quotaBreakdown}>
                <h4>📦 Kuota Breakdown</h4>
                <div className={styles.quotaGrid}>
                  <div className={styles.quotaCard}>
                    <div className={styles.quotaIcon}>📱</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Kuota Utama</span>
                      <span className={styles.quotaValue}>{selectedPackage.main_gb} GB</span>
                    </div>
                  </div>

                  <div className={styles.quotaCard}>
                    <div className={styles.quotaIcon}>🎥</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Bonus Video</span>
                      <span className={styles.quotaValue}>{selectedPackage.video_gb} GB</span>
                    </div>
                  </div>

                  <div className={styles.quotaCard}>
                    <div className={styles.quotaIcon}>🎮</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Bonus Game</span>
                      <span className={styles.quotaValue}>{selectedPackage.game_gb} GB</span>
                    </div>
                  </div>

                  <div className={styles.quotaCard}>
                    <div className={styles.quotaIcon}>💬</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Bonus Social</span>
                      <span className={styles.quotaValue}>{selectedPackage.social_gb} GB</span>
                    </div>
                  </div>

                  <div className={styles.quotaCard}>
                    <div className={styles.quotaIcon}>💼</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Bonus Work</span>
                      <span className={styles.quotaValue}>{selectedPackage.work_gb} GB</span>
                    </div>
                  </div>

                  <div className={styles.quotaCard + ' ' + styles.totalCard}>
                    <div className={styles.quotaIcon}>📊</div>
                    <div className={styles.quotaContent}>
                      <span className={styles.quotaLabel}>Total</span>
                      <span className={styles.quotaValue}>{getTotalQuota(selectedPackage)} GB</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.packageSummary}>
                <h4>💳 Ringkasan</h4>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span>Harga</span>
                    <strong>Rp{selectedPackage.price.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Durasi</span>
                    <strong>{selectedPackage.days} Hari</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>SAW Score</span>
                    <strong>{selectedPackage.score_percent.toFixed(1)}%</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Tipe</span>
                    <strong>{selectedPackage.type}</strong>
                  </div>
                </div>
              </div>

              <button 
                className={styles.btnSubscribe}
                onClick={() => {
                  alert(`Paket ${selectedPackage.name} dipilih!`)
                  setSelectedPackage(null)
                }}
              >
                Pilih Paket Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}