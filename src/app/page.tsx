'use client'

import { useState, useEffect, useMemo } from 'react'
import UserList from '@/components/UserList'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import ThreeDElements from '@/components/3DElements'
import ThemeToggle from '@/components/ThemeToggle'

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const usersPerPage = 6

  // Cache users data in localStorage
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        
        // Check if we have cached data
        const cachedUsers = localStorage.getItem('cachedUsers')
        const cachedTimestamp = localStorage.getItem('cachedTimestamp')
        const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < 300000 // 5 minutes
        
        if (cachedUsers && isCacheValid) {
          setUsers(JSON.parse(cachedUsers))
          return
        }
        
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await response.json()
        setUsers(data)
        
        // Cache the data
        localStorage.setItem('cachedUsers', JSON.stringify(data))
        localStorage.setItem('cachedTimestamp', Date.now().toString())
      } catch (error) {
        console.error('Error fetching users:', error)
        
        // Fallback to cached data even if expired
        const cachedUsers = localStorage.getItem('cachedUsers')
        if (cachedUsers) {
          setUsers(JSON.parse(cachedUsers))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Memoize filtered users for better performance
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, users])

  // Get current users for pagination
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  }, [currentPage, filteredUsers, usersPerPage])

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gradient-to-br from-background to-muted/30 dark:from-gray-900 dark:to-gray-800/30">
      <ThreeDElements />
      
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10 pt-16">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            User Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore and manage users with this interactive dashboard featuring 3D elements and smooth animations.
          </p>
        </div>
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl shadow-lg overflow-hidden h-64">
                <div className="p-6 h-full flex flex-col justify-center">
                  <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <UserList users={currentUsers} />
            <Pagination
              usersPerPage={usersPerPage}
              totalUsers={filteredUsers.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        )}
      </div>
    </main>
  )
}