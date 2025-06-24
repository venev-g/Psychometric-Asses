// src/lib/assessments/AssessmentFactory.ts
import { BaseAssessment } from './BaseAssessment'
import { DominantIntelligenceAssessment } from './DominantIntelligenceAssessment'
import { PersonalityPatternAssessment } from './PersonalityPatternAssessment'
import { VarkAssessment } from './VarkAssessment'

export class AssessmentFactory {
  private static assessments: Map<string, () => BaseAssessment> = new Map()

  static register(type: string, factory: () => BaseAssessment): void {
    this.assessments.set(type, factory)
  }

  static create(type: string): BaseAssessment {
    const factory = this.assessments.get(type)
    if (!factory) {
      throw new Error(`Assessment type '${type}' not found`)
    }
    return factory()
  }

  static getAvailableTypes(): string[] {
    return Array.from(this.assessments.keys())
  }

  static initialize(): void {
    this.register('dominant-intelligence', () => new DominantIntelligenceAssessment())
    this.register('personality-pattern', () => new PersonalityPatternAssessment())
    this.register('vark', () => new VarkAssessment())
  }
}

// Initialize the factory
AssessmentFactory.initialize()