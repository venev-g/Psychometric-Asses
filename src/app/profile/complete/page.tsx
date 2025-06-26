// src/app/profile/complete/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle, 
  User, 
  Target, 
  GraduationCap, 
  Briefcase,
  Calendar,
  Star,
  Award
} from 'lucide-react'

interface ProfileCompletionStep {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function ProfileCompletePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    education_level: '',
    occupation: '',
    organization: '',
    years_experience: '',
    interests: [] as string[],
    goals: [] as string[],
    bio: ''
  })

  const steps: ProfileCompletionStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Tell us about yourself',
      completed: false
    },
    {
      id: 'professional',
      title: 'Professional Background',
      description: 'Your work and education',
      completed: false
    },
    {
      id: 'interests',
      title: 'Interests & Goals',
      description: 'What motivates you',
      completed: false
    },
    {
      id: 'finalize',
      title: 'Complete Profile',
      description: 'Review and finish',
      completed: false
    }
  ]

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree',
    'Professional Certification',
    'Other'
  ]

  const interestOptions = [
    'Technology', 'Science', 'Arts', 'Sports', 'Music', 'Reading',
    'Travel', 'Cooking', 'Photography', 'Gaming', 'Fitness', 'Nature',
    'Writing', 'Learning Languages', 'Volunteering', 'Business'
  ]

  const goalOptions = [
    'Career Advancement',
    'Personal Growth',
    'Skill Development',
    'Academic Achievement',
    'Leadership Development',
    'Work-Life Balance',
    'Entrepreneurship',
    'Team Collaboration',
    'Creative Expression',
    'Health & Wellness'
  ]

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Get existing profile data
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      if (profile) {
        // Map profile data to form data (using only available fields)
        setFormData({
          full_name: profile.full_name || '',
          date_of_birth: (profile as any).date_of_birth || '',
          gender: (profile as any).gender || '',
          phone: (profile as any).phone || '',
          education_level: (profile as any).education_level || '',
          occupation: (profile as any).occupation || '',
          organization: (profile as any).organization || '',
          years_experience: (profile as any).years_experience?.toString() || '',
          interests: (profile as any).interests || [],
          goals: (profile as any).goals || [],
          bio: (profile as any).bio || ''
        })

        // Determine current step based on completion
        determineCurrentStep(profile)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const determineCurrentStep = (profile: any) => {
    if (!profile.full_name) {
      setCurrentStep(0) // Basic info
    } else if (!(profile as any).education_level || !(profile as any).occupation) {
      setCurrentStep(1) // Professional
    } else if (!(profile as any).interests?.length || !(profile as any).goals?.length) {
      setCurrentStep(2) // Interests
    } else {
      setCurrentStep(3) // Complete
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      setError('')
      const supabase = createClient()

      if (!user?.id) {
        throw new Error('No user found')
      }

      const updateData = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        education_level: formData.education_level || null,
        occupation: formData.occupation || null,
        organization: formData.organization || null,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        interests: formData.interests,
        goals: formData.goals,
        bio: formData.bio || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...updateData
        })

      if (error) throw error

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeProfile = async () => {
    await saveProfile()
    router.push('/dashboard')
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-gray-600">Let's start with the essentials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Professional Background</h2>
              <p className="text-gray-600">Tell us about your work and education</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <select
                  id="education_level"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.education_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, education_level: e.target.value }))}
                >
                  <option value="">Select education level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Your job title or profession"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Company or organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold">Interests & Goals</h2>
              <p className="text-gray-600">What drives and motivates you?</p>
            </div>

            <div className="space-y-8">
              <div>
                <Label className="text-lg font-medium mb-4 block">Your Interests</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map(interest => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <Label 
                        htmlFor={`interest-${interest}`} 
                        className="text-sm cursor-pointer"
                      >
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-medium mb-4 block">Your Goals</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalOptions.map(goal => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`goal-${goal}`}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                      />
                      <Label 
                        htmlFor={`goal-${goal}`} 
                        className="text-sm cursor-pointer"
                      >
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-lg font-medium mb-2 block">
                  About Yourself (Optional)
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself, your aspirations, or anything else you'd like to share..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Award className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold">Profile Complete!</h2>
              <p className="text-gray-600">Review your information and finish setup</p>
            </div>

            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {formData.full_name}</div>
                  <div><strong>Date of Birth:</strong> {formData.date_of_birth || 'Not provided'}</div>
                  <div><strong>Gender:</strong> {formData.gender || 'Not provided'}</div>
                  <div><strong>Phone:</strong> {formData.phone || 'Not provided'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Professional Background</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Education:</strong> {formData.education_level || 'Not provided'}</div>
                  <div><strong>Occupation:</strong> {formData.occupation || 'Not provided'}</div>
                  <div><strong>Organization:</strong> {formData.organization || 'Not provided'}</div>
                  <div><strong>Experience:</strong> {formData.years_experience ? `${formData.years_experience} years` : 'Not provided'}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Interests & Goals</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Interests:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.interests.map(interest => (
                        <Badge key={interest} variant="outline" size="sm">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Goals:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.goals.map(goal => (
                        <Badge key={goal} variant="outline" size="sm">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                  {formData.bio && (
                    <div>
                      <strong>Bio:</strong>
                      <p className="mt-1 text-gray-600">{formData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Badge variant="outline">Profile Setup</Badge>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <div className="ml-3">
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-gray-600">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={saveProfile}
            disabled={saving}
            variant="outline"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Progress'}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={completeProfile}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {saving ? 'Completing...' : 'Complete Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
