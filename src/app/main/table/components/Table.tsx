'use client';

import { useState, useEffect } from 'react';
import { TableData } from './types';
import TableRow from './TableRow';
import TableEmptyState from '@/components/features/table/TableEmptyState';
import TableErrorState from '@/components/features/table/TableErrorState';
import TableSkeleton from '@/components/features/table/TableSkeleton';
import { fetchTableData } from '@/lib/api/table';

interface TableProps {
    activeTab: 'dev' | 'prod'; // Explicitly type as union of literal types
}

export default function Table({ activeTab }: TableProps) {
    const [data, setData] = useState<TableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = async (id: string, updatedData: TableData) => {
        try {
            // Your edit implementation
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update data');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            // Your delete implementation
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete data');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchTableData(activeTab);
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [activeTab]);

    if (loading) return <TableSkeleton />;
    if (error) return <TableErrorState error={error} onRetry={() => window.location.reload()} />;
    if (data.length === 0) return <TableEmptyState />;

    return (
        <div className="overflow-x-auto border rounded">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
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
                    {data.map((item) => (
                        <TableRow
                            key={item._id}
                            data={item}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}