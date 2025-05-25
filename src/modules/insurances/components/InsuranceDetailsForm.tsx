import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { CoverageFormModal } from './CoverageFormModal'
import { BenefitFormModal } from './BenefitFormModal'
import { useCoverages } from '../useCoverages'
import { useBenefits } from '../useBenefits'
import { Coverage, Benefit } from '../insurances.interfaces'
import { formatCurrency } from '@/lib/utils'

export const InsuranceDetailsForm: React.FC = () => {
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false)
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false)
  const [selectedCoverage, setSelectedCoverage] = useState<Coverage | null>(null)
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null)

  const { coverages, deleteCoverage, isDeleting: isDeletingCoverage } = useCoverages()
  const { benefits, deleteBenefit, isDeleting: isDeletingBenefit } = useBenefits()

  const handleEditCoverage = (coverage: Coverage) => {
    setSelectedCoverage(coverage)
    setIsCoverageModalOpen(true)
  }

  const handleEditBenefit = (benefit: Benefit) => {
    setSelectedBenefit(benefit)
    setIsBenefitModalOpen(true)
  }

  const handleDeleteCoverage = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta cobertura?')) {
      deleteCoverage(id)
    }
  }

  const handleDeleteBenefit = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este beneficio?')) {
      deleteBenefit(id)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coberturas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCoverage(null)
              setIsCoverageModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cobertura
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coverages?.map((coverage) => (
              <div
                key={coverage.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{coverage.name}</h4>
                  <p className="text-sm text-muted-foreground">{coverage.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-primary">
                      Cobertura: {formatCurrency(coverage.coverageAmount)}
                    </span>
                    <span className="text-primary">
                      Costo: {formatCurrency(coverage.additionalCost)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleEditCoverage(coverage)}
                    disabled={isDeletingCoverage}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteCoverage(coverage.id)}
                    disabled={isDeletingCoverage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!coverages || coverages.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                No hay coberturas registradas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Beneficios</CardTitle>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => {
              setSelectedBenefit(null)
              setIsBenefitModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Beneficio
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benefits?.map((benefit) => (
              <div
                key={benefit.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{benefit.name}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  <div className="text-sm">
                    <span className="text-primary">
                      Costo: {formatCurrency(benefit.additionalCost)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleEditBenefit(benefit)}
                    disabled={isDeletingBenefit}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => handleDeleteBenefit(benefit.id)}
                    disabled={isDeletingBenefit}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!benefits || benefits.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                No hay beneficios registrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <CoverageFormModal
        isOpen={isCoverageModalOpen}
        onClose={() => {
          setIsCoverageModalOpen(false)
          setSelectedCoverage(null)
        }}
        coverage={selectedCoverage}
        mode={selectedCoverage ? 'edit' : 'create'}
      />

      <BenefitFormModal
        isOpen={isBenefitModalOpen}
        onClose={() => {
          setIsBenefitModalOpen(false)
          setSelectedBenefit(null)
        }}
        benefit={selectedBenefit}
        mode={selectedBenefit ? 'edit' : 'create'}
      />
    </div>
  )
}
