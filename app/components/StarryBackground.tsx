"use client"

import React, { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  velocityX: number
  velocityY: number
  depth: number
}

interface MouseState {
  x: number
  y: number
  lastX: number
  lastY: number
  moveX: number
  moveY: number
  lastMoved: number
}

// Detect if the user is on a mobile device
const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// Particle configuration
const PARTICLE_CONFIG = {
  COUNT: 200,
  MIN_SIZE: 0.3,
  MAX_SIZE: 1.2,
  COLOR: "255, 248, 184",
  MIN_OPACITY: 0.4,
  MAX_OPACITY: 0.7,
  MOVEMENT_SPEED: 0.008,
  MOUSE_INFLUENCE: 0.008,
  RETURN_SPEED: 0.002,
  MOVEMENT_DECAY: 0.95,
  MOBILE_DRIFT_SPEED: 0.05, // How fast particles drift on mobile
  DRIFT_DECAY: 0.98, // Gradual slow down for drifting
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    moveX: 0,
    moveY: 0,
    lastMoved: 0,
  })
  const particlesRef = useRef<Particle[]>([])
  const isMobile = useRef(isMobileDevice())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        particlesRef.current.push({
          x,
          y,
          size: Math.random() * (PARTICLE_CONFIG.MAX_SIZE - PARTICLE_CONFIG.MIN_SIZE) + PARTICLE_CONFIG.MIN_SIZE,
          baseX: x,
          baseY: y,
          velocityX: isMobile.current ? (Math.random() - 0.5) * PARTICLE_CONFIG.MOBILE_DRIFT_SPEED : 0,
          velocityY: isMobile.current ? (Math.random() - 0.5) * PARTICLE_CONFIG.MOBILE_DRIFT_SPEED : 0,
          depth: Math.random() * 3 + 1,
        })
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const now = Date.now()
      const timeSinceLastMove = now - mouseRef.current.lastMoved
      const influenceStrength = isMobile.current ? 0 : Math.max(0, 1 - timeSinceLastMove / 2000) * PARTICLE_CONFIG.MOUSE_INFLUENCE

      particlesRef.current.forEach((particle) => {
        const depthFactor = particle.depth / 4

        if (!isMobile.current && influenceStrength > 0) {
          particle.velocityX += mouseRef.current.moveX * influenceStrength * depthFactor
          particle.velocityY += mouseRef.current.moveY * influenceStrength * depthFactor
        }

        // Make particles slowly drift on mobile
        if (isMobile.current) {
          particle.x += particle.velocityX * depthFactor
          particle.y += particle.velocityY * depthFactor
          particle.velocityX *= PARTICLE_CONFIG.DRIFT_DECAY
          particle.velocityY *= PARTICLE_CONFIG.DRIFT_DECAY
        }

        particle.x += particle.velocityX
        particle.y += particle.velocityY
        particle.velocityX *= PARTICLE_CONFIG.MOVEMENT_DECAY
        particle.velocityY *= PARTICLE_CONFIG.MOVEMENT_DECAY

        const returnSpeed = PARTICLE_CONFIG.RETURN_SPEED * (particle.depth / 4)
        particle.x += (particle.baseX - particle.x) * returnSpeed
        particle.y += (particle.baseY - particle.y) * returnSpeed

        const opacity =
          PARTICLE_CONFIG.MIN_OPACITY +
          (particle.depth - 1) * ((PARTICLE_CONFIG.MAX_OPACITY - PARTICLE_CONFIG.MIN_OPACITY) / 3)

        ctx.fillStyle = `rgba(${PARTICLE_CONFIG.COLOR}, ${opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * (particle.depth / 2), 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile.current) return // Ignore mouse movement on mobile

      const now = Date.now()
      const timeSinceLastMove = now - mouseRef.current.lastMoved

      if (timeSinceLastMove > 50) {
        mouseRef.current.moveX = (event.x - mouseRef.current.x) * PARTICLE_CONFIG.MOVEMENT_SPEED
        mouseRef.current.moveY = (event.y - mouseRef.current.y) * PARTICLE_CONFIG.MOVEMENT_SPEED
        mouseRef.current.lastX = mouseRef.current.x
        mouseRef.current.lastY = mouseRef.current.y
        mouseRef.current.x = event.x
        mouseRef.current.y = event.y
        mouseRef.current.lastMoved = now
      }
    }

    const handleResize = () => {
      setCanvasSize()
      initParticles()
    }

    initParticles()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0" />
}