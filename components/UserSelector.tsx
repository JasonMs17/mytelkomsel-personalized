'use client'

import { useState } from 'react'
import styles from './UserSelector.module.css'

interface UserSelectorProps {
  onUserSelect: (userId: string) => void
}

export default function UserSelector({ onUserSelect }: UserSelectorProps) {
  const [selectedUser, setSelectedUser] = useState('U01')
  const [isLoading, setIsLoading] = useState(false)

  const userIds = ['U01', 'U02', 'U03', 'U04', 'U05']

  const handleUserChange = async (userId: string) => {
    setSelectedUser(userId)
    setIsLoading(true)
    
    try {
      // Call the recommend endpoint
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
      onUserSelect(data)
      console.log('Recommendations:', data)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.userSelector}>
      <label htmlFor="user-select" className={styles.label}>Pilih User ID:</label>
      <select
        id="user-select"
        value={selectedUser}
        onChange={(e) => handleUserChange(e.target.value)}
        disabled={isLoading}
        className={styles.select}
      >
        {userIds.map((userId) => (
          <option key={userId} value={userId}>
            {userId}
          </option>
        ))}
      </select>
      {isLoading && <span className={styles.loading}>Loading...</span>}
    </div>
  )
}
