import React, { useState } from 'react'
import { usePayments } from '../usePayments'
import { ITransaction } from '../payments.interface'
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
import { Badge } from '@/components/ui/badge'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces'

export function PaymentsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { payments } = usePayments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const getPaymentMethodTypeLabel = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
        return 'Tarjeta de Crédito'
      case PaymentMethodType.DEBIT_CARD:
        return 'Tarjeta de Débito'
      default:
        return type
    }
  }

  const columns: ColumnDef<ITransaction>[] = [
    {
      accessorKey: 'amount',
      header: 'Monto',
      cell: ({ row }) => (
        <div className="font-medium">${Number(row.getValue('amount')).toLocaleString('es-CL')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.getValue('status') === 'completed' ? 'default' : 'secondary'}>
          {row.getValue('status') === 'completed' ? 'Completado' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      accessorKey: 'contract.contractNumber',
      header: 'Contrato',
      cell: ({ row }) => <div>{row.original.contract.contractNumber}</div>,
    },
    {
      accessorKey: 'nextPaymentDate',
      header: 'Fecha de Pago',
      cell: ({ row }) => <div>{row.getValue('nextPaymentDate')}</div>,
    },
    {
      accessorKey: 'nextRetryPaymentDate',
      header: 'Próximo Pago',
      cell: ({ row }) => <div>{row.getValue('nextRetryPaymentDate')}</div>,
    },
    {
      accessorKey: 'retryCount',
      header: 'Intentos de cobro',
      cell: ({ row }) => <div>{row.original.retryCount}</div>,
    },
  ]

  const table = useReactTable({
    data: payments,
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

  console.log(payments)

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por monto..."
          value={(table.getColumn('amount')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('amount')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
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
                  No hay resultados.
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
    </div>
  )
}
