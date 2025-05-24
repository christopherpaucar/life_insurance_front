'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IOnboarding } from '@/modules/auth/auth.interfaces'

const exerciseFrequency = [
  { value: 'NUNCA', label: 'Nunca' },
  { value: 'OCASIONALMENTE', label: 'Ocasionalmente (1-2 veces por semana)' },
  { value: 'REGULARMENTE', label: 'Regularmente (3-4 veces por semana)' },
  { value: 'FRECUENTEMENTE', label: 'Frecuentemente (5+ veces por semana)' },
]

const dietType = [
  { value: 'OMNIVORO', label: 'Omnívoro' },
  { value: 'VEGETARIANO', label: 'Vegetariano' },
  { value: 'VEGANO', label: 'Vegano' },
  { value: 'PALEO', label: 'Paleo' },
  { value: 'KETO', label: 'Keto' },
  { value: 'OTRO', label: 'Otro' },
]

const sleepHours = [
  { value: 'MENOS_6', label: 'Menos de 6 horas' },
  { value: '6_7', label: '6-7 horas' },
  { value: '7_8', label: '7-8 horas' },
  { value: 'MAS_8', label: 'Más de 8 horas' },
]

const stressLevel = [
  { value: 'BAJO', label: 'Bajo' },
  { value: 'MODERADO', label: 'Moderado' },
  { value: 'ALTO', label: 'Alto' },
  { value: 'MUY_ALTO', label: 'Muy alto' },
]

interface LifestyleInfoStepProps {
  initialData: Partial<IOnboarding>
  onNext: (data: Partial<IOnboarding>) => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function LifestyleInfoStep({
  initialData,
  onNext,
  onBack,
  isFirstStep,
}: LifestyleInfoStepProps) {
  const [formData, setFormData] = useState({
    lifestyle: initialData.lifestyle || {
      exerciseFrequency: '',
      dietType: '',
      sleepHours: '',
      stressLevel: '',
      smoking: false,
      alcoholConsumption: '',
      additionalNotes: '',
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleSelectChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      lifestyle: {
        ...formData.lifestyle,
        [key]: value,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-blue-700 font-medium mb-2">Frecuencia de Ejercicio</Label>
            <Select
              value={formData.lifestyle.exerciseFrequency}
              onValueChange={(value) => handleSelectChange('exerciseFrequency', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                {exerciseFrequency.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-700 font-medium mb-2">Tipo de Dieta</Label>
            <Select
              value={formData.lifestyle.dietType}
              onValueChange={(value) => handleSelectChange('dietType', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Selecciona tu dieta" />
              </SelectTrigger>
              <SelectContent>
                {dietType.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-700 font-medium mb-2">Horas de Sueño</Label>
            <Select
              value={formData.lifestyle.sleepHours}
              onValueChange={(value) => handleSelectChange('sleepHours', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Selecciona las horas" />
              </SelectTrigger>
              <SelectContent>
                {sleepHours.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-blue-700 font-medium mb-2">Nivel de Estrés</Label>
            <Select
              value={formData.lifestyle.stressLevel}
              onValueChange={(value) => handleSelectChange('stressLevel', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Selecciona el nivel" />
              </SelectTrigger>
              <SelectContent>
                {stressLevel.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="smoking"
              checked={formData.lifestyle.smoking}
              onChange={(e) => handleSelectChange('smoking', e.target.checked.toString())}
              className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="smoking" className="text-blue-700 font-medium">
              ¿Fumas actualmente?
            </Label>
          </div>

          <div>
            <Label className="text-blue-700 font-medium mb-2">Consumo de Alcohol</Label>
            <Select
              value={formData.lifestyle.alcoholConsumption}
              onValueChange={(value) => handleSelectChange('alcoholConsumption', value)}
            >
              <SelectTrigger className="border-blue-200 focus:border-blue-500">
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NUNCA" className="hover:bg-blue-50">
                  Nunca
                </SelectItem>
                <SelectItem value="OCASIONALMENTE" className="hover:bg-blue-50">
                  Ocasionalmente
                </SelectItem>
                <SelectItem value="MODERADO" className="hover:bg-blue-50">
                  Moderado
                </SelectItem>
                <SelectItem value="FRECUENTE" className="hover:bg-blue-50">
                  Frecuente
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
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
