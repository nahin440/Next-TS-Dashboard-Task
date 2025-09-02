'use client'

import { useEffect, useRef, useState } from 'react'

const ThreeDElements = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleReduceMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleReduceMotionChange)
    
    if (reducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      // Use requestAnimationFrame for smoother performance
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const elements = containerRef.current!.querySelectorAll('.floating-element')
        const mouseX = e.clientX / window.innerWidth - 0.5
        const mouseY = e.clientY / window.innerHeight - 0.5
        
        elements.forEach((element, index) => {
          // Calculate offset based on element position for individual movement
          const rect = element.getBoundingClientRect()
          const elementX = rect.left + rect.width / 2
          const elementY = rect.top + rect.height / 2
          
          const distanceX = (e.clientX - elementX) / window.innerWidth
          const distanceY = (e.clientY - elementY) / window.innerHeight
          
          // Reduced calculations for better performance
          const rotateY = distanceX * 5
          const rotateX = -distanceY * 5
          const translateX = distanceX * 15
          const translateY = distanceY * 15
          
          // Apply the transformation
          ;(element as HTMLElement).style.transform = `
            perspective(1000px) 
            rotateY(${rotateY}deg) 
            rotateX(${rotateX}deg)
            translate3d(${translateX}px, ${translateY}px, 0)
          `
        })
      })
    }

    // Throttle the mousemove event
    let throttleTimeout: NodeJS.Timeout
    const throttledMouseMove = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          handleMouseMove(e)
          throttleTimeout = null as any
        }, 50) // Run at most every 50ms
      }
    }

    window.addEventListener('mousemove', throttledMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove)
      mediaQuery.removeEventListener('change', handleReduceMotionChange)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout)
      }
    }
  }, [reducedMotion])

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Simplified 3D elements with fewer elements */}
      <div className="floating-element absolute top-1/4 left-1/4 w-16 h-16 bg-blue-400/10 rounded-lg"></div>
      <div className="floating-element absolute top-1/3 right-1/4 w-12 h-12 bg-cyan-400/10 rounded-lg"></div>
      <div className="floating-element absolute bottom-1/4 left-1/3 w-20 h-20 bg-blue-500/5 rounded-lg"></div>
      
      {/* Static gradient backgrounds (no animation) */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/5 to-transparent opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/5 to-transparent opacity-20"></div>
      
      {/* Static gradient orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-cyan-400/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-500/5 rounded-full blur-xl"></div>
    </div>
  )
}

export default ThreeDElements