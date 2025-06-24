// src/components/ui/Avatar.tsx
'use client'
import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Enhanced Avatar component with additional features
interface EnhancedAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  showStatus?: boolean
  clickable?: boolean
  onClick?: () => void
}

const EnhancedAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  EnhancedAvatarProps
>(({ 
  src, 
  alt, 
  fallback, 
  status, 
  showStatus, 
  clickable, 
  onClick, 
  className, 
  size,
  ...props 
}, ref) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      case 'offline':
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusSize = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'h-2 w-2'
      case 'lg':
        return 'h-3 w-3'
      case 'xl':
        return 'h-4 w-4'
      case '2xl':
        return 'h-5 w-5'
      default:
        return 'h-2.5 w-2.5'
    }
  }

  return (
    <div className="relative inline-block">
      <Avatar
        ref={ref}
        size={size}
        className={cn(
          clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      
      {showStatus && status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            getStatusColor(status),
            getStatusSize(size ?? undefined)
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
})
EnhancedAvatar.displayName = 'EnhancedAvatar'

export { Avatar, AvatarImage, AvatarFallback, EnhancedAvatar }