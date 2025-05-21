import { Cookie, MousePointerClick, Timer } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'

interface GameStatsProps {
  cookies: number
  cookiesPerClick: number
  cookiesPerSecond: number
}

// Format large numbers with commas
const formatNumber = (num: number) => {
  return num < 1 ? num.toFixed(1) : Math.floor(num).toLocaleString()
}

export function GameStats({ cookies, cookiesPerClick, cookiesPerSecond }: GameStatsProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Cookies"
        value={formatNumber(cookies)}
        icon={<Cookie className="text-amber-600" />}
        highlight
      />
      <StatCard
        title="Per Click"
        value={formatNumber(cookiesPerClick)}
        icon={<MousePointerClick className="text-blue-600" />}
      />
      <StatCard
        title="Per Second"
        value={formatNumber(cookiesPerSecond)}
        icon={<Timer className="text-green-600" />}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}

function StatCard({ title, value, icon, highlight }: StatCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      highlight ? "border-amber-500 dark:border-amber-400" : ""
    )}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          <p className={cn(
            "text-2xl font-bold",
            highlight ? "text-amber-700 dark:text-amber-400" : "text-foreground"
          )}>
            {value}
          </p>
        </div>
        <div className="text-2xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}