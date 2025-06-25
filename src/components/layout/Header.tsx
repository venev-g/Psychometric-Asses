'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Brain, Menu, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PsychoMetrics</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/test/start" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Assessments
                </Link>
                <Link 
                  href="/results/history" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Results
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <Avatar size="sm">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt={user.user_metadata?.full_name || user.email || 'User'}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-full">
                        {(user.user_metadata?.full_name || user.email || 'User').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/profile/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            signOut()
                          }}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}