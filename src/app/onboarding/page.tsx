'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { IOnboarding } from '@/modules/auth/auth.interfaces'
import PersonalInfoStep from './steps/PersonalInfoStep'
import HealthInfoStep from './steps/HealthInfoStep'
import EmergencyInfoStep from './steps/EmergencyInfoStep'
import LifestyleInfoStep from './steps/LifestyleInfoStep'
import MedicalHistoryStep from './steps/MedicalHistoryStep'
import { useAuthService } from '../../modules/auth/useAuth'

const steps = [
  { title: 'Información Personal', component: PersonalInfoStep },
  { title: 'Información de Salud', component: HealthInfoStep },
  { title: 'Contactos de Emergencia', component: EmergencyInfoStep },
  { title: 'Estilo de Vida', component: LifestyleInfoStep },
  { title: 'Historial Médico', component: MedicalHistoryStep },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const { completeOnboarding, isCompletingOnboarding } = useAuthService()
  const [formData, setFormData] = useState<Partial<IOnboarding>>({})
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = (stepData: Partial<IOnboarding>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    try {
      completeOnboarding(formData as IOnboarding)
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  useEffect(() => {
    if (isCompletingOnboarding) {
      router.push('/dashboard')
    }
  }, [isCompletingOnboarding, router])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenido a tu experiencia en Seguros Sur
        </h1>
        <p className="text-gray-600">Déjanos conocerte mejor para ofrecerte la mejor cobertura</p>
      </div>

      <Progress value={progress} className="mb-8 h-2 bg-blue-100" />

      <Card className="p-6 shadow-lg border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">{steps[currentStep].title}</h2>
          <p className="text-sm text-blue-500">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <CurrentStepComponent
          initialData={formData}
          onNext={handleNext}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </Card>
    </div>
  )
}
