// import React from 'react';
// import { Spinner } from '@/components/ui/spinner';

// const SpinnerWithText = () => {
//     return (
//         <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 text-gray-500">
//                 <Spinner className="w-4 h-4" />
//                 <span>Loading...</span>
//             </div>

//             {/* <div className="flex items-center gap-2 text-red-400">
//                 <Spinner className="w-4 h-4" />
//                 <span>Loading with custom style</span>
//             </div> */}
//         </div>
//     );
// };

// export default SpinnerWithText;


import { Spinner } from "./spinner";
import { cn } from "@/lib/utils"; // Add this import

interface SpinnerWithTextProps {
    text?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function SpinnerWithText({
    text = "Loading data...",
    size = "md",
    className
}: SpinnerWithTextProps) {
    return (
        <div className={cn("flex justify-center p-4", className)}>
            <Spinner size={size} text={text} />
        </div>
    );
}