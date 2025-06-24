// src/components/ui/Badge.tsx
'use client'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-500 text-white shadow hover:bg-green-500/80',
        warning: 'border-transparent bg-yellow-500 text-white shadow hover:bg-yellow-500/80',
        info: 'border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80'
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dismissible?: boolean
  onDismiss?: () => void
}

function Badge({ className, variant, size, dismissible, onDismiss, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Remove badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// Score Badge Component for Assessment Results
interface ScoreBadgeProps extends Omit<BadgeProps, 'variant'> {
  score: number
  maxScore?: number
  showPercentage?: boolean
}

function ScoreBadge({ score, maxScore = 100, showPercentage = true, className, ...props }: ScoreBadgeProps) {
  const percentage = (score / maxScore) * 100
  
  const getVariant = (percentage: number): BadgeProps['variant'] => {
    if (percentage >= 80) return 'success'
    if (percentage >= 60) return 'default'
    if (percentage >= 40) return 'warning'
    return 'destructive'
  }

  const displayValue = showPercentage 
    ? `${Math.round(percentage)}%`
    : `${score}/${maxScore}`

  return (
    <Badge 
      variant={getVariant(percentage)} 
      className={className} 
      {...props}
    >
      {displayValue}
    </Badge>
  )
}

// Status Badge Component
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'in_progress'
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const getVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'success'
      case 'inactive':
      case 'failed':
        return 'destructive'
      case 'pending':
      case 'in_progress':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getLabel = (status: string): string => {
    switch (status) {
      case 'in_progress':
        return 'In Progress'
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <Badge 
      variant={getVariant(status)} 
      className={className} 
      {...props}
    >
      {getLabel(status)}
    </Badge>
  )
}

export { Badge, badgeVariants, ScoreBadge, StatusBadge }