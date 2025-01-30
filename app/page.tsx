import StarryBackground from "./components/StarryBackground"
import WaitlistForm from "./components/WaitlistForm"
import Logo from "./components/Logo"
import { Inter } from "next/font/google"
import PongGame from "./components/PongGame"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <main className={`relative min-h-screen bg-black text-white ${inter.className}`}>
      <StarryBackground />

      <div className="relative z-10 mx-auto flex min-h-screen px-4 max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] flex-col items-center justify-center pt-[10vh] pb-[15vh]">
        <div className="flex w-full flex-col items-center space-y-[2.5rem]">
          {/* 
            Coming Soon Badge
            - animate-glow-infinite: Custom animation class (see globals.css)
            - shadow-glow: Custom shadow class (see tailwind.config.js)
            Adjust glow intensity and timing in globals.css
          */}
          <div className="relative overflow-hidden rounded-full bg-neutral-800/50 px-4 py-1.5 backdrop-blur-sm shadow-glow animate-glow-infinite">
            <span className="relative z-10 text-base text-yellow-100">Coming soon!</span>
            <div className="shine-effect"></div>
          </div>

          <div className="mb-[1rem]">
            <Logo className="h-[3.5rem] w-[3.5rem] sm:h-[4rem] sm:w-[4rem] text-yellow-100" />
          </div>

          {/* 
            Heading with reduced font weight
            font-light: Makes the text thinner and more sleek
          */}
          <h1 className="max-w-[40rem] text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-light leading-tight">
            JmK
          </h1>

          <p className="max-w-[30rem] text-center text-base text-neutral-300 sm:text-lg">
            To Jacques: Yo Shlobro! Here's a lil placeholder website, ya lil eager beaver 🖕🏼 
          </p>

          <div className="w-full max-w-[24rem] mb-20">
            <WaitlistForm />
          </div>
              {/* Pong Game Container
              <div className="w-full flex justify-center mt-10">
            <PongGame title = "A little something to keep you busy while you wait (doesn't work on mobile)" />
          </div> */}
        </div>
      </div>
    </main>
  )
}

