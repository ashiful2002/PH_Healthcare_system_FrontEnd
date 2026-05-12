"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDoctors } from "@/services/doctor.services"
import { useQuery } from "@tanstack/react-query"
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

const DoctorsTable = async () => {

    const doctorsColumns = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'specialities', header: 'Specialization' },
        { accessorKey: 'experiance', header: 'Experience' },
        { accessorKey: 'appointMentFee', header: 'Appointment Fee' },
        { accessorKey: 'experiance', header: 'Experiance' },
        { accessorKey: 'qualifications', header: 'Qualifications' },
    ]

    const { data: doctrosDataResponse } = useQuery({
        queryKey: ['doctors'],
        queryFn: getDoctors,
    })
    console.log(doctrosDataResponse);

    const { getHeaderGroups, getRowModel } = useReactTable({ data: doctrosDataResponse?.data || [], columns: doctorsColumns, getCoreRowModel: getCoreRowModel() })

    return (
        <Table>
            <TableHeader>
                {getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                            <TableHead key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>


            <TableBody>
                {getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DoctorsTable