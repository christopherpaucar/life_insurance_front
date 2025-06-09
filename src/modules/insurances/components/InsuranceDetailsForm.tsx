import { useState, useCallback, useRef, useEffect } from 'react'
import { useCoverages } from '../useCoverages'
import { useBenefits } from '../useBenefits'
import {
  InsuranceCoverageRelationDto,
  InsuranceBenefitRelationDto,
} from '../interfaces/insurance.interfaces'
import { CoverageBenefitSelector } from './CoverageBenefitSelector'

export const InsuranceDetailsForm: React.FC<{
  coverages: InsuranceCoverageRelationDto[]
  benefits: InsuranceBenefitRelationDto[]
  addCoverages: (coverages: InsuranceCoverageRelationDto[]) => void
  addBenefits: (benefits: InsuranceBenefitRelationDto[]) => void
}> = ({ coverages, benefits, addCoverages, addBenefits }) => {
  const [selectedCoverages, setSelectedCoverages] = useState<InsuranceCoverageRelationDto[]>([])
  const [selectedBenefits, setSelectedBenefits] = useState<InsuranceBenefitRelationDto[]>([])
  const initialCoveragesRef = useRef<InsuranceCoverageRelationDto[]>([])
  const initialBenefitsRef = useRef<InsuranceBenefitRelationDto[]>([])

  const { coverages: availableCoverages } = useCoverages()
  const { benefits: availableBenefits } = useBenefits()

  useEffect(() => {
    setSelectedCoverages(coverages)
    setSelectedBenefits(benefits)
    initialCoveragesRef.current = coverages
    initialBenefitsRef.current = benefits
  }, [coverages, benefits])

  const handleCoverageChange = useCallback(
    (coverage: InsuranceCoverageRelationDto) => {
      setSelectedCoverages((prev) => {
        const exists = prev.some((c) => c.id === coverage.id)
        if (exists) {
          return prev.map((c) => (c.id === coverage.id ? coverage : c))
        }
        return [...prev, coverage]
      })

      const initialCoverage = initialCoveragesRef.current.find((c) => c.id === coverage.id)
      if (!initialCoverage) {
        addCoverages([coverage])
        return
      }

      const hasChanged =
        initialCoverage.coverageAmount !== coverage.coverageAmount ||
        initialCoverage.additionalCost !== coverage.additionalCost

      if (hasChanged) {
        addCoverages([coverage])
      }
    },
    [addCoverages]
  )

  const handleBenefitChange = useCallback(
    (benefit: InsuranceBenefitRelationDto) => {
      setSelectedBenefits((prev) => {
        const exists = prev.some((b) => b.id === benefit.id)
        if (exists) {
          return prev.map((b) => (b.id === benefit.id ? benefit : b))
        }
        return [...prev, benefit]
      })

      const initialBenefit = initialBenefitsRef.current.find((b) => b.id === benefit.id)
      if (!initialBenefit) {
        addBenefits([benefit])
        return
      }

      const hasChanged = initialBenefit.additionalCost !== benefit.additionalCost
      if (hasChanged) {
        addBenefits([benefit])
      }
    },
    [addBenefits]
  )

  const handleCoverageDelete = useCallback(
    (coverage: InsuranceCoverageRelationDto) => {
      setSelectedCoverages((prev) => prev.filter((c) => c.id !== coverage.id))
      const coverageToDelete = { ...coverage, delete: true }
      addCoverages([coverageToDelete])
    },
    [addCoverages]
  )

  const handleBenefitDelete = useCallback(
    (benefit: InsuranceBenefitRelationDto) => {
      setSelectedBenefits((prev) => prev.filter((b) => b.id !== benefit.id))
      const benefitToDelete = { ...benefit, delete: true }
      addBenefits([benefitToDelete])
    },
    [addBenefits]
  )

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
