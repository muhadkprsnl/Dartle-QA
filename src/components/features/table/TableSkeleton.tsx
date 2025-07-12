// src/components/features/table/TableSkeleton.tsx
export default function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {/* Header row */}
            <div className="h-10 bg-gray-200 rounded"></div>

            {/* Table rows */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-9 gap-4">
                    {[...Array(9)].map((_, j) => (
                        <div key={j} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
            ))}
        </div>
    );
}