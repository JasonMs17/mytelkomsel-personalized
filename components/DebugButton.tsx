'use client'

import { useState } from 'react'
import styles from './DebugButton.module.css'

interface DebugInfo {
  region?: string
  AWS_PROFILE?: string
  tables?: string[]
  error?: string
}

export default function DebugButton() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [seedStatus, setSeedStatus] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

  const handleDebugClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/debug')
      const contentType = response.headers.get('content-type')
      
      let data
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = {
          error: `Invalid response: ${text.substring(0, 200)}`
        }
      }
      
      setDebugInfo(data)
      setShowModal(true)
    } catch (error: any) {
      setDebugInfo({
        error: error?.message || 'Failed to fetch debug info'
      })
      setShowModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedCatalog = async () => {
    setSeeding(true)
    setSeedStatus('Seeding...')
    try {
      const response = await fetch('/api/seed-catalog', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        setSeedStatus(`✅ Seeded ${data.count} packages successfully!`)
      } else {
        setSeedStatus(`❌ Error: ${data.error}`)
      }
    } catch (error: any) {
      setSeedStatus(`❌ Error: ${error.message}`)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <>
      <button 
        className={styles.debugBtn}
        onClick={handleDebugClick}
        disabled={isLoading}
        title="Test DynamoDB connection"
      >
        {isLoading ? 'Testing...' : '🔧 Debug'}
      </button>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>DynamoDB Debug Info</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              {debugInfo?.error ? (
                <div className={styles.errorBlock}>
                  <strong>Error:</strong> {debugInfo.error}
                </div>
              ) : (
                <>
                  <div className={styles.infoBlock}>
                    <strong>Region:</strong>
                    <code>{debugInfo?.region || 'N/A'}</code>
                  </div>
                  
                  <div className={styles.infoBlock}>
                    <strong>AWS Profile:</strong>
                    <code>{debugInfo?.AWS_PROFILE || 'N/A'}</code>
                  </div>

                  <div className={styles.infoBlock}>
                    <strong>Available Tables:</strong>
                    {debugInfo?.tables && debugInfo.tables.length > 0 ? (
                      <ul className={styles.tableList}>
                        {debugInfo.tables.map((table) => (
                          <li key={table}><code>{table}</code></li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.noTables}>No tables found</p>
                    )}
                  </div>
                </>
              )}

              <div className={styles.seedSection}>
                <h3>Database Seeding</h3>
                {seedStatus && (
                  <p className={styles.seedStatus}>{seedStatus}</p>
                )}
                <button 
                  className={styles.seedBtn}
                  onClick={handleSeedCatalog}
                  disabled={seeding}
                >
                  {seeding ? 'Seeding...' : '🌱 Seed Package Catalog'}
                </button>
                <p className={styles.seedHint}>Click to populate package_catalog table with new schema</p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
