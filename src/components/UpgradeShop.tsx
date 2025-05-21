import * as Icons from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Upgrade } from '../hooks/useGameState'
import { cn } from '../lib/utils'

interface UpgradeShopProps {
  cookies: number
  upgrades: Upgrade[]
  onBuyUpgrade: (id: string) => void
}

// Format large numbers with commas
const formatNumber = (num: number) => {
  return Math.floor(num).toLocaleString()
}

export function UpgradeShop({ cookies, upgrades, onBuyUpgrade }: UpgradeShopProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-700 dark:text-amber-400">
          Cookie Shop
        </CardTitle>
        <CardDescription>Buy upgrades to boost your cookie production</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          <div className="space-y-4">
            {upgrades.map((upgrade) => (
              <UpgradeItem
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={cookies >= upgrade.cost}
                onBuy={() => onBuyUpgrade(upgrade.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface UpgradeItemProps {
  upgrade: Upgrade
  canAfford: boolean
  onBuy: () => void
}

function UpgradeItem({ upgrade, canAfford, onBuy }: UpgradeItemProps) {
  // Dynamically get the icon from lucide-react
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[upgrade.icon] || Icons.Cookie

  return (
    <Card className={cn(
      "transition-all",
      canAfford ? "border-green-400 dark:border-green-700" : "opacity-80"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-amber-100 dark:bg-amber-900">
              <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium">{upgrade.name}</h3>
              <p className="text-xs text-muted-foreground">{upgrade.owned} owned</p>
            </div>
          </div>
          <div className="text-right">
            <span className={cn(
              "text-sm font-bold flex items-center",
              canAfford ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              <Icons.Cookie className="h-3 w-3 mr-1" />
              {formatNumber(upgrade.cost)}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">{upgrade.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs">
            {upgrade.cookiesPerClick ? (
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <Icons.MousePointerClick className="h-3 w-3 mr-1" />
                +{upgrade.cookiesPerClick} per click
              </span>
            ) : null}
            
            {upgrade.cookiesPerSecond ? (
              <span className="flex items-center text-green-600 dark:text-green-400">
                <Icons.Timer className="h-3 w-3 mr-1" />
                +{upgrade.cookiesPerSecond} per second
              </span>
            ) : null}
          </div>
          
          <Button
            size="sm"
            onClick={onBuy}
            disabled={!canAfford}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}