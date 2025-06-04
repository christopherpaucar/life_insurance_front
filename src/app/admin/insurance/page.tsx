'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { useInsurances } from '@/modules/insurances/useInsurances'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconPlus,
} from '@tabler/icons-react'
import { InsuranceFormModal } from '@/modules/insurances/components/InsuranceFormModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { IInsurance } from '@/modules/insurances/interfaces/insurance.interfaces'
import { getEnumLabel } from '@/lib/utils/enum.utils'
import { PaymentFrequency } from '@/modules/insurances/enums/insurance.enums'

export default function AdminInsurancePage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { insurances, isLoading, deleteInsurance } = useInsurances({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedInsurance, setSelectedInsurance] = useState<IInsurance | null>(null)

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [insuranceToDelete, setInsuranceToDelete] = useState<IInsurance | null>(null)

  // Open modal for creating new insurance
  const handleCreateInsurance = () => {
    setModalMode('create')
    setSelectedInsurance(null)
    setModalOpen(true)
  }

  // Open modal for editing insurance
  const handleEditInsurance = (insurance: IInsurance) => {
    setModalMode('edit')
    setSelectedInsurance(insurance)
    setModalOpen(true)
  }

  // Open modal for confirming deletion
  const handleDeleteConfirmation = (insurance: IInsurance) => {
    setInsuranceToDelete(insurance)
    setDeleteModalOpen(true)
  }

  // Confirm and execute deletion
  const confirmDelete = () => {
    if (insuranceToDelete) {
      deleteInsurance(insuranceToDelete.id)
      setDeleteModalOpen(false)
      setInsuranceToDelete(null)
    }
  }

  // Close modal and reset state
  const handleCloseModal = () => {
    setModalOpen(false)
    // We'll reset the selectedInsurance after the modal animation completes
    setTimeout(() => {
      if (modalMode === 'edit') {
        setSelectedInsurance(null)
      }
    }, 300)
  }

  const columns: ColumnDef<IInsurance>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => <div>{getEnumLabel(row.getValue('type'))}</div>,
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => <div className="max-w-xl truncate">{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'prices',
      header: () => <div className="text-right">Precio Base (Mensual)</div>,
      cell: ({ row }) => {
        const prices = row.original.prices || []
        return (
          <div className="text-right">
            {prices.length > 0
              ? `$${prices.find((price) => price.frequency === PaymentFrequency.MONTHLY)?.price}`
              : 'No definido'}
          </div>
        )
      },
    },
    {
      accessorKey: 'availablePaymentFrequencies',
      header: 'Frecuencias de Pago',
      cell: ({ row }) => {
        const frequencies = row.original.prices || []

        return (
          <div className="flex flex-wrap gap-1">
            {frequencies.map((price) => {
              return (
                <Badge key={price.frequency} variant="outline" className="text-xs">
                  {getEnumLabel(price.frequency)}
                </Badge>
              )
            })}
            {frequencies.length === 0 && (
              <span className="text-muted-foreground text-xs">No definido</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'coverages',
      header: 'Coberturas',
      cell: ({ row }) => {
        const coverages = row.original.coverages || []
        return (
          <div>
            {coverages.length > 0 ? (
              <span className="text-xs">{coverages.length} cobertura(s)</span>
            ) : (
              <span className="text-muted-foreground text-xs">Ninguno</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'benefits',
      header: 'Beneficios',
      cell: ({ row }) => {
        const benefits = row.original.benefits || []
        return <div>{benefits.length} beneficio(s)</div>
      },
    },
    {
      accessorKey: 'requirements',
      header: 'Requisitos',
      cell: ({ row }) => {
        const requirements = row.original.requirements || []
        return (
          <div>
            {requirements.length > 0 ? (
              <span className="text-xs">{requirements.length} requisito(s)</span>
            ) : (
              <span className="text-muted-foreground text-xs">Ninguno</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'deletedAt',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.getValue('deletedAt') ? 'destructive' : 'default'}>
          {row.getValue('deletedAt') ? 'Inactivo' : 'Activo'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const insurance = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditInsurance(insurance)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteConfirmation(insurance)}
                className="text-red-600"
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: insurances,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <DashboardLayout
      title="Gestión de Seguros"
      description="Administre planes, coberturas y primas"
    >
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button className="ml-auto" onClick={handleCreateInsurance}>
          <IconPlus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Insurance Modal - handles both create and edit */}
      <InsuranceFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        insurance={selectedInsurance ?? undefined}
        mode={modalMode}
        onSave={() => {}}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el seguro{' '}
              <span className="font-medium">{insuranceToDelete?.name}</span>. Esta acción no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
