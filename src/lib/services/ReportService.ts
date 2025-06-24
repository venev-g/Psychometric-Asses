// src/lib/services/ReportService.ts
import type { GenerateReportRequest, ReportStatus } from '@/types/api.types'

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'assessment' | 'user' | 'configuration' | 'analytics'
  parameters: ReportParameter[]
  supportedFormats: ('pdf' | 'csv' | 'json' | 'xlsx')[]
  estimatedTime: string
}

export interface ReportParameter {
  name: string
  label: string
  type: 'string' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean'
  required: boolean
  options?: Array<{ value: any; label: string }>
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface GeneratedReport {
  id: string
  name: string
  type: string
  format: string
  status: ReportStatus['status']
  downloadUrl?: string
  parameters: Record<string, any>
  createdAt: Date
  completedAt?: Date
  fileSize?: number
  error?: string
}

export class ReportService {
  private apiUrl = '/api/reports'

  // Get available report templates
  async getTemplates(): Promise<ReportTemplate[]> {
    try {
      const response = await fetch(`${this.apiUrl}/templates`)
      if (!response.ok) throw new Error('Failed to fetch report templates')
      return response.json()
    } catch (error) {
      console.error('Error fetching report templates:', error)
      throw error
    }
  }

  // Get specific template
  async getTemplate(templateId: string): Promise<ReportTemplate> {
    try {
      const response = await fetch(`${this.apiUrl}/templates/${templateId}`)
      if (!response.ok) throw new Error('Failed to fetch report template')
      return response.json()
    } catch (error) {
      console.error('Error fetching report template:', error)
      throw error
    }
  }

  // Generate a report
  async generateReport(request: GenerateReportRequest): Promise<{ reportId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) throw new Error('Failed to generate report')
      return response.json()
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }

  // Get report status
  async getReportStatus(reportId: string): Promise<ReportStatus> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}/status`)
      if (!response.ok) throw new Error('Failed to fetch report status')
      return response.json()
    } catch (error) {
      console.error('Error fetching report status:', error)
      throw error
    }
  }

  // Get user's reports
  async getUserReports(page: number = 1, limit: number = 20): Promise<{
    reports: GeneratedReport[]
    total: number
    page: number
    limit: number
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      const response = await fetch(`${this.apiUrl}?${params}`)
      if (!response.ok) throw new Error('Failed to fetch user reports')
      return response.json()
    } catch (error) {
      console.error('Error fetching user reports:', error)
      throw error
    }
  }

  // Download report
  async downloadReport(reportId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}/download`)
      if (!response.ok) throw new Error('Failed to download report')
      return response.blob()
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  }

  // Delete report
  async deleteReport(reportId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete report')
    } catch (error) {
      console.error('Error deleting report:', error)
      throw error
    }
  }

  // Predefined report generators
  async generateAssessmentReport(params: {
    sessionIds: string[]
    includeRecommendations?: boolean
    includeCharts?: boolean
    format?: 'pdf' | 'csv'
  }): Promise<{ reportId: string }> {
    return this.generateReport({
      type: 'assessment',
      parameters: params,
      format: params.format || 'pdf',
      includeCharts: params.includeCharts ?? true
    })
  }

  async generateUserProgressReport(params: {
    userId: string
    timeRange: { start: string; end: string }
    includeComparisons?: boolean
    format?: 'pdf' | 'csv'
  }): Promise<{ reportId: string }> {
    return this.generateReport({
      type: 'user',
      parameters: params,
      format: params.format || 'pdf',
      includeCharts: true
    })
  }

  async generateAnalyticsReport(params: {
    metrics: string[]
    timeRange: { start: string; end: string }
    groupBy?: string
    filters?: Record<string, any>
    format?: 'pdf' | 'csv' | 'xlsx'
  }): Promise<{ reportId: string }> {
    return this.generateReport({
      type: 'analytics',
      parameters: params,
      format: params.format || 'pdf',
      includeCharts: true
    })
  }

  async generateConfigurationReport(params: {
    configurationIds?: string[]
    includeUsageStats?: boolean
    includeUserFeedback?: boolean
    format?: 'pdf' | 'csv'
  }): Promise<{ reportId: string }> {
    return this.generateReport({
      type: 'configuration',
      parameters: params,
      format: params.format || 'pdf',
      includeCharts: false
    })
  }

  // Bulk operations
  async generateBulkReports(requests: GenerateReportRequest[]): Promise<{
    reportIds: string[]
    batchId: string
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests })
      })
      
      if (!response.ok) throw new Error('Failed to generate bulk reports')
      return response.json()
    } catch (error) {
      console.error('Error generating bulk reports:', error)
      throw error
    }
  }

  // Schedule report generation
  async scheduleReport(params: {
    templateId: string
    parameters: Record<string, any>
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly'
      time: string // HH:MM format
      timezone: string
    }
    recipients: string[]
  }): Promise<{ scheduleId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) throw new Error('Failed to schedule report')
      return response.json()
    } catch (error) {
      console.error('Error scheduling report:', error)
      throw error
    }
  }

  // Get scheduled reports
  async getScheduledReports(): Promise<Array<{
    id: string
    templateId: string
    templateName: string
    schedule: any
    recipients: string[]
    isActive: boolean
    nextRun: Date
    lastRun?: Date
  }>> {
    try {
      const response = await fetch(`${this.apiUrl}/scheduled`)
      if (!response.ok) throw new Error('Failed to fetch scheduled reports')
      return response.json()
    } catch (error) {
      console.error('Error fetching scheduled reports:', error)
      throw error
    }
  }

  // Cancel scheduled report
  async cancelScheduledReport(scheduleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/scheduled/${scheduleId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to cancel scheduled report')
    } catch (error) {
      console.error('Error canceling scheduled report:', error)
      throw error
    }
  }

  // Share report
  async shareReport(reportId: string, options: {
    recipients: string[]
    message?: string
    expiresAt?: Date
  }): Promise<{ shareId: string; shareUrl: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      })
      
      if (!response.ok) throw new Error('Failed to share report')
      return response.json()
    } catch (error) {
      console.error('Error sharing report:', error)
      throw error
    }
  }

  // Get report insights
  async getReportInsights(reportId: string): Promise<{
    summary: string
    keyFindings: string[]
    recommendations: string[]
    trends: Array<{
      metric: string
      direction: 'up' | 'down' | 'stable'
      change: number
      description: string
    }>
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}/insights`)
      if (!response.ok) throw new Error('Failed to fetch report insights')
      return response.json()
    } catch (error) {
      console.error('Error fetching report insights:', error)
      throw error
    }
  }

  // Export to external systems
  async exportToExternal(reportId: string, destination: {
    type: 'email' | 'drive' | 'dropbox' | 'slack'
    config: Record<string, any>
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/${reportId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination)
      })
      
      if (!response.ok) throw new Error('Failed to export report')
      return response.json()
    } catch (error) {
      console.error('Error exporting report:', error)
      throw error
    }
  }

  // Poll for report completion
  async pollForCompletion(
    reportId: string, 
    onProgress?: (status: ReportStatus) => void,
    maxWaitTime: number = 300000 // 5 minutes
  ): Promise<ReportStatus> {
    const startTime = Date.now()
    const pollInterval = 2000 // 2 seconds
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getReportStatus(reportId)
          
          if (onProgress) {
            onProgress(status)
          }
          
          if (status.status === 'completed') {
            resolve(status)
            return
          }
          
          if (status.status === 'failed') {
            reject(new Error(status.error || 'Report generation failed'))
            return
          }
          
          if (Date.now() - startTime > maxWaitTime) {
            reject(new Error('Report generation timeout'))
            return
          }
          
          setTimeout(poll, pollInterval)
        } catch (error) {
          reject(error)
        }
      }
      
      poll()
    })
  }
}

// Singleton instance
export const reportService = new ReportService()

// React hook for reports
export function useReports() {
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await reportService.getUserReports()
      setReports(data.reports)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTemplates = useCallback(async () => {
    try {
      const data = await reportService.getTemplates()
      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    }
  }, [])

  useEffect(() => {
    loadReports()
    loadTemplates()
  }, [loadReports, loadTemplates])

  return {
    reports,
    templates,
    loading,
    error,
    generateReport: reportService.generateReport.bind(reportService),
    downloadReport: reportService.downloadReport.bind(reportService),
    deleteReport: reportService.deleteReport.bind(reportService),
    shareReport: reportService.shareReport.bind(reportService),
    refresh: loadReports
  }
}