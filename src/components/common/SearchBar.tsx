'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
  disabled?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  disabled = false,
  className = ''
}: SearchBarProps) {
  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-10 pr-10"
      />
      {value && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="p-1 h-auto"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>
      )}
    </div>
  )
}