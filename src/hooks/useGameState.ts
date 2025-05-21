import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Type definitions for game state
export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  cookiesPerClick?: number
  cookiesPerSecond?: number
  icon: string
  owned: number
  maxOwned?: number
  unlockThreshold?: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  condition: (state: GameState) => boolean
}

export interface GameState {
  cookies: number
  totalCookies: number
  cookiesPerClick: number
  cookiesPerSecond: number
  upgrades: Upgrade[]
  achievements: Achievement[]
}

// Initial upgrades
const initialUpgrades: Upgrade[] = [
  {
    id: 'cursor',
    name: 'Better Cursor',
    description: 'Double your clicking power!',
    cost: 15,
    cookiesPerClick: 1,
    icon: 'MousePointerClick',
    owned: 0
  },
  {
    id: 'grandma',
    name: 'Grandma',
    description: 'A nice grandma to bake cookies for you.',
    cost: 100,
    cookiesPerSecond: 1,
    icon: 'UserRoundCog',
    owned: 0,
    unlockThreshold: 50
  },
  {
    id: 'farm',
    name: 'Cookie Farm',
    description: 'Grow cookie plants from cookie seeds.',
    cost: 500,
    cookiesPerSecond: 5,
    icon: 'Sprout',
    owned: 0,
    unlockThreshold: 200
  },
  {
    id: 'mine',
    name: 'Cookie Mine',
    description: 'Mine cookie ores from the depths of the earth.',
    cost: 2000,
    cookiesPerSecond: 20,
    icon: 'Pickaxe',
    owned: 0,
    unlockThreshold: 1000
  },
  {
    id: 'factory',
    name: 'Cookie Factory',
    description: 'Mass produce cookies with giant industrial ovens.',
    cost: 10000,
    cookiesPerSecond: 100,
    icon: 'Factory',
    owned: 0,
    unlockThreshold: 5000
  },
  {
    id: 'bank',
    name: 'Cookie Bank',
    description: 'Generate cookies from interest rates.',
    cost: 50000,
    cookiesPerSecond: 500,
    icon: 'Landmark',
    owned: 0,
    unlockThreshold: 25000
  }
]

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first-cookie',
    name: 'First Cookie',
    description: 'Click your first cookie',
    icon: 'Cookie',
    unlocked: false,
    condition: (state) => state.totalCookies >= 1
  },
  {
    id: 'cookie-amateur',
    name: 'Cookie Amateur',
    description: 'Bake 100 cookies in total',
    icon: 'Oven',
    unlocked: false,
    condition: (state) => state.totalCookies >= 100
  },
  {
    id: 'cookie-enthusiast',
    name: 'Cookie Enthusiast',
    description: 'Bake 1,000 cookies in total',
    icon: 'ChefHat',
    unlocked: false,
    condition: (state) => state.totalCookies >= 1000
  },
  {
    id: 'cookie-factory',
    name: 'Cookie Factory',
    description: 'Bake 10,000 cookies in total',
    icon: 'Factory',
    unlocked: false,
    condition: (state) => state.totalCookies >= 10000
  },
  {
    id: 'cookie-empire',
    name: 'Cookie Empire',
    description: 'Bake 100,000 cookies in total',
    icon: 'Building',
    unlocked: false,
    condition: (state) => state.totalCookies >= 100000
  },
  {
    id: 'first-grandma',
    name: 'Grandma\'s Helper',
    description: 'Hire your first grandma',
    icon: 'UserRoundCog',
    unlocked: false,
    condition: (state) => {
      const grandma = state.upgrades.find(u => u.id === 'grandma')
      return grandma?.owned >= 1
    }
  },
  {
    id: 'farm-acquired',
    name: 'Green Thumb',
    description: 'Buy your first cookie farm',
    icon: 'Sprout',
    unlocked: false,
    condition: (state) => {
      const farm = state.upgrades.find(u => u.id === 'farm')
      return farm?.owned >= 1
    }
  },
  {
    id: 'click-machine',
    name: 'Click Machine',
    description: 'Have 10 cookies per click',
    icon: 'MousePointerClick',
    unlocked: false,
    condition: (state) => state.cookiesPerClick >= 10
  }
]

// Default initial game state
const defaultInitialState: GameState = {
  cookies: 0,
  totalCookies: 0,
  cookiesPerClick: 1,
  cookiesPerSecond: 0,
  upgrades: initialUpgrades,
  achievements: initialAchievements
}

// Local storage key for saving game state
const STORAGE_KEY = 'cookie-clicker-game-state'

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    // Load saved game state from localStorage if available
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState) as GameState
        toast.success('Game loaded successfully!')
        return parsedState
      } catch (e) {
        console.error('Failed to parse saved game state:', e)
        return defaultInitialState
      }
    }
    return defaultInitialState
  })

  // Add cookies (from clicking or passive generation)
  const addCookies = useCallback((amount: number) => {
    setState(prevState => {
      const newCookies = prevState.cookies + amount
      const newTotalCookies = prevState.totalCookies + amount
      
      // Return the updated state
      return {
        ...prevState,
        cookies: newCookies,
        totalCookies: newTotalCookies
      }
    })
  }, [])

  // Buy an upgrade
  const buyUpgrade = useCallback((upgradeId: string) => {
    setState(prevState => {
      // Find the upgrade
      const upgradeIndex = prevState.upgrades.findIndex(u => u.id === upgradeId)
      if (upgradeIndex === -1) return prevState

      const upgrade = prevState.upgrades[upgradeIndex]
      
      // Check if we can buy it (have enough cookies)
      if (prevState.cookies < upgrade.cost) {
        toast.error("Not enough cookies!")
        return prevState
      }
      
      // Check if we hit the max owned limit
      if (upgrade.maxOwned && upgrade.owned >= upgrade.maxOwned) {
        toast.error("You already own the maximum amount!")
        return prevState
      }

      // Calculate the new cost for the next purchase (increases by 15% each time)
      const newCost = Math.ceil(upgrade.cost * 1.15)
      
      // Calculate new state values
      const newCookiesPerClick = prevState.cookiesPerClick + (upgrade.cookiesPerClick || 0)
      const newCookiesPerSecond = prevState.cookiesPerSecond + (upgrade.cookiesPerSecond || 0)
      
      // Create updated upgrade
      const updatedUpgrade = {
        ...upgrade,
        owned: upgrade.owned + 1,
        cost: newCost
      }
      
      // Create updated upgrades array
      const updatedUpgrades = [...prevState.upgrades]
      updatedUpgrades[upgradeIndex] = updatedUpgrade
      
      toast.success(`Purchased ${upgrade.name}!`)
      
      // Return updated state
      return {
        ...prevState,
        cookies: prevState.cookies - upgrade.cost,
        cookiesPerClick: newCookiesPerClick,
        cookiesPerSecond: newCookiesPerSecond,
        upgrades: updatedUpgrades
      }
    })
  }, [])

  // Save game to localStorage
  const saveGame = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      toast.success('Game saved successfully!')
    } catch (e) {
      console.error('Failed to save game:', e)
      toast.error('Failed to save game')
    }
  }, [state])

  // Reset game state
  const resetGame = useCallback(() => {
    if (window.confirm('Are you sure you want to reset your game? All progress will be lost!')) {
      setState(defaultInitialState)
      localStorage.removeItem(STORAGE_KEY)
      toast.success('Game reset successfully!')
    }
  }, [])

  // Check for achievements
  useEffect(() => {
    const checkAchievements = () => {
      let achievementUnlocked = false
      
      const updatedAchievements = state.achievements.map(achievement => {
        // Skip already unlocked achievements
        if (achievement.unlocked) return achievement
        
        // Check if condition is met
        if (achievement.condition(state)) {
          achievementUnlocked = true
          return { ...achievement, unlocked: true }
        }
        
        return achievement
      })
      
      if (achievementUnlocked) {
        setState(prevState => ({
          ...prevState,
          achievements: updatedAchievements
        }))
        
        toast.success('Achievement unlocked!', {
          description: 'Check the achievements panel'
        })
      }
    }
    
    checkAchievements()
  }, [state])

  // Filter upgrades to show only unlocked ones
  const visibleUpgrades = state.upgrades.filter(
    upgrade => !upgrade.unlockThreshold || state.totalCookies >= upgrade.unlockThreshold
  )

  return {
    cookies: state.cookies,
    cookiesPerClick: state.cookiesPerClick,
    cookiesPerSecond: state.cookiesPerSecond,
    upgrades: visibleUpgrades,
    achievements: state.achievements,
    addCookies,
    buyUpgrade,
    saveGame,
    resetGame
  }
}