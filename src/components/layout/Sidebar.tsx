// src/components/layout/Sidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Menu,
  X
} from 'lucide-react'

/* interface SidebarProps {
  variant?: 'admin' | string;
}
*/

interface SidebarProps {
  variant?: 'admin' | string
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Assessments',
    href: '/assessments',
    icon: FileText
  },
  {
    title: 'Results',
    href: '/results',
    icon: BarChart3
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export function Sidebar({ isOpen = true, onToggle, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            Psychometric
          </h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Version 1.0.0
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar