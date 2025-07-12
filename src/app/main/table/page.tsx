'use client';
import * as React from "react"; // Add this at the top
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { DateRange } from '@/components/ui/date-range-picker';
import TableToolbar from './components/TableToolbar';
import Loading from '@/app/main/loading';
import { Search, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Developer {
    name: string;
    passed: number;
    failed: number;
}

interface SprintData {
    _id: string;
    sprint: string;
    version: string;
    dueDate: string;
    closeDate: string;
    totalTestCases: number;
    totalBugs: number;
    developers: Developer[];
}

export default function Table() {
    // State management
    const [data, setData] = useState<SprintData[]>([]);
    const [filteredData, setFilteredData] = useState<SprintData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<SprintData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') as 'dev' | 'prod' || 'dev';
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange>({
        from: null,
        to: null,
    });


    // Add this function to filter data by date range
    const filterDataByDateRange = (data: SprintData[], range: DateRange) => {
        if (!range.from && !range.to) return data;

        return data.filter(item => {
            const dueDate = new Date(item.dueDate);
            const closeDate = new Date(item.closeDate);

            const meetsStart = !range.from || dueDate >= new Date(range.from);
            const meetsEnd = !range.to || closeDate <= new Date(range.to);

            return meetsStart && meetsEnd;
        });
    };

    //better deletion handling
    const { addToast } = useToast();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);



    //  Fetch data from API include date filtering
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const env = tab === "dev" ? "development" : "production";

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/table-reports?env=${env}`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const json = await res.json();
                const transformed = json.map((item: any) => ({
                    _id: item._id,
                    sprint: item.sprint,
                    version: item.version,
                    dueDate: item.dueDate.$date ? item.dueDate.$date : item.dueDate,
                    closeDate: item.closeDate.$date ? item.closeDate.$date : item.closeDate,
                    totalTestCases: item.totalTestCases,
                    totalBugs: item.totalBugs,
                    developers: [
                        { name: item.developer1, passed: item.d1Passed, failed: item.d1Failed },
                        { name: item.developer2, passed: item.d2Passed, failed: item.d2Failed },
                    ],
                }));

                // Apply date range filtering to the fetched data
                const filteredByDate = filterDataByDateRange(transformed, dateRange);
                setData(filteredByDate);
                setFilteredData(filteredByDate);
            } catch (error) {
                console.error('❌ Failed to fetch reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tab, dateRange]); // Add dateRange to dependencies

    // Update the search function to include date filtering
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredData(data);
            setIsSearching(false);
            return;
        }

        const term = searchTerm.toLowerCase().trim();
        const results = data.filter(item =>
            item.sprint.toLowerCase().includes(term)
        );

        setFilteredData(results);
        setIsSearching(true);
    };

    // Handle edit function
    const handleEdit = (item: SprintData) => {
        setEditingId(item._id);
        setEditFormData({ ...item });
    };

    // Handle save function
    const handleSave = async () => {
        if (!editingId || !editFormData) return;
        toast.success("Report saved successfully!")

        try {
            const backendData = {
                environment: tab === 'dev' ? 'development' : 'production',
                sprint: editFormData.sprint,
                version: editFormData.version,
                dueDate: new Date(editFormData.dueDate).toISOString(),
                closeDate: new Date(editFormData.closeDate).toISOString(),
                totalTestCases: editFormData.totalTestCases,
                totalBugs: editFormData.totalBugs,
                developer1: editFormData.developers[0]?.name || '',
                d1Passed: editFormData.developers[0]?.passed || 0,
                d1Failed: editFormData.developers[0]?.failed || 0,
                developer2: editFormData.developers[1]?.name || '',
                d2Passed: editFormData.developers[1]?.passed || 0,
                d2Failed: editFormData.developers[1]?.failed || 0
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports?id=${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(backendData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Update failed");
            }

            // Update local state
            setData(data.map(item =>
                item._id === editingId ? {
                    ...editFormData,
                    dueDate: backendData.dueDate,
                    closeDate: backendData.closeDate
                } : item
            ));

            setFilteredData(filteredData.map(item =>
                item._id === editingId ? {
                    ...editFormData,
                    dueDate: backendData.dueDate,
                    closeDate: backendData.closeDate
                } : item
            ));

            setEditingId(null);
            setEditFormData(null);

        } catch (error: any) {
            console.error("Update error:", error);
            alert(`Failed to update record: ${error.message}`);
        }
    };

    // Handle delete function
    // Handle delete confirmation dialog open
    const openDeleteDialog = (id: string) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };


    // Handle actual deletion
    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${itemToDelete}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }

            // Update local state
            setData(data.filter(d => d._id !== itemToDelete));
            setFilteredData(filteredData.filter(d => d._id !== itemToDelete));

            // Show success toast
            addToast({
                title: "Success!",
                description: "Report deleted successfully.",
                type: "success",
                duration: 3000,
            });
        } catch (err: any) {
            console.error("Delete failed:", err);

            // Show error toast
            addToast({
                title: "Delete Failed",
                description: `Failed to delete record: ${err.message}`,
                type: "destructive",
                duration: 5000,
            });
        } finally {
            // Close dialog and reset
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredData(data);
        setIsSearching(false);
    };

    // In page.tsx
    const sortedData = React.useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return dateB - dateA; // Descending order (newest first)
        });
    }, [filteredData]);

    // Loading state
    if (loading) {
        return <Loading />;
    }

    // Main render
    return (
        <div className="overflow-x-auto border rounded">
            <h1 className="text-2xl font-bold mb-6 p-3">Sprint table</h1>

            <TableToolbar
                activeTab={tab}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearch={handleSearch}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this report? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Search status */}
            {isSearching && (
                <div className="px-4 py-2 text-sm text-muted-foreground bg-gray-50 border-b flex justify-between items-center">
                    <div>
                        Showing {filteredData.length} sprints matching "{searchTerm}"
                    </div>
                    <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={handleClearSearch}
                    >
                        Clear search
                    </Button>
                </div>
            )}

            {/* Empty state */}
            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12">
                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isSearching ? "No sprints found" : "No data available"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        {isSearching
                            ? `We couldn't find any sprints matching "${searchTerm}"`
                            : `No ${tab === 'dev' ? 'development' : 'production'} data available`}
                    </p>
                    {isSearching && (
                        <Button
                            variant="outline"
                            onClick={handleClearSearch}
                        >
                            Clear search
                        </Button>
                    )}
                </div>
            )}

            {/* Table */}
            {filteredData.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Sprint</th>
                            <th className="px-6 py-3 text-left">Version</th>
                            <th className="px-6 py-3 text-left">Total Test Cases</th>
                            <th className="px-6 py-3 text-left">Total Bugs</th>
                            <th className="px-6 py-3 text-left">Developer</th>
                            <th className="px-6 py-3 text-left">Total</th>
                            <th className="px-6 py-3 text-left">Passed</th>
                            <th className="px-6 py-3 text-left">Failed</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((item) => ( // Changed from filteredData to sortedData
                            // {
                            //     filteredData.map((item) => (
                            editingId === item._id ? (
                                <tr key={`edit-${item._id}`} className="bg-gray-50">
                                    <td colSpan={11} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Form fields */}
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Sprint</label>
                                                <Input
                                                    value={editFormData?.sprint || ''}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        sprint: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Version</label>
                                                <Input
                                                    value={editFormData?.version || ''}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        version: e.target.value
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                                <Input
                                                    type="date"
                                                    value={editFormData?.dueDate ? new Date(editFormData.dueDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        dueDate: new Date(e.target.value).toISOString()
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Close Date</label>
                                                <Input
                                                    type="date"
                                                    value={editFormData?.closeDate ? new Date(editFormData.closeDate).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        closeDate: new Date(e.target.value).toISOString()
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Total Test Cases</label>
                                                <Input
                                                    type="number"
                                                    value={editFormData?.totalTestCases || 0}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        totalTestCases: parseInt(e.target.value) || 0
                                                    })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Total Bugs</label>
                                                <Input
                                                    type="number"
                                                    value={editFormData?.totalBugs || 0}
                                                    onChange={(e) => setEditFormData({
                                                        ...editFormData!,
                                                        totalBugs: parseInt(e.target.value) || 0
                                                    })}
                                                />
                                            </div>

                                            {/* Developer fields */}
                                            {editFormData?.developers.map((dev, index) => (
                                                <div key={index} className="space-y-2">
                                                    <h4 className="font-medium">Developer {index + 1}</h4>
                                                    <div>
                                                        <Input
                                                            placeholder={`Developer ${index + 1} name`}
                                                            value={dev.name}
                                                            onChange={(e) => {
                                                                const newDevs = [...editFormData.developers];
                                                                newDevs[index].name = e.target.value;
                                                                setEditFormData({
                                                                    ...editFormData,
                                                                    developers: newDevs
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Passed</label>
                                                        <Input
                                                            type="number"
                                                            value={dev.passed}
                                                            onChange={(e) => {
                                                                const newDevs = [...editFormData.developers];
                                                                newDevs[index].passed = parseInt(e.target.value) || 0;
                                                                setEditFormData({
                                                                    ...editFormData,
                                                                    developers: newDevs
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Failed</label>
                                                        <Input
                                                            type="number"
                                                            value={dev.failed}
                                                            onChange={(e) => {
                                                                const newDevs = [...editFormData.developers];
                                                                newDevs[index].failed = parseInt(e.target.value) || 0;
                                                                setEditFormData({
                                                                    ...editFormData,
                                                                    developers: newDevs
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex items-end gap-2">
                                                <Button variant="outline" onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSave}>
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                item.developers.map((dev, index) => (
                                    <tr key={`${item._id}-${index}`}>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={item.developers.length} className="px-6 py-4">{item.sprint}</td>
                                                <td rowSpan={item.developers.length} className="px-6 py-4">{item.version}</td>
                                                <td rowSpan={item.developers.length} className="px-6 py-4">{item.totalTestCases}</td>
                                                <td rowSpan={item.developers.length} className="px-6 py-4">{item.totalBugs}</td>
                                            </>
                                        )}
                                        <td className="px-6 py-4">{dev.name}</td>
                                        <td className="px-6 py-4">{dev.passed + dev.failed}</td>
                                        <td className="px-6 py-4">{dev.passed}</td>
                                        <td className="px-6 py-4">{dev.failed}</td>
                                        {index === 0 && (
                                            // <td rowSpan={item.developers.length} className="px-6 py-4 space-x-2">
                                            //     <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                            //         Edit
                                            //     </Button>
                                            //     <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(item._id)}
                                            //     >
                                            //         Delete
                                            //     </Button>
                                            // </td>
                                            // In your table row
                                            <td rowSpan={item.developers.length} className="px-6 py-4 space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(item._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )
                        ))
                        }
                    </tbody>
                </table>
            )}
        </div>
    );
}