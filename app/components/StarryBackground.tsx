"use client"

import React, { useEffect, useRef, useState } from "react"

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
  moveX: number
  moveY: number
  lastMoved: number
}

// Particle configuration (Same for both desktop and mobile)
const PARTICLE_CONFIG = {
  COUNT: 200,
  MIN_SIZE: 0.3,
  MAX_SIZE: 1.2,
  COLOR: "255, 248, 184",
  MIN_OPACITY: 0.4,
  MAX_OPACITY: 0.7,
  MOVEMENT_SPEED: 0.008, // Speed multiplier
  MOUSE_INFLUENCE: 0.008, // Only applied on desktop
  RETURN_SPEED: 0.002, // Slow return to original position
  MOVEMENT_DECAY: 0.98, // Higher value = slower stopping over time
  MOBILE_TILT_STRENGTH: 0.005, // Strength of tilt movement
  TILT_DECAY: 0.98, // How gradually tilt movement slows
}

export default function StarryBackground() {
  const [isMobile, setIsMobile] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<MouseState>({
    moveX: 0,
    moveY: 0,
    lastMoved: 0,
  })
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768) // Detect mobile devices

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
          velocityX: 0,
          velocityY: 0,
          depth: Math.random() * 3 + 1,
        })
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const now = Date.now()
      const timeSinceLastMove = now - mouseRef.current.lastMoved
      const influenceStrength = isMobile
        ? PARTICLE_CONFIG.MOBILE_TILT_STRENGTH // Use tilt on mobile
        : Math.max(0, 1 - timeSinceLastMove / 2000) * PARTICLE_CONFIG.MOUSE_INFLUENCE

      particlesRef.current.forEach((particle) => {
        const depthFactor = particle.depth / 4

        // Apply tilt influence on mobile
        if (isMobile) {
          particle.velocityX += mouseRef.current.moveX * influenceStrength * depthFactor
          particle.velocityY += mouseRef.current.moveY * influenceStrength * depthFactor
        }

        // Particles continue moving in last tilt direction, gradually slowing down
        particle.velocityX *= PARTICLE_CONFIG.TILT_DECAY
        particle.velocityY *= PARTICLE_CONFIG.TILT_DECAY

        // Apply movement
        particle.x += particle.velocityX
        particle.y += particle.velocityY

        // Gradual return to original position
        const returnSpeed = PARTICLE_CONFIG.RETURN_SPEED * depthFactor
        particle.x += (particle.baseX - particle.x) * returnSpeed
        particle.y += (particle.baseY - particle.y) * returnSpeed

        // Calculate opacity based on depth
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

    // Desktop Mouse Movement (Disabled on Mobile)
    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile) return // Ignore mouse on mobile

      const now = Date.now()
      const timeSinceLastMove = now - mouseRef.current.lastMoved

      if (timeSinceLastMove > 50) {
        mouseRef.current.moveX = (event.x - canvas.width / 2) * PARTICLE_CONFIG.MOVEMENT_SPEED
        mouseRef.current.moveY = (event.y - canvas.height / 2) * PARTICLE_CONFIG.MOVEMENT_SPEED
        mouseRef.current.lastMoved = now
      }
    }

    // Handle Mobile Tilt Input
    const handleDeviceTilt = (event: DeviceOrientationEvent) => {
      if (!isMobile) return

      const { gamma, beta } = event // gamma: left-right tilt, beta: forward-back tilt
      if (gamma && beta) {
        mouseRef.current.moveX = gamma * PARTICLE_CONFIG.MOBILE_TILT_STRENGTH
        mouseRef.current.moveY = beta * PARTICLE_CONFIG.MOBILE_TILT_STRENGTH
        mouseRef.current.lastMoved = Date.now()
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
    window.addEventListener("deviceorientation", handleDeviceTilt)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("deviceorientation", handleDeviceTilt)
    }
  }, [isMobile])

  return <canvas ref={canvasRef} className="fixed inset-0" />
}