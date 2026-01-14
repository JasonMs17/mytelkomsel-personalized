'use client'

import { useState } from 'react'
import { usePackageContext } from '@/context/PackageContext'
import PackageCard from './PackageCard'
import TabButton from './TabButton'

const TABS = [
  { id: 'kamu-banget', label: 'Kamu Banget Nih!', icon: 'globe' },
  { id: 'internet', label: 'Internet', icon: 'internet' },
  { id: 'darurat', label: 'Paket Darurat', icon: 'bell' },
  { id: 'roaming', label: 'Roaming', icon: 'plane' },
  { id: 'hiburan', label: 'Hiburan', icon: 'play' },
  { id: 'telepon-sms', label: 'Telepon & SMS', icon: 'phone' },
]

const TAB_CATEGORY_NAMES: Record<string, string> = {
  'internet': 'Hyper 5G',
  'darurat': 'Paket Darurat',
  'roaming': 'Paket Roaming',
  'hiburan': 'Paket Hiburan',
  'telepon-sms': 'Paket Telepon & SMS',
}

export default function PackageSection() {
  const [activeTab, setActiveTab] = useState('kamu-banget')
  const { getPackagesByCategory } = usePackageContext()

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const renderTabContent = () => {
    if (activeTab === 'kamu-banget') {
      return (
        <>
          <div className="tab-content-section">
            <h3 className="tab-content-title">Rekomendasi Utama</h3>
            <p className="tab-content-subtitle">Berdasarkan pemakaianmu bulan lalu</p>
            <div className="cards-container">
              {getPackagesByCategory('rekomendasi-utama').map((pkg, index) => (
                <PackageCard 
                  key={pkg.id} 
                  packageItem={pkg} 
                  showSubscriptionBadge={false}
                  index={index}
                />
              ))}
            </div>
          </div>
          <div className="tab-content-section">
            <h3 className="tab-content-title">Spesial Waktu Terbatas</h3>
            <p className="tab-content-subtitle">Paket begadang/malam</p>
            <div className="cards-container">
              {getPackagesByCategory('waktu-terbatas').map((pkg, index) => (
                <PackageCard 
                  key={pkg.id} 
                  packageItem={pkg} 
                  showSubscriptionBadge={false}
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )
    }

    const packages = getPackagesByCategory(activeTab)
    const categoryName = TAB_CATEGORY_NAMES[activeTab] || 'Paket'

    return (
      <div className="tab-content-section">
        <h3 className="tab-content-title">{categoryName}</h3>
        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <PackageCard 
              key={pkg.id} 
              packageItem={pkg} 
              showSubscriptionBadge={false}
              isGrid={true}
              index={index}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="section">
      <h2 className="section-title">Pilih Paket Kuota</h2>
      
      <div className="tabs" role="tablist" aria-label="Kategori paket">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            tabId={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
          />
        ))}
      </div>

      <div id="tabContent" role="tabpanel">
        {renderTabContent()}
      </div>
    </section>
  )
}

