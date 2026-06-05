import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner";



interface DataTableActions<TData> {
    onView?: (data: TData) => void
    onEdit?: (data: TData) => void
    onDelete?: (data: TData) => void
}


interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    actions?: DataTableActions<TData>;
    emptyMessage?: string;
    isLoading?: boolean;
    sorting?: {
        state: SortingState
        onSortingChange: (state: SortingState) => void
    }
}
const DataTable = <TData,>({ data, columns, actions, emptyMessage, isLoading, sorting }: DataTableProps<TData>) => {


    const tableColums: ColumnDef<TData>[] = actions ? [...columns,
    // action colums
    {
        id: "action",
        header: "action",
        enableSorting: false,
        cell: ({ row }) => {
            const rowData = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant={"ghost"} className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {actions?.onView && (
                            <DropdownMenuItem onClick={() => actions.onView?.(rowData)}>
                                View
                            </DropdownMenuItem>
                        )}
                        {actions?.onEdit && (
                            <DropdownMenuItem onClick={() => actions.onEdit?.(rowData)}>
                                Edit
                            </DropdownMenuItem>
                        )}
                        {actions?.onDelete && (
                            <DropdownMenuItem onClick={() => actions.onDelete?.(rowData)}>
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu >
            )
        }

    }

    ] : columns

    const { getHeaderGroups, getRowModel } = useReactTable({
        data,
        columns: tableColums,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualFiltering: !!sorting,
        state: {
            ...sorting ? { sorting: sorting.state } : {}
        },
        onSortingChange: sorting ?
            (updater) => {
                const currentSortingState = sorting.state
                const nextSortingState = typeof updater === "function" ? updater(currentSortingState) : updater
                sorting.onSortingChange(nextSortingState)
            }
            : undefined
    })


    return (
        <div className="relative">
            {
                isLoading && (
                    <div className="flex items-center justify-center">
                        < Spinner />
                    </div>
                )
            }
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        {getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {
                                            header.isPlaceholder ? null : header.column.getCanSort() ?
                                                (<Button
                                                    variant={"ghost"}
                                                    onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getIsSorted() === "asc" ?
                                                        < ArrowUp className="ml-1 h-4 w-4 opacity-50" />
                                                        : header.column.getIsSorted() === "desc" ? < ArrowDown className="ml-1 h-4 w-4 opacity-50" /> : ""}
                                                </Button>)
                                                : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>


                    <TableBody>
                        {getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {emptyMessage || "No data available"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataTable