'use client';

import { useState } from 'react';
import { TableData } from './types';
import EditForm from './EditForm';

export default function TableRow({
    data,
    onEdit,
    onDelete
}: {
    data: TableData;
    onEdit: (id: string, updatedData: TableData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            {isEditing ? (
                <tr className="bg-gray-50">
                    <td colSpan={9}>
                        <EditForm
                            data={data}
                            onSave={async (updatedData) => {
                                await onEdit(data._id, updatedData);
                                setIsEditing(false);
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    </td>
                </tr>
            ) : (
                <tr>
                    {/* Render normal row data */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        {data.sprint}
                    </td>
                    {/* Other cells */}
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(data._id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
}