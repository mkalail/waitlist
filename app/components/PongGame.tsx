"use client"

import React, { useEffect, useRef, useState } from "react"

const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 60
const BALL_SIZE = 10
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300
const BALL_SPEED_X = 3
const BALL_SPEED_Y = 3

interface PongGameProps {
  title?: string
}

const PongGame: React.FC<PongGameProps> = ({ title = "Mini Pong Game 🎾" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const playerPaddleY = useRef(150)
  const aiPaddleY = useRef(150)
  const ball = useRef({ x: 200, y: 150, vx: BALL_SPEED_X, vy: BALL_SPEED_Y })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const sparks = useRef<{ x: number; y: number; alpha: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    // Load high score from localStorage, default to 0 if none exists
    const storedHighScore = localStorage.getItem("pongHighScore")
    setHighScore(storedHighScore ? parseInt(storedHighScore, 10) : 0)

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleY = canvas.height / rect.height
      playerPaddleY.current = (event.clientY - rect.top) * scaleY - PADDLE_HEIGHT / 2
    }

    window.addEventListener("mousemove", handleMouseMove)

    const resetGame = () => {
      setScore(0) // Reset score immediately
      setGameOver(false)
      setWin(false)
      setGameStarted(false)
      ball.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, vx: BALL_SPEED_X, vy: BALL_SPEED_Y }
      aiPaddleY.current = 150
      sparks.current = []
    }

    const gameLoop = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw score & high score
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.fillText(`Score: ${score}`, 10, 20)
      ctx.fillText(`High Score: ${highScore}`, 10, 40)

      if (!gameStarted) {
        ctx.fillStyle = "white"
        ctx.font = "18px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Click to Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        return
      }

      if (gameOver) {
        ctx.fillStyle = win ? "yellow" : "red"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText(win ? "🔥 YOU WIN! 🔥" : "🖕 LOSER 🖕", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)

        ctx.fillStyle = "white"
        ctx.fillRect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT / 2, 100, 30)
        ctx.fillStyle = "black"
        ctx.font = "16px Arial"
        ctx.fillText("Play Again", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20)

        canvas.addEventListener("click", resetGame, { once: true })
        return
      }

      // Ball movement (now at a fixed speed)
      ball.current.x += ball.current.vx
      ball.current.y += ball.current.vy

      // Create spark trail effect
      sparks.current.push({ x: ball.current.x, y: ball.current.y, alpha: 1 })
      if (sparks.current.length > 10) sparks.current.shift()

      // Ball collision with top and bottom
      if (ball.current.y <= 0 || ball.current.y >= CANVAS_HEIGHT - BALL_SIZE) {
        ball.current.vy *= -1
      }

      // Ball collision with player paddle
      if (
        ball.current.x <= PADDLE_WIDTH &&
        ball.current.y >= playerPaddleY.current &&
        ball.current.y <= playerPaddleY.current + PADDLE_HEIGHT
      ) {
        ball.current.vx *= -1 // Reverse direction
        setScore((prevScore) => {
          const newScore = prevScore + 1

          // Update high score if necessary
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem("pongHighScore", newScore.toString())
          }

          return newScore
        })
      }

      // Ball collision with AI paddle (Reverted AI Behavior)
      if (
        ball.current.x >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        ball.current.y >= aiPaddleY.current &&
        ball.current.y <= aiPaddleY.current + PADDLE_HEIGHT
      ) {
        ball.current.vx *= -1
      }

      // AI paddle movement (Reverted to original)
      const targetY = ball.current.y - PADDLE_HEIGHT / 2
      if (Math.abs(aiPaddleY.current - targetY) > 3) {
        if (aiPaddleY.current < targetY) {
          aiPaddleY.current += 2.5
        } else {
          aiPaddleY.current -= 2.5
        }
      }

      // Check for loss condition
      if (ball.current.x < 0) {
        setGameOver(true)
        return
      }

      // Check for win condition
      if (ball.current.x > CANVAS_WIDTH) {
        setWin(true)
        setGameOver(true)
        return
      }

      // Draw paddles, ball, and spark trail
      ctx.fillStyle = "white"
      ctx.fillRect(0, playerPaddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT)
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, aiPaddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT)

      sparks.current.forEach((s) => {
        ctx.fillStyle = `rgba(255, 150, 0, ${s.alpha})`
        ctx.fillRect(s.x, s.y, BALL_SIZE / 2, BALL_SIZE / 2)
        s.alpha -= 0.05
      })

      ctx.fillStyle = "cyan"
      ctx.fillRect(ball.current.x, ball.current.y, BALL_SIZE, BALL_SIZE)

      requestAnimationFrame(gameLoop)
    }

    canvas.addEventListener("click", () => setGameStarted(true), { once: true })
    gameLoop()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [gameOver, gameStarted, score])

  return (
    <div className="mt-10 flex flex-col items-center">
      <h2 className="text-lg text-yellow-100 text-center mb-2">{title}</h2>
      <canvas ref={canvasRef} className="border border-neutral-700 rounded-lg" />
    </div>
  )
}

export default PongGame