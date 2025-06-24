// src/lib/assessments/scoring/NormalizationEngine.ts
export interface NormativeData {
  category: string
  population: string
  sampleSize: number
  mean: number
  standardDeviation: number
  percentiles: Record<number, number>
  ageGroups?: Record<string, NormativeData>
  genderGroups?: Record<string, NormativeData>
}

export interface NormalizationOptions {
  method: 'percentage' | 'z_score' | 'percentile' | 'sten' | 't_score'
  useAgeNorms?: boolean
  useGenderNorms?: boolean
  ageGroup?: string
  gender?: string
  populationType?: string
}

export interface NormalizedResult {
  rawScore: number
  normalizedScore: number
  percentile: number
  interpretation: string
  confidenceInterval?: {
    lower: number
    upper: number
    level: number
  }
  comparisonGroup: string
}

export class NormalizationEngine {
  private normativeDatabase: Map<string, NormativeData> = new Map()
  
  constructor() {
    this.initializeDefaultNorms()
  }

  normalize(
    rawScore: number,
    category: string,
    options: NormalizationOptions
  ): NormalizedResult {
    const normData = this.getNormativeData(category, options)
    
    if (!normData) {
      // Fallback to simple percentage normalization
      return this.simplePercentageNormalization(rawScore, category)
    }

    switch (options.method) {
      case 'percentage':
        return this.percentageNormalization(rawScore, normData, options)
      
      case 'z_score':
        return this.zScoreNormalization(rawScore, normData, options)
      
      case 'percentile':
        return this.percentileNormalization(rawScore, normData, options)
      
      case 'sten':
        return this.stenNormalization(rawScore, normData, options)
      
      case 't_score':
        return this.tScoreNormalization(rawScore, normData, options)
      
      default:
        return this.percentileNormalization(rawScore, normData, options)
    }
  }

  private getNormativeData(
    category: string, 
    options: NormalizationOptions
  ): NormativeData | null {
    let normKey = category
    
    // Add population type if specified
    if (options.populationType) {
      normKey = `${category}_${options.populationType}`
    }
    
    let normData = this.normativeDatabase.get(normKey) || this.normativeDatabase.get(category)
    
    if (!normData) return null

    // Use age-specific norms if available and requested
    if (options.useAgeNorms && options.ageGroup && normData.ageGroups) {
      normData = normData.ageGroups[options.ageGroup] || normData
    }

    // Use gender-specific norms if available and requested
    if (options.useGenderNorms && options.gender && normData.genderGroups) {
      normData = normData.genderGroups[options.gender] || normData
    }

    return normData
  }

  private simplePercentageNormalization(rawScore: number, category: string): NormalizedResult {
    // Fallback normalization when no norm data is available
    const normalizedScore = Math.max(0, Math.min(100, rawScore))
    
    return {
      rawScore,
      normalizedScore,
      percentile: normalizedScore,
      interpretation: this.getBasicInterpretation(normalizedScore),
      comparisonGroup: 'General Population (Estimated)'
    }
  }

  private percentageNormalization(
    rawScore: number, 
    normData: NormativeData, 
    options: NormalizationOptions
  ): NormalizedResult {
    // Assume maximum possible raw score based on assessment type
    const maxPossibleScore = this.getMaxScoreForCategory(normData.category)
    const percentage = (rawScore / maxPossibleScore) * 100
    const percentile = this.calculatePercentile(rawScore, normData)
    
    return {
      rawScore,
      normalizedScore: Math.round(percentage),
      percentile: Math.round(percentile),
      interpretation: this.getPercentileInterpretation(percentile),
      comparisonGroup: this.getComparisonGroupDescription(normData, options)
    }
  }

  private zScoreNormalization(
    rawScore: number, 
    normData: NormativeData, 
    options: NormalizationOptions
  ): NormalizedResult {
    const zScore = (rawScore - normData.mean) / normData.standardDeviation
    const percentile = this.zScoreToPercentile(zScore)
    
    return {
      rawScore,
      normalizedScore: Math.round(zScore * 100) / 100, // Round to 2 decimal places
      percentile: Math.round(percentile),
      interpretation: this.getZScoreInterpretation(zScore),
      confidenceInterval: this.calculateConfidenceInterval(zScore, normData),
      comparisonGroup: this.getComparisonGroupDescription(normData, options)
    }
  }

  private percentileNormalization(
    rawScore: number, 
    normData: NormativeData, 
    options: NormalizationOptions
  ): NormalizedResult {
    const percentile = this.calculatePercentile(rawScore, normData)
    
    return {
      rawScore,
      normalizedScore: Math.round(percentile),
      percentile: Math.round(percentile),
      interpretation: this.getPercentileInterpretation(percentile),
      comparisonGroup: this.getComparisonGroupDescription(normData, options)
    }
  }

  private stenNormalization(
    rawScore: number, 
    normData: NormativeData, 
    options: NormalizationOptions
  ): NormalizedResult {
    const zScore = (rawScore - normData.mean) / normData.standardDeviation
    const sten = Math.round((zScore * 2) + 5.5)
    const clampedSten = Math.max(1, Math.min(10, sten))
    const percentile = this.calculatePercentile(rawScore, normData)
    
    return {
      rawScore,
      normalizedScore: clampedSten,
      percentile: Math.round(percentile),
      interpretation: this.getStenInterpretation(clampedSten),
      comparisonGroup: this.getComparisonGroupDescription(normData, options)
    }
  }

  private tScoreNormalization(
    rawScore: number, 
    normData: NormativeData, 
    options: NormalizationOptions
  ): NormalizedResult {
    const zScore = (rawScore - normData.mean) / normData.standardDeviation
    const tScore = Math.round((zScore * 10) + 50)
    const percentile = this.calculatePercentile(rawScore, normData)
    
    return {
      rawScore,
      normalizedScore: tScore,
      percentile: Math.round(percentile),
      interpretation: this.getTScoreInterpretation(tScore),
      comparisonGroup: this.getComparisonGroupDescription(normData, options)
    }
  }

  private calculatePercentile(rawScore: number, normData: NormativeData): number {
    // Use precomputed percentiles if available
    if (normData.percentiles) {
      const percentileKeys = Object.keys(normData.percentiles)
        .map(Number)
        .sort((a, b) => a - b)
      
      for (let i = 0; i < percentileKeys.length; i++) {
        const percentile = percentileKeys[i]
        const scoreAtPercentile = normData.percentiles[percentile]
        
        if (rawScore <= scoreAtPercentile) {
          // Interpolate between percentiles if needed
          if (i > 0) {
            const prevPercentile = percentileKeys[i - 1]
            const prevScore = normData.percentiles[prevPercentile]
            const ratio = (rawScore - prevScore) / (scoreAtPercentile - prevScore)
            return prevPercentile + (percentile - prevPercentile) * ratio
          }
          return percentile
        }
      }
      return 99 // Above highest percentile
    }

    // Fallback to normal distribution approximation
    const zScore = (rawScore - normData.mean) / normData.standardDeviation
    return this.zScoreToPercentile(zScore)
  }

  private zScoreToPercentile(zScore: number): number {
    // Approximation of the cumulative distribution function for standard normal
    // Using the error function approximation
    const t = 1 / (1 + 0.2316419 * Math.abs(zScore))
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2)
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    
    const percentile = zScore >= 0 ? (1 - prob) * 100 : prob * 100
    return Math.max(0.1, Math.min(99.9, percentile))
  }

  private calculateConfidenceInterval(
    zScore: number, 
    normData: NormativeData,
    confidenceLevel: number = 0.95
  ) {
    const alpha = 1 - confidenceLevel
    const criticalValue = 1.96 // For 95% confidence interval
    const standardError = 1 / Math.sqrt(normData.sampleSize)
    
    const lower = zScore - criticalValue * standardError
    const upper = zScore + criticalValue * standardError
    
    return {
      lower: Math.round(lower * 100) / 100,
      upper: Math.round(upper * 100) / 100,
      level: confidenceLevel
    }
  }

  private getMaxScoreForCategory(category: string): number {
    // This would be configurable based on the assessment type
    const maxScores: Record<string, number> = {
      'linguistic': 40,
      'logical-mathematical': 40,
      'spatial': 40,
      'bodily-kinesthetic': 40,
      'musical': 40,
      'interpersonal': 40,
      'intrapersonal': 40,
      'naturalistic': 40,
      'dominance': 28,
      'influence': 28,
      'steadiness': 28,
      'conscientiousness': 28,
      'visual': 16,
      'auditory': 16,
      'reading-writing': 16,
      'kinesthetic': 16
    }
    
    return maxScores[category] || 100
  }

  private getBasicInterpretation(score: number): string {
    if (score >= 80) return 'High'
    if (score >= 60) return 'Above Average'
    if (score >= 40) return 'Average'
    if (score >= 20) return 'Below Average'
    return 'Low'
  }

  private getPercentileInterpretation(percentile: number): string {
    if (percentile >= 98) return 'Extremely High (Top 2%)'
    if (percentile >= 90) return 'Very High (Top 10%)'
    if (percentile >= 75) return 'High (Top 25%)'
    if (percentile >= 60) return 'Above Average'
    if (percentile >= 40) return 'Average'
    if (percentile >= 25) return 'Below Average'
    if (percentile >= 10) return 'Low (Bottom 25%)'
    if (percentile >= 2) return 'Very Low (Bottom 10%)'
    return 'Extremely Low (Bottom 2%)'
  }

  private getZScoreInterpretation(zScore: number): string {
    if (zScore >= 2.0) return 'Extremely High (+2.0 SD)'
    if (zScore >= 1.5) return 'Very High (+1.5 SD)'
    if (zScore >= 1.0) return 'High (+1.0 SD)'
    if (zScore >= 0.5) return 'Above Average (+0.5 SD)'
    if (zScore >= -0.5) return 'Average (±0.5 SD)'
    if (zScore >= -1.0) return 'Below Average (-0.5 SD)'
    if (zScore >= -1.5) return 'Low (-1.0 SD)'
    if (zScore >= -2.0) return 'Very Low (-1.5 SD)'
    return 'Extremely Low (-2.0 SD)'
  }

  private getStenInterpretation(sten: number): string {
    const interpretations = {
      1: 'Very Low',
      2: 'Low',
      3: 'Below Average',
      4: 'Below Average',
      5: 'Average',
      6: 'Average',
      7: 'Above Average',
      8: 'Above Average',
      9: 'High',
      10: 'Very High'
    }
    return interpretations[sten as keyof typeof interpretations] || 'Average'
  }

  private getTScoreInterpretation(tScore: number): string {
    if (tScore >= 70) return 'Very High (T-Score ≥ 70)'
    if (tScore >= 65) return 'High (T-Score 65-69)'
    if (tScore >= 55) return 'Above Average (T-Score 55-64)'
    if (tScore >= 45) return 'Average (T-Score 45-54)'
    if (tScore >= 35) return 'Below Average (T-Score 35-44)'
    if (tScore >= 30) return 'Low (T-Score 30-34)'
    return 'Very Low (T-Score < 30)'
  }

  private getComparisonGroupDescription(
    normData: NormativeData, 
    options: NormalizationOptions
  ): string {
    let description = normData.population
    
    if (options.ageGroup) {
      description += ` (Age: ${options.ageGroup})`
    }
    
    if (options.gender) {
      description += ` (${options.gender})`
    }
    
    description += ` (N=${normData.sampleSize})`
    
    return description
  }

  // Initialize default normative data
  private initializeDefaultNorms(): void {
    // Multiple Intelligence norms (example data)
    this.normativeDatabase.set('linguistic', {
      category: 'linguistic',
      population: 'General Adult Population',
      sampleSize: 2500,
      mean: 20,
      standardDeviation: 6,
      percentiles: {
        10: 12,
        25: 16,
        50: 20,
        75: 24,
        90: 28,
        95: 31,
        99: 36
      }
    })

    // Add more normative data for other categories...
    // This would be populated from a database or configuration file in a real application
  }

  // Method to add custom normative data
  addNormativeData(data: NormativeData): void {
    this.normativeDatabase.set(data.category, data)
  }

  // Method to get all available normative categories
  getAvailableCategories(): string[] {
    return Array.from(this.normativeDatabase.keys())
  }
}