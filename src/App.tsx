import { useEffect, useState } from 'react'
import { Cookie, Utensils } from 'lucide-react'
import { Toaster } from 'sonner'
import { useGameState } from './hooks/useGameState'
import { cn } from './lib/utils'
import { GameStats } from './components/GameStats'
import { UpgradeShop } from './components/UpgradeShop'
import { AchievementPanel } from './components/AchievementPanel'

function App() {
  const { 
    cookies, 
    cookiesPerSecond, 
    cookiesPerClick,
    upgrades,
    achievements,
    addCookies,
    buyUpgrade,
    saveGame,
    resetGame
  } = useGameState()

  const [cookieSize, setCookieSize] = useState(16)
  const [cookieRotation, setCookieRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle the cookie click with animation
  const handleCookieClick = () => {
    // Add cookies based on current cookiesPerClick rate
    addCookies(cookiesPerClick)
    
    // Animate the cookie
    setIsAnimating(true)
    setCookieSize(prev => Math.min(prev + 2, 24))
    setCookieRotation(prev => prev + 5)
    
    setTimeout(() => {
      setIsAnimating(false)
      setCookieSize(16)
    }, 150)
  }

  // Auto-save game every 10 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame()
    }, 10000)
    
    return () => clearInterval(saveInterval)
  }, [saveGame])

  // Auto-generate cookies based on cookiesPerSecond
  useEffect(() => {
    if (cookiesPerSecond <= 0) return
    
    const interval = setInterval(() => {
      addCookies(cookiesPerSecond / 10)
    }, 100) // Update 10 times per second for smoother animation
    
    return () => clearInterval(interval)
  }, [cookiesPerSecond, addCookies])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-300 mb-2">
            <Utensils className="inline-block mr-2" /> Cookie Clicker <Utensils className="inline-block ml-2" />
          </h1>
          <p className="text-amber-700 dark:text-amber-400">Click the cookie to earn more cookies!</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main game area */}
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center">
            <GameStats 
              cookies={cookies} 
              cookiesPerSecond={cookiesPerSecond} 
              cookiesPerClick={cookiesPerClick} 
            />
            
            <div className="mt-8 mb-12 flex justify-center">
              <button
                onClick={handleCookieClick}
                className={cn(
                  "transition-all transform hover:scale-105 focus:outline-none",
                  isAnimating ? "animate-bounce" : ""
                )}
                aria-label="Click to earn cookies"
              >
                <Cookie 
                  size={cookieSize * 10} 
                  className="text-amber-600 dark:text-amber-400"
                  style={{ 
                    transform: `rotate(${cookieRotation}deg)`,
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))"
                  }}
                />
              </button>
            </div>
            
            <div className="w-full mt-8">
              <AchievementPanel achievements={achievements} />
            </div>
          </div>
          
          {/* Upgrade shop */}
          <div className="col-span-1">
            <UpgradeShop 
              cookies={cookies} 
              upgrades={upgrades} 
              onBuyUpgrade={buyUpgrade} 
            />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-amber-700 dark:text-amber-400">
          <button 
            onClick={saveGame}
            className="mx-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
          >
            Save Game
          </button>
          <button 
            onClick={resetGame}
            className="mx-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Reset Game
          </button>
          <p className="mt-4 text-sm">Made with 🍪</p>
        </footer>
      </div>
      <Toaster />
    </div>
  )
}

export default App