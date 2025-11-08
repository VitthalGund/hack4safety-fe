import type React from "react"
import { ArrowUp, ArrowDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number // percentage change
  description?: string
  icon?: React.ReactNode
}

export const KPICard = ({ title, value, unit, trend, description, icon }: KPICardProps) => {
  const isPositive = trend && trend > 0

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
          </div>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {isPositive ? (
            <ArrowUp size={16} className="text-green-500" />
          ) : (
            <ArrowDown size={16} className="text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {Math.abs(trend)}% {isPositive ? "increase" : "decrease"}
          </span>
        </div>
      )}

      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </div>
  )
}
