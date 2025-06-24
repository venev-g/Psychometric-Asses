// src/lib/services/NotificationService.ts

import { useState, useEffect } from 'react'
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
  actions?: NotificationAction[]
  createdAt: Date
}

export interface NotificationAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary' | 'danger'
}

export interface ToastOptions {
  type?: Notification['type']
  duration?: number
  dismissible?: boolean
  actions?: NotificationAction[]
}

export class NotificationService {
  private notifications: Notification[] = []
  private listeners: Array<(notifications: Notification[]) => void> = []
  private nextId = 1

  // Subscribe to notification changes
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  // Add a notification
  add(notification: Omit<Notification, 'id' | 'createdAt'>): string {
    const id = `notification-${this.nextId++}`
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
      dismissible: notification.dismissible ?? true
    }

    this.notifications.push(newNotification)
    this.notify()

    // Auto-remove after duration
    if (notification.duration !== 0) {
      const duration = notification.duration ?? this.getDefaultDuration(notification.type || 'info')
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  // Remove a notification
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.notify()
  }

  // Clear all notifications
  clear() {
    this.notifications = []
    this.notify()
  }

  // Clear notifications by type
  clearByType(type: Notification['type']) {
    this.notifications = this.notifications.filter(n => n.type !== type)
    this.notify()
  }

  // Convenience methods for different types
  success(title: string, message?: string, options?: ToastOptions): string {
    return this.add({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  error(title: string, message?: string, options?: ToastOptions): string {
    return this.add({
      type: 'error',
      title,
      message,
      duration: 0, // Errors don't auto-dismiss by default
      ...options
    })
  }

  warning(title: string, message?: string, options?: ToastOptions): string {
    return this.add({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  info(title: string, message?: string, options?: ToastOptions): string {
    return this.add({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  // Assessment-specific notifications
  assessmentStarted(assessmentName: string): string {
    return this.info(
      'Assessment Started',
      `${assessmentName} has begun. Take your time and answer honestly.`,
      { duration: 5000 }
    )
  }

  assessmentCompleted(assessmentName: string): string {
    return this.success(
      'Assessment Completed!',
      `Your ${assessmentName} results are ready to view.`,
      {
        actions: [{
          label: 'View Results',
          action: () => {
            // Navigate to results page
            window.location.href = '/assessments/results'
          },
          style: 'primary'
        }]
      }
    )
  }

  assessmentSaved(): string {
    return this.success(
      'Progress Saved',
      'Your responses have been saved automatically.',
      { duration: 3000 }
    )
  }

  assessmentError(error: string): string {
    return this.error(
      'Assessment Error',
      error,
      {
        actions: [{
          label: 'Retry',
          action: () => {
            window.location.reload()
          },
          style: 'primary'
        }, {
          label: 'Contact Support',
          action: () => {
            window.open('/contact', '_blank')
          },
          style: 'secondary'
        }]
      }
    )
  }

  // System notifications
  systemMaintenance(scheduledTime: Date): string {
    return this.warning(
      'Scheduled Maintenance',
      `System maintenance is scheduled for ${scheduledTime.toLocaleString()}. Please save your work.`,
      {
        duration: 0,
        actions: [{
          label: 'Learn More',
          action: () => {
            window.open('/maintenance', '_blank')
          }
        }]
      }
    )
  }

  connectionLost(): string {
    return this.error(
      'Connection Lost',
      'Your internet connection was lost. Please check your connection and try again.',
      {
        actions: [{
          label: 'Retry',
          action: () => {
            window.location.reload()
          },
          style: 'primary'
        }]
      }
    )
  }

  connectionRestored(): string {
    return this.success(
      'Connection Restored',
      'Your internet connection has been restored.',
      { duration: 3000 }
    )
  }

  // Session management
  sessionExpiring(minutesRemaining: number): string {
    return this.warning(
      'Session Expiring',
      `Your session will expire in ${minutesRemaining} minutes. Please save your work.`,
      {
        duration: 0,
        actions: [{
          label: 'Extend Session',
          action: () => {
            // Extend session logic
          },
          style: 'primary'
        }]
      }
    )
  }

  sessionExpired(): string {
    return this.error(
      'Session Expired',
      'Your session has expired. Please sign in again.',
      {
        actions: [{
          label: 'Sign In',
          action: () => {
            window.location.href = '/auth/signin'
          },
          style: 'primary'
        }]
      }
    )
  }

  // Profile and settings
  profileUpdated(): string {
    return this.success(
      'Profile Updated',
      'Your profile has been updated successfully.',
      { duration: 4000 }
    )
  }

  settingsSaved(): string {
    return this.success(
      'Settings Saved',
      'Your preferences have been saved.',
      { duration: 3000 }
    )
  }

  passwordChanged(): string {
    return this.success(
      'Password Changed',
      'Your password has been updated successfully.',
      { duration: 5000 }
    )
  }

  // File operations
  fileUploaded(filename: string): string {
    return this.success(
      'File Uploaded',
      `${filename} has been uploaded successfully.`,
      { duration: 4000 }
    )
  }

  fileUploadFailed(filename: string, error: string): string {
    return this.error(
      'Upload Failed',
      `Failed to upload ${filename}: ${error}`,
      {
        actions: [{
          label: 'Try Again',
          action: () => {
            // Retry upload logic
          },
          style: 'primary'
        }]
      }
    )
  }

  // Batch operations
  bulkOperation(operation: string, successCount: number, totalCount: number): string {
    if (successCount === totalCount) {
      return this.success(
        'Operation Completed',
        `${operation} completed successfully for all ${totalCount} items.`
      )
    } else if (successCount > 0) {
      return this.warning(
        'Operation Partially Completed',
        `${operation} completed for ${successCount} of ${totalCount} items.`
      )
    } else {
      return this.error(
        'Operation Failed',
        `${operation} failed for all items.`
      )
    }
  }

  // Get default duration based on type
  private getDefaultDuration(type: Notification['type']): number {
    switch (type) {
      case 'success':
        return 4000
      case 'info':
        return 5000
      case 'warning':
        return 7000
      case 'error':
        return 0 // Don't auto-dismiss errors
      default:
        return 5000
    }
  }

  // Get all notifications
  getAll(): Notification[] {
    return [...this.notifications]
  }

  // Get notifications by type
  getByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type)
  }

  // Get notification count
  getCount(): number {
    return this.notifications.length
  }

  // Get unread count (could be enhanced with read/unread state)
  getUnreadCount(): number {
    return this.notifications.length
  }
}

// Singleton instance
export const notificationService = new NotificationService()

// React hook for notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications)
    setNotifications(notificationService.getAll())
    return unsubscribe
  }, [])

  return {
    notifications,
    add: notificationService.add.bind(notificationService),
    remove: notificationService.remove.bind(notificationService),
    clear: notificationService.clear.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    info: notificationService.info.bind(notificationService)
  }
}


