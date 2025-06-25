'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Psychometric Assessment Platform
            </h3>
            <p className="text-gray-600 mb-4">
              Discover your potential through scientifically-backed psychometric assessments. 
              Understand your intelligence patterns, personality traits, and learning preferences.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>for personal development</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Assessments</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/test/start" className="hover:text-gray-900">
                  Multiple Intelligence
                </Link>
              </li>
              <li>
                <Link href="/test/start" className="hover:text-gray-900">
                  Personality Pattern
                </Link>
              </li>
              <li>
                <Link href="/test/start" className="hover:text-gray-900">
                  Learning Style
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help" className="hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Psychometric Assessment Platform. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link href="/accessibility" className="text-sm text-gray-500 hover:text-gray-900">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}