"use client";

import { useState, ReactNode } from "react";
import { Button } from "./button";

interface Column<T> {
    header: string;
    accessorKey: keyof T | ((row: T) => ReactNode);
    cell?: (row: T) => ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchKey?: keyof T;
    onSearch?: (value: string) => void;
    pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchKey,
    pageSize = 10,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter data
    const filteredData = data.filter((item) => {
        if (!searchKey || !searchTerm) return true;
        const value = item[searchKey];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;

        const key = sortConfig.key as keyof T;
        // Handle custom accessor functions if needed, for now assume direct property access for sorting
        // or simple string/number comparison
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="w-full space-y-4">
            {/* Search */}
            {searchKey && (
                <div className="flex items-center">
                    <div className="relative max-w-sm w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-md border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                {columns.map((col, index) => {
                                    const isSortable = col.sortable;
                                    const key = String(col.accessorKey);
                                    return (
                                        <th
                                            key={index}
                                            className={`px-4 py-3 align-middle ${isSortable ? "cursor-pointer hover:bg-muted/80" : ""
                                                }`}
                                            onClick={() => isSortable && handleSort(key)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {col.header}
                                                {isSortable && sortConfig?.key === key && (
                                                    <span className="text-xs">
                                                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row) => (
                                    <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                                        {columns.map((col, index) => (
                                            <td key={index} className="px-4 py-3 align-middle">
                                                {col.cell
                                                    ? col.cell(row)
                                                    : (row[col.accessorKey as keyof T] as ReactNode)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + pageSize, sortedData.length)} of{" "}
                    {sortedData.length} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
