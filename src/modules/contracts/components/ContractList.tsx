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
import { useState } from 'react'
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
import { getEnumLabel } from '../../insurances/insurances.interfaces'
import { statusColors, statusLabels } from '../constants/contractStatus'

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

  const columns: ColumnDef<Contract>[] = [
    {
      accessorFn: (row) => row.insurance.name,
      id: 'insuranceName',
      header: 'Seguro',
      cell: ({ row }) => <div>{row.getValue('insuranceName')}</div>,
    },
    {
      accessorKey: 'contractNumber',
      header: 'Número de contrato',
      cell: ({ row }) => <div>{row.getValue('contractNumber')}</div>,
    },
    {
      accessorFn: (row) => new Date(row.startDate),
      id: 'startDate',
      header: 'Fecha de inicio',
      cell: ({ row }) => <div>{format(row.getValue('startDate'), 'PPP', { locale: es })}</div>,
    },
    {
      accessorFn: (row) => new Date(row.endDate),
      id: 'endDate',
      header: 'Fecha de fin',
      cell: ({ row }) => <div>{format(row.getValue('endDate'), 'PPP', { locale: es })}</div>,
    },
    {
      accessorKey: 'paymentFrequency',
      header: 'Frecuencia de pago',
      cell: ({ row }) => (
        <div className="capitalize">{getEnumLabel(row.getValue('paymentFrequency'))}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status')
        return (
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {statusLabels[status as keyof typeof statusLabels]}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const contract = row.original

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedContractId(contract.id)}>
              <FileText className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
            {contract.signatureUrl && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            )}
          </div>
        )
      },
    },
  ]

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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
