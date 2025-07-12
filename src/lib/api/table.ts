import { TableData } from '@/app/main/table/components/types';

export async function fetchTableData(env: 'dev' | 'prod'): Promise<TableData[]> {
    const res = await fetch(`/api/table?env=${env}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export async function updateTableItem(id: string, data: TableData): Promise<TableData> {
    const res = await fetch(`/api/table/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update data');
    return res.json();
}

export async function deleteTableItem(id: string): Promise<void> {
    const res = await fetch(`/api/table/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete data');
}