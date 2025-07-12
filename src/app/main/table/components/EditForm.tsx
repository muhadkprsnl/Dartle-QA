'use client';

import { useState, useEffect } from 'react';
import { TableData } from './types';

export default function EditForm({
    data,
    onSave,
    onCancel
}: {
    data: TableData;
    onSave: (updatedData: TableData) => Promise<void>;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<TableData>(data);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };


    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Form fields */}
                <div>
                    <label className="block text-sm font-medium mb-1">Sprint</label>
                    <input
                        type="text"
                        value={formData.sprint}
                        onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>
                {/* Other fields */}
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 rounded"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Save
                </button>
            </div>
        </form>
    );
}