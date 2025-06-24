'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Play, 
  BarChart3, 
  History, 
  User, 
  Settings,
  BookOpen
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  {
    name: 'Start Assessment',
    href: '/assessment/start',
    icon: Play,
    description: 'Begin a new assessment'
  },
  {
    name: 'Results',
    href: '/results/history',
    icon: BarChart3,
    description: 'View your assessment results'
  },
  {
    name: 'History',
    href: '/results/history',
    icon: History,
    description: 'Past assessments'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Your account information'
  },
  {
    name: 'Settings',
    href: '/profile/settings',
    icon: Settings,
    description: 'Account preferences'
  }
]

export function Navigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16">
      <div className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-blue-700' : 'text-gray-400'}`} />
                <div>
                  <div>{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Resources Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Resources
          </h3>
          <div className="mt-3 space-y-1">
            <a
              href="/resources/help"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span>Help Center</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}