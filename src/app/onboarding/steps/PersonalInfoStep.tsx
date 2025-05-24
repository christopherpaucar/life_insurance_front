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
import { IOnboarding } from '@/modules/auth/auth.interfaces'
import { format } from 'date-fns'

const genderOptions = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'OTRO', label: 'Otro' },
  { value: 'PREFIERO_NO_DECIR', label: 'Prefiero no decir' },
]

interface PersonalInfoStepProps {
  initialData: Partial<IOnboarding>
  onNext: (data: Partial<IOnboarding>) => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function PersonalInfoStep({
  initialData,
  onNext,
  onBack,
  isFirstStep,
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    birthDate: initialData.birthDate || new Date(),
    gender: initialData.gender || '',
    address: initialData.address || '',
    phoneNumber: initialData.phoneNumber || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="birthDate" className="text-blue-700 font-medium mb-2">
            Fecha de nacimiento *
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={format(formData.birthDate, 'yyyy-MM-dd')}
            onChange={(e) => setFormData({ ...formData, birthDate: new Date(e.target.value) })}
            className="border-blue-200 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="gender" className="text-blue-700 font-medium mb-2">
            Género *
          </Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Selecciona tu género" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="address" className="text-blue-700 font-medium mb-2">
            Dirección *
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border-blue-200 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-blue-700 font-medium mb-2">
            Número de Teléfono *
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
