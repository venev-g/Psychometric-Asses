'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = 'Select date', disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const selectDate = (date: Date) => {
    onChange(date)
    setIsOpen(false)
  }

  const isSelectedDate = (date: Date) => {
    return value && date.toDateString() === value.toDateString()
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={value ? formatDate(value) : ''}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Days of the week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="text-center">
                {date ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-0 text-sm ${
                      isSelectedDate(date)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isToday(date)
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => selectDate(date)}
                  >
                    {date.getDate()}
                  </Button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}