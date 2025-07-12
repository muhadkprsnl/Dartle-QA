import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

export default function TableEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileSearch className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No data found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                There are no records to display. Try adjusting your filters or create a new entry.
            </p>
            <Button variant="outline">
                Create New Report
            </Button>
        </div>
    );
}