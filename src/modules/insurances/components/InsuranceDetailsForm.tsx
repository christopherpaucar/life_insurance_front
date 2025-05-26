import { useState, useCallback } from 'react'
import { useCoverages } from '../useCoverages'
import { useBenefits } from '../useBenefits'
import { InsuranceCoverageRelationDto, InsuranceBenefitRelationDto } from '../insurances.interfaces'
import { CoverageBenefitSelector } from './CoverageBenefitSelector'

export const InsuranceDetailsForm: React.FC<{
  coverages: InsuranceCoverageRelationDto[]
  benefits: InsuranceBenefitRelationDto[]
  addCoverages: (coverages: InsuranceCoverageRelationDto[]) => void
  addBenefits: (benefits: InsuranceBenefitRelationDto[]) => void
}> = ({ coverages, benefits, addCoverages, addBenefits }) => {
  const [selectedCoverages, setSelectedCoverages] =
    useState<InsuranceCoverageRelationDto[]>(coverages)
  const [selectedBenefits, setSelectedBenefits] = useState<InsuranceBenefitRelationDto[]>(benefits)

  const { coverages: availableCoverages } = useCoverages()
  const { benefits: availableBenefits } = useBenefits()

  const handleCoverageChange = useCallback((newCoverages: InsuranceCoverageRelationDto[]) => {
    setSelectedCoverages(newCoverages)
    addCoverages(newCoverages)
  }, [])

  const handleBenefitChange = useCallback((newBenefits: InsuranceBenefitRelationDto[]) => {
    setSelectedBenefits(newBenefits)
    addBenefits(newBenefits)
  }, [])

  const handleCoverageDelete = useCallback((coverage: InsuranceCoverageRelationDto) => {
    console.log('coverage', coverage)

    if (selectedCoverages.some((c) => c.id === coverage.id)) {
      addCoverages([
        ...selectedCoverages.filter((c) => c.id !== coverage.id),
        {
          ...coverage,
          delete: true,
        },
      ])
    }

    setSelectedCoverages(selectedCoverages.filter((c) => c.id !== coverage.id))
  }, [])

  const handleBenefitDelete = useCallback((benefit: InsuranceBenefitRelationDto) => {
    if (selectedBenefits.some((b) => b.id === benefit.id)) {
      addBenefits([
        ...selectedBenefits.filter((b) => b.id !== benefit.id),
        {
          ...benefit,
          delete: true,
        },
      ])
    }

    setSelectedBenefits(selectedBenefits.filter((b) => b.id !== benefit.id))
  }, [])

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
      <div className="space-y-6">
        <CoverageBenefitSelector
          availableCoverages={availableCoverages}
          availableBenefits={availableBenefits}
          selectedCoverages={selectedCoverages}
          selectedBenefits={selectedBenefits}
          onCoverageChange={handleCoverageChange}
          onBenefitChange={handleBenefitChange}
          onCoverageDelete={handleCoverageDelete}
          onBenefitDelete={handleBenefitDelete}
        />
      </div>
    </div>
  )
}
