// src/types/chart.types.ts
export interface ChartDataPoint {
  x: string | number | Date
  y: number
  label?: string
  color?: string
  metadata?: Record<string, any>
}

export interface ChartSeries {
  name: string
  data: ChartDataPoint[]
  color?: string
  type?: 'line' | 'bar' | 'area' | 'scatter'
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'area' | 'scatter'
  data: ChartSeries[]
  options?: ChartOptions
  responsive?: boolean
  maintainAspectRatio?: boolean
}

export interface ChartOptions {
  title?: {
    text: string
    display: boolean
    position?: 'top' | 'bottom' | 'left' | 'right'
  }
  legend?: {
    display: boolean
    position?: 'top' | 'bottom' | 'left' | 'right'
  }
  axes?: {
    x?: AxisConfig
    y?: AxisConfig
  }
  colors?: string[]
  animation?: {
    duration: number
    easing?: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn'
  }
  grid?: {
    display: boolean
    color?: string
  }
  tooltip?: {
    enabled: boolean
    format?: string
  }
}

export interface AxisConfig {
  title?: string
  min?: number
  max?: number
  stepSize?: number
  display?: boolean
  gridLines?: {
    display: boolean
    color?: string
  }
  labels?: {
    display: boolean
    rotation?: number
    format?: string
  }
}

// Assessment-specific chart types
export interface ScoreRadarChart {
  type: 'radar'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
      pointBackgroundColor?: string
    }>
  }
}

export interface ScoreComparisonChart {
  type: 'bar'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string[]
    }>
  }
}

export interface ProgressChart {
  type: 'line'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension?: number
    }>
  }
}

export interface PercentileChart {
  type: 'doughnut'
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
      borderWidth?: number
    }>
  }
}

// Chart utility types
export interface ChartTheme {
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  background: string
  text: string
  grid: string
}

export interface ChartExportOptions {
  format: 'png' | 'jpeg' | 'pdf' | 'svg'
  width?: number
  height?: number
  quality?: number
  filename?: string
}