'use client'

import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <div className={styles.navContent}>
          <a href="#" className={styles.logo} aria-label="MyTelkomsel Home">
            <img 
              src="/logo.png" 
              alt="MyTelkomsel Logo" 
              style={{ height: '48px', width: 'auto' }}
            />
          </a>
          
          {/* Desktop Menu */}
          <div className={styles.navMenu}>
            <a href="#" className={styles.navLink}>Buka Aplikasi</a>
            <a href="#" className={styles.navLink}>Beranda</a>
            <a href="#" className={styles.navLink}>ExpressPoin</a>
            <div className={styles.navDropdown}>
              <a href="#" className={styles.navLink}>
                Profil Saya
                <svg className={styles.iconSm} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </a>
            </div>
            <a href="#" className={styles.navLink}>Kotak Masuk</a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Desktop Right Side */}
          <div className={styles.navRight}>
            <div className={styles.langSelector}>
              <a href="#" className={styles.langLink}>EN</a>
              <span className={styles.langSeparator}>|</span>
              <a href="#" className={`${styles.langLink} ${styles.active}`}>ID</a>
            </div>
            <button className={styles.iconBtn} aria-label="Messages">
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </button>
            <button className={styles.iconBtn} aria-label="Profile">
              <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <a href="#" className={styles.mobileNavLink}>Buka Aplikasi</a>
          <a href="#" className={styles.mobileNavLink}>Beranda</a>
          <a href="#" className={styles.mobileNavLink}>ExpressPoin</a>
          <a href="#" className={styles.mobileNavLink}>Profil Saya</a>
          <a href="#" className={styles.mobileNavLink}>Kotak Masuk</a>
          <div className={styles.mobileLangSelector}>
            <a href="#" className={styles.langLink}>EN</a>
            <span className={styles.langSeparator}>|</span>
            <a href="#" className={`${styles.langLink} ${styles.active}`}>ID</a>
          </div>
        </div>
      </nav>
      
      <div className={styles.balanceSection}>
        <div className={styles.balanceContent}>
          <div className={styles.balanceInfo}>
            <span className={styles.balanceAmount}>Rp0</span>
            <span className={styles.balanceLabel}>Pulsa</span>
          </div>
          <button className={styles.topupBtn}>Isi Pulsa</button>
        </div>
      </div>
    </header>
  )
}

