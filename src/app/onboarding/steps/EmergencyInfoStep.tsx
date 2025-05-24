'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IOnboarding } from '@/modules/auth/auth.interfaces'

interface EmergencyInfoStepProps {
  initialData: Partial<IOnboarding>
  onNext: (data: Partial<IOnboarding>) => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function EmergencyInfoStep({
  initialData,
  onNext,
  onBack,
  isFirstStep,
}: EmergencyInfoStepProps) {
  const [formData, setFormData] = useState({
    emergencyContact: initialData.emergencyContact || '',
    emergencyPhone: initialData.emergencyPhone || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="emergencyContact" className="text-blue-700 font-medium mb-2">
            Nombre del Contacto de Emergencia
          </Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            className="border-blue-200 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="emergencyPhone" className="text-blue-700 font-medium mb-2">
            Teléfono de Emergencia
          </Label>
          <Input
            id="emergencyPhone"
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
            className="border-blue-200 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-between">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-blue-200 hover:bg-blue-50"
          >
            Atrás
          </Button>
        )}
        <Button
          type="submit"
          className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Siguiente
        </Button>
      </div>
    </form>
  )
}
