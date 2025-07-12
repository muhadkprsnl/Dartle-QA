import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableErrorStateProps {
    error: string;
    onRetry?: () => void;
}

export default function TableErrorState({
    error,
    onRetry
}: TableErrorStateProps) {
    return (
        <div className="p-4">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error loading data</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
            {onRetry && (
                <div className="mt-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={onRetry}
                    >
                        Retry
                    </Button>
                </div>
            )}
        </div>
    );
}