import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  ICoverage,
  IBenefit,
  InsuranceCoverageRelationDto,
  InsuranceBenefitRelationDto,
} from '../interfaces/insurance.interfaces'
import { Trash2 } from 'lucide-react'

interface CoverageBenefitSelectorProps {
  availableCoverages: ICoverage[]
  availableBenefits: IBenefit[]
  selectedCoverages: InsuranceCoverageRelationDto[]
  selectedBenefits: InsuranceBenefitRelationDto[]
  onCoverageChange: (coverages: InsuranceCoverageRelationDto[]) => void
  onBenefitChange: (benefits: InsuranceBenefitRelationDto[]) => void
  onCoverageDelete: (coverage: InsuranceCoverageRelationDto) => void
  onBenefitDelete: (benefit: InsuranceBenefitRelationDto) => void
}

export const CoverageBenefitSelector: React.FC<CoverageBenefitSelectorProps> = ({
  availableCoverages,
  availableBenefits,
  selectedCoverages,
  selectedBenefits,
  onCoverageChange,
  onBenefitChange,
  onCoverageDelete,
  onBenefitDelete,
}) => {
  const handleCoverageSelect = useCallback(
    (coverageId: string) => {
      const coverage = availableCoverages.find((c) => c.id === coverageId)
      if (!coverage) return

      const existingCoverage = selectedCoverages.find((c) => c.id === coverageId)
      if (existingCoverage) return

      const newCoverage: InsuranceCoverageRelationDto = {
        id: coverage.id,
        coverageAmount: 0,
        additionalCost: 0,
      }

      onCoverageChange([...selectedCoverages, newCoverage])
    },
    [availableCoverages, selectedCoverages, onCoverageChange]
  )

  const handleBenefitSelect = useCallback(
    (benefitId: string) => {
      const benefit = availableBenefits.find((b) => b.id === benefitId)
      if (!benefit) return

      const existingBenefit = selectedBenefits.find((b) => b.id === benefitId)
      if (existingBenefit) return

      const newBenefit: InsuranceBenefitRelationDto = {
        id: benefit.id,
        additionalCost: 0,
      }

      onBenefitChange([...selectedBenefits, newBenefit])
    },
    [availableBenefits, selectedBenefits, onBenefitChange]
  )

  const handleCoverageAmountChange = useCallback(
    (coverageId: string, amount: number) => {
      const updatedCoverages = selectedCoverages.map((coverage) =>
        coverage.id === coverageId ? { ...coverage, coverageAmount: amount } : coverage
      )
      onCoverageChange(updatedCoverages)
    },
    [selectedCoverages, onCoverageChange]
  )

  const handleCoverageCostChange = useCallback(
    (coverageId: string, cost: number) => {
      const updatedCoverages = selectedCoverages.map((coverage) =>
        coverage.id === coverageId ? { ...coverage, additionalCost: cost } : coverage
      )
      onCoverageChange(updatedCoverages)
    },
    [selectedCoverages, onCoverageChange]
  )

  const handleBenefitCostChange = useCallback(
    (benefitId: string, cost: number) => {
      const updatedBenefits = selectedBenefits.map((benefit) =>
        benefit.id === benefitId ? { ...benefit, additionalCost: cost } : benefit
      )
      onBenefitChange(updatedBenefits)
    },
    [selectedBenefits, onBenefitChange]
  )

  const handleRemoveCoverage = useCallback(
    (coverage: InsuranceCoverageRelationDto) => {
      onCoverageDelete(coverage)
    },
    [onCoverageDelete]
  )

  const handleRemoveBenefit = useCallback(
    (benefit: InsuranceBenefitRelationDto) => {
      onBenefitDelete(benefit)
    },
    [onBenefitDelete]
  )

  const getAvailableCoverages = useCallback(() => {
    return availableCoverages.filter(
      (coverage) => !selectedCoverages.some((selected) => selected.id === coverage.id)
    )
  }, [availableCoverages, selectedCoverages])

  const getAvailableBenefits = useCallback(() => {
    return availableBenefits.filter(
      (benefit) => !selectedBenefits.some((selected) => selected.id === benefit.id)
    )
  }, [availableBenefits, selectedBenefits])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coberturas</CardTitle>
          <Select onValueChange={handleCoverageSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar cobertura" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCoverages().map((coverage) => (
                <SelectItem key={coverage.id} value={coverage.id}>
                  {coverage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCoverages.map((selectedCoverage) => {
              const coverage = availableCoverages.find((c) => c.id === selectedCoverage.id)
              if (!coverage) return null

              return (
                <div
                  key={coverage.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-medium">{coverage.name}</h4>
                      <p className="text-sm text-muted-foreground">{coverage.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`coverage-amount-${coverage.id}`}>Monto de cobertura</Label>
                        <Input
                          id={`coverage-amount-${coverage.id}`}
                          type="number"
                          value={selectedCoverage.coverageAmount}
                          onChange={(e) =>
                            handleCoverageAmountChange(coverage.id, Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`coverage-cost-${coverage.id}`}>Costo adicional</Label>
                        <Input
                          id={`coverage-cost-${coverage.id}`}
                          type="number"
                          value={selectedCoverage.additionalCost}
                          onChange={(e) =>
                            handleCoverageCostChange(coverage.id, Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCoverage(selectedCoverage)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
            {selectedCoverages.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No hay coberturas seleccionadas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Beneficios</CardTitle>
          <Select onValueChange={handleBenefitSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar beneficio" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableBenefits().map((benefit) => (
                <SelectItem key={benefit.id} value={benefit.id}>
                  {benefit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedBenefits.map((selectedBenefit) => {
              const benefit = availableBenefits.find((b) => b.id === selectedBenefit.id)
              if (!benefit) return null

              return (
                <div
                  key={benefit.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-4 flex-1">
                    <div>
                      <h4 className="font-medium">{benefit.name}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`benefit-cost-${benefit.id}`}>Costo adicional</Label>
                      <Input
                        id={`benefit-cost-${benefit.id}`}
                        type="number"
                        value={selectedBenefit.additionalCost}
                        onChange={(e) =>
                          handleBenefitCostChange(benefit.id, Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBenefit(selectedBenefit)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
            {selectedBenefits.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No hay beneficios seleccionados
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
