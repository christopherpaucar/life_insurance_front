import { ContractStatus } from '../contract.interfaces'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { ContractDetails } from './ContractDetails'
import { useContract } from '../hooks/useContract'
import { getEnumLabel } from '../../../lib/utils/enum.utils'
import { statusColors, statusLabels } from '../constants/contractStatus'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

interface Contract {
  id: string
  contractNumber: string
  startDate: string
  endDate: string
  paymentFrequency: string
  status: ContractStatus
  signatureUrl?: string
  insurance: {
    name: string
  }
}

export function ContractList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)

  const { contracts, isLoading } = useContract()

  const handleEdit = (contract: Contract) => {
    setSelectedContractId(contract.id)
  }

  const handleDelete = (contract: Contract) => {
    setSelectedContractId(contract.id)
  }

  const columns = useMemo<ColumnDef<Contract>[]>(
    () => [
      {
        accessorKey: 'insurance',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Seguro
            {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
          </Button>
        ),
        cell: ({ row }) => row.original.insurance.name,
      },
      {
        accessorKey: 'contractNumber',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Número de contrato
            {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
          </Button>
        ),
        cell: ({ row }) => row.original.contractNumber,
      },
      {
        accessorKey: 'startDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fecha de inicio
            {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
          </Button>
        ),
        cell: ({ row }) => format(new Date(row.original.startDate), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'endDate',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fecha de fin
            {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
          </Button>
        ),
        cell: ({ row }) => format(new Date(row.original.endDate), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Estado
            {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
          </Button>
        ),
        cell: ({ row }) => (
          <Badge className={statusColors[row.original.status as keyof typeof statusColors]}>
            {statusLabels[row.original.status as keyof typeof statusLabels]}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedContractId(row.original.id)}>
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(row.original.signatureUrl, '_blank')}>
                Descargar
              </DropdownMenuItem>
              {row.original.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  Editar
                </DropdownMenuItem>
              )}
              {row.original.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleEdit, handleDelete]
  )

  const table = useReactTable({
    data: contracts || [],
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (selectedContractId) {
    return (
      <div>
        <Button variant="outline" onClick={() => setSelectedContractId(null)} className="mb-4">
          Volver a la lista
        </Button>
        <ContractDetails contractId={selectedContractId} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por número de contrato..."
          value={(table.getColumn('contractNumber')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('contractNumber')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-4">
          <Select
            value={(table.getColumn('status')?.getFilterValue() as ContractStatus | 'ALL') ?? 'ALL'}
            onValueChange={(value: ContractStatus | 'ALL') =>
              table.getColumn('status')?.setFilterValue(value === 'ALL' ? '' : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {Object.values(ContractStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            {table.getRowModel().rows?.length ? (
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
                  No hay contratos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} contrato(s) en total.
        </div>
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
    </div>
  )
}
