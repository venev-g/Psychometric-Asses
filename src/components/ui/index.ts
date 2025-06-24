// Export all UI components from a central index file
// This allows for clean imports like: import { Button, Card, Input } from '@/components/ui'

export { Button, buttonVariants } from './Button'
export type { ButtonProps } from './Button'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card'

export { Input, PasswordInput } from './Input'
export type { InputProps } from './Input'

export { Badge, ScoreBadge } from './Badge'
export type { BadgeProps } from './Badge'

export { Progress } from './Progress'

export { Avatar, AvatarImage, AvatarFallback, EnhancedAvatar } from './Avatar'

export { Label } from './Label'

export { Alert, AlertTitle, AlertDescription, AlertWithIcon } from './Alert'

export { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription, 
  DialogClose,
  DialogPortal,
  DialogOverlay 
} from './Dialog'

export { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel, 
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from './Select'

// Common UI patterns for the psychometric assessment platform
export * from './Button'
export * from './Card'
export * from './Input'
export * from './Badge'
export * from './Progress'
export * from './Avatar'
export * from './Label'
export * from './Alert'
export * from './Dialog'
export * from './Select'