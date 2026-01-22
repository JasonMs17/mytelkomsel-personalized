'use client'

import Header from '@/components/Header'
import UserStatistics from '@/components/UserStatistics'
import SpecialSection from '@/components/SpecialSection'
import PackageSection from '@/components/PackageSection'
import DebugButton from '@/components/DebugButton'
import RecommendationResult from '@/components/RecommendationResult'
import { PackageProvider, usePackageContext } from '@/context/PackageContext'

function AIRecommendationSection() {
  const { recommendationData } = usePackageContext()

  if (!recommendationData) return null

  return (
    <section className="section section-full-width">
      <div className="section-inner">
        <RecommendationResult data={recommendationData} />
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PackageProvider>
      <Header />
      <main className="main-content">
        <UserStatistics />
        <AIRecommendationSection />
        <SpecialSection />
        <PackageSection />
      </main>
      <DebugButton />
    </PackageProvider>
  )
}

