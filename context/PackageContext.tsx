'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PackageItem {
  id: number
  name: string
  data: string
  duration: string
  type: string
  price: string
  category: string
  isSubscription?: boolean
  usage?: string
  timeLimited?: boolean
}

interface PopupData {
  message: string
  packageItem: PackageItem
}

interface PackageContextType {
  specialPackages: PackageItem[]
  getPackagesByCategory: (category: string) => PackageItem[]
  popupData: PopupData | null
  showRecommendation: (packageItem: PackageItem) => void
  closePopup: () => void
  acceptRecommendation: () => void
}

const PackageContext = createContext<PackageContextType | undefined>(undefined)

const packageData: Record<string, PackageItem[]> = {
  'special': [
    { id: 1, name: 'Berlangganan kuota belajar/ilmupedia', data: '22 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp13.500', category: 'education', isSubscription: true },
    { id: 2, name: 'Berlangganan Paket Zoom Pro', data: '1.5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'zoom', isSubscription: true },
    { id: 3, name: 'Berlangganan Google Play Pass', data: '2 GB', duration: '30 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
    { id: 4, name: 'Berlangganan Paket Streaming', data: '5 GB', duration: '7 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
  ],
  'kamu-banget': [
    { id: 5, name: 'kuota belajar/ilmupedia', data: '22 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp13.500', category: 'education' },
    { id: 6, name: 'Paket Zoom Pro', data: '1.5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'zoom' },
    { id: 7, name: 'Google Play Pass', data: '2 GB', duration: '30 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
    { id: 8, name: 'Paket Streaming', data: '5 GB', duration: '7 Hari', type: 'Berlangganan', price: 'Rp30.000', category: 'entertainment', isSubscription: true },
  ],
  'internet': [
    { id: 9, name: 'Super Seru 5G', data: '22 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
    { id: 10, name: 'Super Seru 5G', data: '30 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp60.000', category: 'internet' },
    { id: 11, name: 'Super Seru 5G', data: '40 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp75.000', category: 'internet' },
    { id: 12, name: 'Super Seru 5G', data: '55 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
    { id: 13, name: 'Super Seru 5G', data: '90 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp110.000', category: 'internet' },
    { id: 14, name: 'Super Seru 5G', data: '110 GB', duration: '28 Hari', type: 'Sekali Beli', price: 'Rp140.000', category: 'internet' },
    { id: 15, name: 'Super Seru 5G', data: '140 GB', duration: '28 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
    { id: 16, name: 'Internet 5G', data: '8 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'internet' },
    { id: 17, name: 'Internet 5G', data: '12 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp50.000', category: 'internet' },
    { id: 18, name: 'Internet 5G', data: '30 GB', duration: '30 Hari', type: 'Sekali Beli', price: '', category: 'internet' },
    { id: 19, name: 'Internet 5G', data: '120 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp200.000', category: 'internet' },
  ],
  'darurat': [
    { id: 20, name: 'Paket Darurat 1GB', data: '1 GB', duration: '1 Hari', type: 'Sekali Beli', price: 'Rp10.000', category: 'emergency' },
    { id: 21, name: 'Paket Darurat 2GB', data: '2 GB', duration: '1 Hari', type: 'Sekali Beli', price: 'Rp15.000', category: 'emergency' },
    { id: 22, name: 'Paket Darurat 5GB', data: '5 GB', duration: '3 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'emergency' },
  ],
  'roaming': [
    { id: 23, name: 'Roaming Asia', data: '3 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp150.000', category: 'roaming' },
    { id: 24, name: 'Roaming Global', data: '5 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp250.000', category: 'roaming' },
  ],
  'hiburan': [
    { id: 25, name: 'Paket YouTube', data: '10 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'youtube' },
    { id: 26, name: 'Paket Netflix', data: '15 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'netflix' },
    { id: 27, name: 'Paket Streaming All', data: '20 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp50.000', category: 'streaming' },
  ],
  'telepon-sms': [
    { id: 28, name: 'Paket Telepon', data: '100 Menit', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp20.000', category: 'call' },
    { id: 29, name: 'Paket SMS', data: '100 SMS', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp15.000', category: 'sms' },
    { id: 30, name: 'Paket Combo', data: '50 Menit + 50 SMS', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp25.000', category: 'combo' },
  ],
  'rekomendasi-utama': [
    { id: 31, name: 'Paket YouTube Premium', data: '5 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp30.000', category: 'youtube', usage: '3 GB' },
    { id: 32, name: 'Paket Zoom Pro', data: '3 GB', duration: '7 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'zoom', usage: '2.5 GB' },
    { id: 33, name: 'Paket Streaming', data: '10 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp40.000', category: 'streaming', usage: '8 GB' },
    { id: 34, name: 'Paket Belajar', data: '15 GB', duration: '30 Hari', type: 'Sekali Beli', price: 'Rp35.000', category: 'education', usage: '12 GB' },
  ],
  'waktu-terbatas': [
    { id: 35, name: 'Paket Begadang', data: '10 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp15.000', category: 'night', timeLimited: true },
    { id: 36, name: 'Paket Malam Spesial', data: '20 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp25.000', category: 'night', timeLimited: true },
    { id: 37, name: 'Paket Tengah Malam', data: '15 GB', duration: '1 Malam', type: 'Sekali Beli', price: 'Rp20.000', category: 'night', timeLimited: true },
  ],
}

const usageData: Record<string, { used: string; period: string }> = {
  'youtube': { used: '3 GB', period: 'bulan lalu' },
  'zoom': { used: '2.5 GB', period: 'bulan lalu' },
  'streaming': { used: '8 GB', period: 'bulan lalu' },
  'education': { used: '12 GB', period: 'bulan lalu' },
  'netflix': { used: '5 GB', period: 'bulan lalu' },
}

const categoryNames: Record<string, string> = {
  'youtube': 'YouTube',
  'zoom': 'Zoom',
  'streaming': 'Streaming',
  'education': 'Belajar',
  'netflix': 'Netflix',
}

function generateRecommendationMessage(packageItem: PackageItem): string {
  const category = packageItem.category
  const usage = usageData[category]
  
  if (usage) {
    const categoryName = categoryNames[category] || category
    return `Kamu menghabiskan ${usage.used} di ${categoryName} ${usage.period}, mau tambah paket ${packageItem.name} ${packageItem.data}?`
  }
  
  return `Berdasarkan pemakaianmu, paket ${packageItem.name} ${packageItem.data} cocok untuk kamu. Mau tambahkan?`
}

export function PackageProvider({ children }: { children: ReactNode }) {
  const [popupData, setPopupData] = useState<PopupData | null>(null)

  const specialPackages = packageData.special || []

  const getPackagesByCategory = (category: string): PackageItem[] => {
    return packageData[category] || []
  }

  const showRecommendation = (packageItem: PackageItem) => {
    const message = generateRecommendationMessage(packageItem)
    setPopupData({ message, packageItem })
    document.body.style.overflow = 'hidden'
  }

  const closePopup = () => {
    setPopupData(null)
    document.body.style.overflow = 'auto'
  }

  const acceptRecommendation = () => {
    if (!popupData) return
    
    setTimeout(() => {
      closePopup()
      alert('Paket berhasil ditambahkan!')
    }, 1000)
  }

  return (
    <PackageContext.Provider
      value={{
        specialPackages,
        getPackagesByCategory,
        popupData,
        showRecommendation,
        closePopup,
        acceptRecommendation,
      }}
    >
      {children}
    </PackageContext.Provider>
  )
}

export function usePackageContext() {
  const context = useContext(PackageContext)
  if (context === undefined) {
    throw new Error('usePackageContext must be used within a PackageProvider')
  }
  return context
}

