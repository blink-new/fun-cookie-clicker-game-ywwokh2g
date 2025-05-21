import * as Icons from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Achievement } from '../hooks/useGameState'
import { cn } from '../lib/utils'

interface AchievementPanelProps {
  achievements: Achievement[]
}

export function AchievementPanel({ achievements }: AchievementPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Icons.Trophy className="h-5 w-5" />
          Achievements ({unlockedCount}/{totalCount})
        </CardTitle>
        <CardDescription>Unlock special achievements as you play</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => (
            <AchievementItem key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface AchievementItemProps {
  achievement: Achievement
}

function AchievementItem({ achievement }: AchievementItemProps) {
  // Dynamically get the icon from lucide-react
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon] || Icons.Award
  
  return (
    <div 
      className={cn(
        "flex flex-col items-center p-3 rounded-lg border transition-all",
        achievement.unlocked 
          ? "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700" 
          : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
      )}
    >
      <div className={cn(
        "rounded-full p-3 mb-2",
        achievement.unlocked 
          ? "bg-amber-200 dark:bg-amber-800" 
          : "bg-gray-200 dark:bg-gray-700"
      )}>
        <IconComponent className={cn(
          "h-5 w-5",
          achievement.unlocked 
            ? "text-amber-700 dark:text-amber-400" 
            : "text-gray-500 dark:text-gray-400"
        )} />
      </div>
      <h3 className="text-sm font-medium text-center">
        {achievement.unlocked ? achievement.name : '???'}
      </h3>
      <p className="text-xs text-center text-muted-foreground mt-1">
        {achievement.unlocked ? achievement.description : 'Keep playing to unlock'}
      </p>
    </div>
  )
}