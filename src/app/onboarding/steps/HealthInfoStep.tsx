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
    bloodType: initialData.bloodType || '',
    height: initialData.height || '',
    weight: initialData.weight || '',
  })

  const [errors, setErrors] = useState({
    height: '',
    weight: '',
  })

  const validateHeight = (height: string): boolean => {
    const heightNum = Number(height)
    if (heightNum < 50) {
      setErrors((prev) => ({ ...prev, height: 'La estatura debe ser mayor a 50cm' }))
      return false
    }
    if (heightNum > 250) {
      setErrors((prev) => ({ ...prev, height: 'La estatura debe ser menor a 250cm' }))
      return false
    }
    setErrors((prev) => ({ ...prev, height: '' }))
    return true
  }

  const validateWeight = (weight: string): boolean => {
    const weightNum = Number(weight)
    if (weightNum < 20) {
      setErrors((prev) => ({ ...prev, weight: 'El peso debe ser mayor a 20kg' }))
      return false
    }
    if (weightNum > 300) {
      setErrors((prev) => ({ ...prev, weight: 'El peso debe ser menor a 300kg' }))
      return false
    }
    setErrors((prev) => ({ ...prev, weight: '' }))
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isHeightValid = validateHeight(String(formData.height))
    const isWeightValid = validateWeight(String(formData.weight))

    if (isHeightValid && isWeightValid) {
      onNext({
        bloodType: formData.bloodType as BloodType,
        height: Number(formData.height),
        weight: Number(formData.weight),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="bloodType" className="text-blue-700 font-medium mb-2">
            Tipo de Sangre
          </Label>
          <Select
            value={formData.bloodType}
            onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
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
            onChange={(e) => {
              setFormData({ ...formData, height: e.target.value })
              validateHeight(e.target.value)
            }}
            className="border-blue-200 focus:border-blue-500"
            required
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>

        <div>
          <Label htmlFor="weight" className="text-blue-700 font-medium mb-2">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => {
              setFormData({ ...formData, weight: e.target.value })
              validateWeight(e.target.value)
            }}
            className="border-blue-200 focus:border-blue-500"
            required
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
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
