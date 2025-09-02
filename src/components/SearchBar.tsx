'use client'

import { useState } from 'react'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="mb-8">
      <div className="relative max-w-md mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 transition-opacity duration-300 ${isFocused ? 'opacity-50' : ''}`}></div>
        <div className="relative flex items-center">
          <div className="absolute left-3 text-muted-foreground">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-border bg-card rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent relative z-10"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchBar