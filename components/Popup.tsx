'use client'

import { usePackageContext } from '../context/PackageContext'

export default function Popup() {
  const { popupData, closePopup, acceptRecommendation } = usePackageContext()

  if (!popupData) return null

  return (
    <div 
      className={`popup-overlay ${popupData ? '' : 'hidden'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popupTitle"
      aria-hidden={!popupData}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePopup()
        }
      }}
    >
      <div className="popup-content">
        <div className="popup-header">
          <div>
            <h3 id="popupTitle" className="popup-title">Rekomendasi untuk Kamu</h3>
            <p id="popupMessage" className="popup-message">{popupData.message}</p>
          </div>
          <button 
            className="popup-close" 
            aria-label="Tutup popup"
            onClick={closePopup}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="popup-actions">
          <button className="btn btn-primary" onClick={acceptRecommendation}>
            Ya, Tambahkan
          </button>
          <button className="btn btn-secondary" onClick={closePopup}>
            Tidak, Terima Kasih
          </button>
        </div>
      </div>
    </div>
  )
}

