// "use client";

// import { Spinner } from "@/components/ui/spinner";

// export default function Loading() {
//     return (
//         <div className="flex items-center justify-center h-full min-h-[200px]">
//             <Spinner className="w-8 h-8" />
//             <span className="ml-2 text-sm">Loading...</span>
//         </div>
//     );
// }


"use client";

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner size="lg" text="Loading page..." />
        </div>
    );
}