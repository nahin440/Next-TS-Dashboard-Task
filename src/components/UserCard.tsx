'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

interface UserCardProps {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateY = (x - centerX) / 25
    const rotateX = (centerY - y) / 25
    
    card.style.transform = `
      perspective(1000px) 
      rotateY(${rotateY}deg) 
      rotateX(${rotateX}deg)
      scale3d(1.02, 1.02, 1.02)
    `
    
    // Parallax effect for the gradient
    const gradient = card.querySelector('.card-gradient') as HTMLElement
    if (gradient) {
      gradient.style.backgroundPosition = `${x / 5}% ${y / 5}%`
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)'
    }
    setIsHovered(false)
  }

  return (
    <div 
      ref={cardRef}
      className="bg-card border border-border rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-out hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="p-6 relative overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="card-gradient absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 100%)`,
            backgroundSize: '200% 200%'
          }}
        ></div>
        
        {/* Shine effect */}
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${
          isHovered ? 'translate-x-full opacity-100' : '-translate-x-full opacity-0'
        }`}></div>
        
        <div className="flex items-center mb-4 relative z-10">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {user.name.charAt(0)}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-card-foreground transition-all duration-300 group-hover:text-primary">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate max-w-[160px] transition-all duration-300 group-hover:text-accent">
              {user.email}
            </p>
          </div>
        </div>
        
        <div className="mt-4 relative z-10">
          <p className="text-sm text-muted-foreground flex items-center mb-2 transition-all duration-300 hover:text-card-foreground">
            <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {user.phone}
          </p>
          <p className="text-sm text-muted-foreground flex items-center transition-all duration-300 hover:text-card-foreground">
            <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {user.website}
          </p>
        </div>
        
        <div className="mt-6 relative z-10">
          <Link href={`/users/${user.id}`} className="block w-full group/btn">
            <button className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium transition-all duration-500 overflow-hidden relative hover:shadow-lg">
              {/* Button shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></span>
              
              {/* Button text with transition */}
              <span className="relative flex items-center justify-center">
                View Details
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserCard