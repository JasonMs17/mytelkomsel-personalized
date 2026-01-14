import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MyTelkomsel - Pilih Paket Kuota',
  description: 'Pilih paket kuota terbaik untuk kebutuhanmu',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#ED1C24',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

