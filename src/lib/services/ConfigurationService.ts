// src/lib/services/ConfigurationService.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type TestConfiguration = Tables['test_configurations']['Row']
type TestType = Tables['test_types']['Row']
type TestSequence = Tables['test_sequences']['Row']

export class ConfigurationService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async createConfiguration(
    config: Tables['test_configurations']['Insert']
  ): Promise<TestConfiguration> {
    const { data, error } = await this.supabase
      .from('test_configurations')
      .insert(config)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateConfiguration(
    id: string,
    updates: Tables['test_configurations']['Update']
  ): Promise<TestConfiguration> {
    const { data, error } = await this.supabase
      .from('test_configurations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteConfiguration(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('test_configurations')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async addTestToSequence(
    configId: string,
    testTypeId: string,
    order: number,
    required: boolean = true
  ): Promise<TestSequence> {
    const { data, error } = await this.supabase
      .from('test_sequences')
      .insert({
        configuration_id: configId,
        test_type_id: testTypeId,
        sequence_order: order,
        is_required: required
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateTestSequence(
    sequenceId: string,
    updates: Tables['test_sequences']['Update']
  ): Promise<TestSequence> {
    const { data, error } = await this.supabase
      .from('test_sequences')
      .update(updates)
      .eq('id', sequenceId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeTestFromSequence(sequenceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('test_sequences')
      .delete()
      .eq('id', sequenceId)

    if (error) throw error
  }

  async getConfigurationWithSequence(configId: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('test_configurations')
      .select(`
        *,
        test_sequences (
          id,
          sequence_order,
          is_required,
          test_types (*)
        )
      `)
      .eq('id', configId)
      .single()

    if (error) throw error

    // Sort test sequences by order
    if (data.test_sequences) {
      data.test_sequences.sort((a: any, b: any) => a.sequence_order - b.sequence_order)
    }

    return data
  }

  async getAllConfigurations(): Promise<TestConfiguration[]> {
    const { data, error } = await this.supabase
      .from('test_configurations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getTestTypes(): Promise<TestType[]> {
    const { data, error } = await this.supabase
      .from('test_types')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  }

  async createTestType(testType: Tables['test_types']['Insert']): Promise<TestType> {
    const { data, error } = await this.supabase
      .from('test_types')
      .insert(testType)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async reorderTestSequence(configId: string, sequences: Array<{id: string, order: number}>): Promise<void> {
    // Update each sequence individually
    for (const sequence of sequences) {
      const { error } = await this.supabase
        .from('test_sequences')
        .update({ sequence_order: sequence.order })
        .eq('id', sequence.id)
        .eq('configuration_id', configId)

      if (error) throw error
    }
  }
}