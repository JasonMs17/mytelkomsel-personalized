'use client'

import Header from '@/components/Header'
import SpecialSection from '@/components/SpecialSection'
import PackageSection from '@/components/PackageSection'
import Popup from '@/components/Popup'
import { PackageProvider } from '@/context/PackageContext'

export default function Home() {
  return (
    <PackageProvider>
      <Header />
      <main className="main-content">
        <SpecialSection />
        <PackageSection />
      </main>
      <Popup />
    </PackageProvider>
  )
}

