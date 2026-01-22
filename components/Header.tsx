'use client'

import { useState, useRef, useEffect } from 'react'
import Cookies from 'js-cookie'
import { usePackageContext } from '../context/PackageContext'
import styles from './Header.module.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState('U01')
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { setRecommendationData } = usePackageContext()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userIds = ['U01', 'U02', 'U03', 'U04', 'U05']

  // Load user from cookies on mount
  useEffect(() => {
    const savedUser = Cookies.get('selectedUserId') || 'U01'
    setSelectedUser(savedUser)
    setIsMounted(true)
  }, [])

  // Auto-fetch recommendations when mounted with saved user
  useEffect(() => {
    if (isMounted && selectedUser) {
      const fetchRecommendations = async () => {
        try {
          const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: selectedUser,
              top_n: 5
            })
          })

          if (response.ok) {
            const data = await response.json()
            setRecommendationData(data)
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error)
        }
      }
      
      fetchRecommendations()
    }
  }, [isMounted])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen])

  const handleUserSelect = async (userId: string) => {
    setSelectedUser(userId)
    // Save to cookies
    Cookies.set('selectedUserId', userId, { expires: 365 })
    setIsLoadingUser(true)
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          top_n: 5
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setRecommendationData(data)
      console.log('Recommendations:', data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoadingUser(false)
      setProfileDropdownOpen(false)
    }
  }

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
            aria-expanded={mobileMenuOpen}
          >
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
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
            <div className={styles.profileDropdownContainer} ref={dropdownRef}>
              <button 
                className={styles.iconBtn} 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Profile"
              >
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </button>
              {profileDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownTitle}>Pilih User ID</span>
                  </div>
                  <div className={styles.userList}>
                    {userIds.map((userId) => (
                      <button
                        key={userId}
                        className={`${styles.userItem} ${selectedUser === userId ? styles.userItemActive : ''}`}
                        onClick={() => handleUserSelect(userId)}
                        disabled={isLoadingUser}
                      >
                        {userId}
                        {selectedUser === userId && <span className={styles.checkmark}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

