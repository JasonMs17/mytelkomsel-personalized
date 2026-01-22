'use client'

import { usePackageContext } from '@/context/PackageContext'
import PackageCard from './PackageCard'

export default function SpecialSection() {
  const { specialPackages } = usePackageContext()

  return (
    <section className="section section-full-width">
      <div className="section-inner">
        <div className="section-header">
          <h2 className="section-title">Spesial untuk Kamu</h2>
          <a href="#" className="section-link">Lihat Semua</a>
        </div>
        
        <div className="cards-container">
          {specialPackages.map((pkg, index) => (
            <PackageCard 
              key={pkg.id} 
              packageItem={pkg} 
              showSubscriptionBadge={true}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

