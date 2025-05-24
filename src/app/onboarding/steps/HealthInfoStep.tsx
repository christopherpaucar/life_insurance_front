'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IOnboarding, BloodType } from '@/modules/auth/auth.interfaces'

interface HealthInfoStepProps {
  initialData: Partial<IOnboarding>
  onNext: (data: Partial<IOnboarding>) => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function HealthInfoStep({
  initialData,
  onNext,
  onBack,
  isFirstStep,
}: HealthInfoStepProps) {
  const [formData, setFormData] = useState({
    booldType: initialData.booldType || '',
    height: initialData.height || '',
    weight: initialData.weight || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext({
      booldType: formData.booldType as BloodType,
      height: Number(formData.height),
      weight: Number(formData.weight),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="booldType" className="text-blue-700 font-medium mb-2">
            Tipo de Sangre
          </Label>
          <Select
            value={formData.booldType}
            onValueChange={(value) => setFormData({ ...formData, booldType: value })}
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Selecciona tu tipo de sangre" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BloodType).map((type) => (
                <SelectItem key={type} value={type} className="hover:bg-blue-50">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="height" className="text-blue-700 font-medium mb-2">
            Estatura (cm)
          </Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            className="border-blue-200 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="weight" className="text-blue-700 font-medium mb-2">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
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
