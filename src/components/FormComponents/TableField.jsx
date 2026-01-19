// components/FormComponents/TableField.jsx
"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw, // Lucide icon for reset
  Download, // Lucide icon for download
  Search, // Lucide icon for search input
  Info
} from "lucide-react"; // Import Lucide icons
import { motion } from "framer-motion";

function LightTable({ columns, data = [], title = "Data", hideId = true }) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const validColumns = Array.isArray(columns) ? columns : [];
  const validData = Array.isArray(data) ? data : [];

  const visibleColumns = useMemo(() => {
    return validColumns.filter((col) => {
      if (!hideId) return true;
      return (
        col.accessorKey !== "id" &&
        (typeof col.header !== "string" || col.header.toLowerCase() !== "id")
      );
    });
  }, [validColumns, hideId]);

  const filteredData = useMemo(() => {
    if (!search) return validData;
    return validData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, validData]);

  const pageCount = Math.max(Math.ceil(filteredData.length / pageSize), 1);

  const snoColumn = {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => pageIndex * pageSize + row.index + 1,
  };

  const table = useReactTable({
    columns: [snoColumn, ...visibleColumns],
    data: filteredData,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const handleDownloadExcel = () => {
    const dataToExport = filteredData.map((row, index) => {
      const item = { "S.No": index + 1 };
      visibleColumns.forEach((col) => {
        const header = col.header;
        const accessorKey = col.accessorKey;
        if (typeof header === "string" && accessorKey) {
          // Use accessorKey to get value from row
          item[header] = row[accessorKey];
        }
      });
      return item;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  const handleResetSearch = () => {
    setSearch("");
    setPageIndex(0);
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-200"> {/* Added border for a cleaner card look */}
      {/* Header with Title, Search, and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"> {/* Increased gap */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2> {/* Use the title prop dynamically */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"> {/* Added flex-col for mobile stacking, increased gap */}
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(0); // Reset to first page on search
              }}
              placeholder="Search data..."
              className="pl-10 pr-4 py-2 text-sm bg-gray-50 placeholder-gray-500 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 w-full sm:w-48 lg:w-64" // Enhanced input style
              aria-label="Search table data"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3"> {/* Group buttons together */}
            {search && ( // Only show reset button if search is active
              <button
                onClick={handleResetSearch}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
                aria-label="Reset search"
                title="Reset Search"
              >
                <RotateCcw size={18} />
              </button>
            )}
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200" // Enhanced export button
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg"> {/* Added border to the table itself, rounded corners */}
        {filteredData.length > 0 ? (
          // IMPORTANT: Ensure NO whitespace (newlines/spaces) between <table>, <thead>, and <tbody> and their direct children.
          // This is the most common cause of hydration errors for tables.
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50">{table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" // Enhanced header styles
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}</thead>
            <tbody className="bg-white divide-y divide-gray-100">{table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }} // More pronounced animation
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: row.index * 0.05 }} // Staggered animation
                  className="hover:bg-gray-50 transition-colors duration-150" // Smooth hover effect
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-gray-700" // Increased padding, default text color
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}</tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Info size={24} className="mx-auto mb-3 text-gray-400" />
            <p>No data available. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600 gap-3"> {/* Increased margin top and gap */}
        {/* Page Info */}
        <div>
          Showing {table.getRowModel().rows.length} of {filteredData.length} entries
          <span className="ml-2 hidden sm:inline"> | Page </span>
          <span className="font-semibold text-gray-800">
            {pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{pageCount}</span>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          Rows per page:
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0); // Reset to first page when page size changes
            }}
            className="border border-gray-300 rounded-md p-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>


        {/* Pagination Buttons */}
        <div className="flex gap-2"> {/* Increased gap between buttons */}
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="First page"
            title="First Page"
          >
            <ChevronsLeft size={18} /> {/* Lucide icon */}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Previous page"
            title="Previous Page"
          >
            <ChevronLeft size={18} /> {/* Lucide icon */}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Next page"
            title="Next Page"
          >
            <ChevronRight size={18} /> {/* Lucide icon */}
          </button>
          <button
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Last page"
            title="Last Page"
          >
            <ChevronsRight size={18} /> {/* Lucide icon */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LightTable;
