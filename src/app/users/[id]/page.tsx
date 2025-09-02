'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const detailCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const id = params?.id
        if (!id) return
        
        // Check cache first
        const cachedUser = localStorage.getItem(`user-${id}`)
        const cachedTimestamp = localStorage.getItem(`user-${id}-timestamp`)
        const isCacheValid = cachedTimestamp && (Date.now() - parseInt(cachedTimestamp)) < 300000
        
        if (cachedUser && isCacheValid) {
          setUser(JSON.parse(cachedUser))
          setLoading(false)
          return
        }
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        if (!response.ok) throw new Error('User not found')
        
        const data = await response.json()
        setUser(data)
        
        // Cache the user data
        localStorage.setItem(`user-${id}`, JSON.stringify(data))
        localStorage.setItem(`user-${id}-timestamp`, Date.now().toString())
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!detailCardRef.current) return
    
    const card = detailCardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateY = (x - centerX) / 50
    const rotateX = (centerY - y) / 50
    
    card.style.transform = `
      perspective(1000px) 
      rotateY(${rotateY}deg) 
      rotateX(${rotateX}deg)
    `
    
    // Parallax effect for background elements
    const bgElements = card.querySelectorAll('.parallax-bg')
    bgElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed') || '0.05')
      const xMove = (x - centerX) * speed
      const yMove = (y - centerY) * speed
      ;(el as HTMLElement).style.transform = `translate(${xMove}px, ${yMove}px)`
    })
  }

  const handleMouseLeave = () => {
    if (detailCardRef.current) {
      detailCardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center p-8 bg-card border border-border rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">User not found</h2>
          <Link href="/" className="text-primary hover:underline inline-flex items-center group">
            <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background to-muted/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto relative">
        <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8 group backdrop-blur-sm bg-card/50 rounded-lg p-3 border border-border/50 transition-all duration-300 hover:bg-card/80">
          <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Link>

        <div 
          ref={detailCardRef}
          className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out transform-gpu"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Decorative background elements with parallax */}
          <div className="parallax-bg absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl" data-speed="0.03"></div>
          <div className="parallax-bg absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-xl" data-speed="0.05"></div>
          
          <div className="p-6 md:p-10 relative">
            {/* Header section */}
            <div className="flex flex-col md:flex-row items-start md:items-center mb-10 gap-6">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-bold text-4xl shadow-2xl relative overflow-hidden">
                  {user.name.charAt(0)}
                  {/* Shine effect on avatar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
                </div>
                {/* Online status indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-card shadow-md"></div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-card-foreground mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <p className="text-muted-foreground text-lg">@{user.username}</p>
                
                {/* Social metrics */}
                <div className="flex gap-6 mt-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300 cursor-pointer">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300 cursor-pointer">
                    <div className="text-2xl font-bold text-primary">156</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-300 cursor-pointer">
                    <div className="text-2xl font-bold text-primary">87</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-muted/20 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:bg-muted/30">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center group-hover:text-primary transition-colors duration-300">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground flex items-center transition-colors duration-300 hover:text-card-foreground">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </p>
                  <p className="text-muted-foreground flex items-center transition-colors duration-300 hover:text-card-foreground">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {user.phone}
                  </p>
                  <p className="text-muted-foreground flex items-center transition-colors duration-300 hover:text-card-foreground">
                    <svg className="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {user.website}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-muted/20 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:bg-muted/30">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center group-hover:text-primary transition-colors duration-300">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address
                </h3>
                <p className="text-muted-foreground transition-colors duration-300 hover:text-card-foreground">
                  {user.address.street}, {user.address.suite}<br />
                  {user.address.city}, {user.address.zipcode}
                </p>
                
                {/* Mini map placeholder */}
                <div className="mt-4 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-border/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* Company */}
              <div className="bg-muted/20 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:bg-muted/30">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center group-hover:text-primary transition-colors duration-300">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9m4 0v12m4 0h2m0 0h-4m4 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
                  </svg>
                  Company
                </h3>
                <p className="text-card-foreground font-medium text-lg mb-2">{user.company.name}</p>
                <p className="text-muted-foreground italic mb-3 transition-colors duration-300 hover:text-card-foreground">{user.company.catchPhrase}</p>
                <p className="text-muted-foreground text-sm transition-colors duration-300 hover:text-card-foreground">{user.company.bs}</p>
                
                {/* Company badge */}
                <div className="mt-4 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  Partner Company
                </div>
              </div>

              {/* Geo Location */}
              <div className="bg-muted/20 p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:bg-muted/30">
                <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center group-hover:text-primary transition-colors duration-300">
                  <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Geo Location
                </h3>
                <p className="text-muted-foreground mb-4 transition-colors duration-300 hover:text-card-foreground">
                  Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
                </p>
                
                {/* Coordinates visualization */}
                <div className="bg-muted/40 p-4 rounded-lg border border-border/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Latitude</span>
                    <span className="text-sm font-medium text-primary">{user.address.geo.lat}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-full rounded-full" 
                      style={{ width: `${(parseFloat(user.address.geo.lat) + 90) / 180 * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 mb-2">
                    <span className="text-sm text-muted-foreground">Longitude</span>
                    <span className="text-sm font-medium text-primary">{user.address.geo.lng}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-accent to-primary h-full rounded-full" 
                      style={{ width: `${(parseFloat(user.address.geo.lng) + 180) / 360 * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 hover:bg-primary/90 flex items-center shadow-md hover:shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Send Message
              </button>
              
              <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-300 hover:bg-accent/90 flex items-center shadow-md hover:shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Connect
              </button>
              
              <button className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium transition-all duration-300 hover:bg-muted/80 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                More Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}