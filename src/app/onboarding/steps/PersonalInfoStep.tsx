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
import { format, differenceInYears, isAfter } from 'date-fns'

const genderOptions = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Femenino' },
  { value: 'OTHER', label: 'Otro' },
  { value: 'NOT_SPECIFIED', label: 'Prefiero no responder' },
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

  const [error, setError] = useState('')

  const validateBirthDate = (date: Date): boolean => {
    const today = new Date()
    const age = differenceInYears(today, date)

    if (isAfter(date, today)) {
      setError('La fecha de nacimiento no puede ser en el futuro')
      return false
    }

    if (age < 18) {
      setError('Debes tener al menos 18 años')
      return false
    }

    if (age > 120) {
      setError('La fecha de nacimiento parece ser inválida')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateBirthDate(formData.birthDate)) {
      onNext(formData)
    }
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
            onChange={(e) => {
              const newDate = new Date(e.target.value)
              setFormData({ ...formData, birthDate: newDate })
              validateBirthDate(newDate)
            }}
            className="border-blue-200 focus:border-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
