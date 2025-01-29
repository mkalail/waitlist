"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // TODO: Implement your email collection logic here
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 
        Form Field Styling Guide:
        - text-[size]: Adjust text size
        - font-[weight]: Adjust text weight
        - border-[color]: Adjust border color
        - px-[size] py-[size]: Adjust padding
      */}
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email Address"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3.5 text-[0.95rem] text-yellow-200 placeholder-neutral-400 shadow-lg backdrop-blur-sm transition-colors focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600"
        />
      </div>

      {/* 
        Button Styling Guide:
        - text-[size]: Adjust text size
        - font-[weight]: Adjust text weight
        - border-[color]: Adjust border color
        - group: Required for hover effects
        - hover:translate-x-[size]: Adjust arrow movement distance
      */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3.5 text-[0.95rem] font-normal text-yellow-100 shadow-lg backdrop-blur-sm transition-all hover:bg-neutral-800/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center justify-center">
          Join Waitlist!
          <ArrowRight className="ml-2 h-4 w-4 transform opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </span>
      </button>
    </form>
  )
}

