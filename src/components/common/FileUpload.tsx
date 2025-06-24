'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Upload, X, File } from 'lucide-react'

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  className?: string
}

export function FileUpload({
  accept,
  multiple = false,
  maxSize = 10,
  onFilesChange,
  disabled = false,
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles)
    const validFiles: File[] = []
    let errorMessage: string | null = null

    for (const file of fileArray) {
      const validation = validateFile(file)
      if (validation) {
        errorMessage = validation
        break
      }
      validFiles.push(file)
    }

    if (errorMessage) {
      setError(errorMessage)
      return
    }

    setError(null)
    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          {accept ? `Accepted: ${accept}` : 'All file types accepted'}
          {maxSize && ` • Max size: ${maxSize}MB`}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}