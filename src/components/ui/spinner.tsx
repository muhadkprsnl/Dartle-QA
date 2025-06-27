// export function Spinner({ className }: { className?: string }) {
//     return (
//         <svg
//             className={`animate-spin h-6 w-6 text-gray-500 ${className}`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//         >
//             <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//             ></circle>
//             <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8z"
//             ></path>
//         </svg>
//     );
// }



import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    text?: string;
    size?: "sm" | "md" | "lg";
}

export function Spinner({
    text = "Loading...",
    size = "md",
    className,
    ...props
}: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
    };

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-current",
                className
            )}
            {...props}
        >
            <Loader2 className={cn(
                "animate-spin",
                sizeClasses[size]
            )} />
            {text && <span className="text-sm">{text}</span>}
        </div>
    );
}