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

const chronicConditions = [
  { value: 'DIABETES', label: 'Diabetes' },
  { value: 'HIPERTENSION', label: 'Hipertensión' },
  { value: 'ASMA', label: 'Asma' },
  { value: 'ARTRITIS', label: 'Artritis' },
  { value: 'ENFERMEDAD_CARDIOVASCULAR', label: 'Enfermedad Cardiovascular' },
  { value: 'CANCER', label: 'Cáncer' },
  { value: 'OTRO', label: 'Otro' },
]

const allergies = [
  { value: 'NINGUNA', label: 'Ninguna' },
  { value: 'PENICILINA', label: 'Penicilina' },
  { value: 'SULFAMIDAS', label: 'Sulfamidas' },
  { value: 'ASPIRINA', label: 'Aspirina' },
  { value: 'ALIMENTOS', label: 'Alimentos' },
  { value: 'OTRO', label: 'Otro' },
]

const surgeries = [
  { value: 'NINGUNA', label: 'Ninguna' },
  { value: 'APENDICECTOMIA', label: 'Apendicectomía' },
  { value: 'CESAREA', label: 'Cesárea' },
  { value: 'ARTROSCOPIA', label: 'Artroscopia' },
  { value: 'OTRO', label: 'Otro' },
]

interface MedicalHistoryStepProps {
  initialData: Partial<IOnboarding>
  onNext: (data: Partial<IOnboarding>) => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function MedicalHistoryStep({
  initialData,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: MedicalHistoryStepProps) {
  const [formData, setFormData] = useState({
    medicalHistory: initialData.medicalHistory || {
      chronicConditions: [],
      allergies: [],
      surgeries: [],
      medications: [],
      familyHistory: '',
      additionalNotes: '',
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  const handleMultiSelect = (key: string, value: string) => {
    const currentValues = formData.medicalHistory[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value]

    setFormData({
      ...formData,
      medicalHistory: {
        ...formData.medicalHistory,
        [key]: newValues,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <Label className="text-blue-700 font-medium mb-4 block">Condiciones Crónicas</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {chronicConditions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={condition.value}
                  checked={formData.medicalHistory.chronicConditions?.includes(condition.value)}
                  onChange={() => handleMultiSelect('chronicConditions', condition.value)}
                  className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor={condition.value} className="text-sm">
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-blue-700 font-medium mb-4 block">Alergias</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {allergies.map((allergy) => (
              <div key={allergy.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={allergy.value}
                  checked={formData.medicalHistory.allergies?.includes(allergy.value)}
                  onChange={() => handleMultiSelect('allergies', allergy.value)}
                  className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor={allergy.value} className="text-sm">
                  {allergy.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-blue-700 font-medium mb-4 block">Cirugías Previas</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {surgeries.map((surgery) => (
              <div key={surgery.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={surgery.value}
                  checked={formData.medicalHistory.surgeries?.includes(surgery.value)}
                  onChange={() => handleMultiSelect('surgeries', surgery.value)}
                  className="h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor={surgery.value} className="text-sm">
                  {surgery.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-blue-700 font-medium mb-2 block">Medicamentos Actuales</Label>
          <Select
            value=""
            onValueChange={(value) => {
              const currentMeds = formData.medicalHistory.medications || []
              if (!currentMeds.includes(value)) {
                setFormData({
                  ...formData,
                  medicalHistory: {
                    ...formData.medicalHistory,
                    medications: [...currentMeds, value],
                  },
                })
              }
            }}
          >
            <SelectTrigger className="border-blue-200 focus:border-blue-500">
              <SelectValue placeholder="Agregar medicamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NINGUNO" className="hover:bg-blue-50">
                Ninguno
              </SelectItem>
              <SelectItem value="ANTIHIPERTENSIVOS" className="hover:bg-blue-50">
                Antihipertensivos
              </SelectItem>
              <SelectItem value="ANTIDIABETICOS" className="hover:bg-blue-50">
                Antidiabéticos
              </SelectItem>
              <SelectItem value="ANTICOAGULANTES" className="hover:bg-blue-50">
                Anticoagulantes
              </SelectItem>
              <SelectItem value="OTRO" className="hover:bg-blue-50">
                Otro
              </SelectItem>
            </SelectContent>
          </Select>
          {formData.medicalHistory.medications?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.medicalHistory.medications.map((med: string) => (
                <div
                  key={med}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {med}
                  <button
                    type="button"
                    onClick={() => {
                      const newMeds = formData.medicalHistory.medications.filter(
                        (m: string) => m !== med
                      )
                      setFormData({
                        ...formData,
                        medicalHistory: {
                          ...formData.medicalHistory,
                          medications: newMeds,
                        },
                      })
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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
          {isLastStep ? 'Completar' : 'Siguiente'}
        </Button>
      </div>
    </form>
  )
}
