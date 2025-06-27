// "use client";

// import { SidebarItems } from "./sidebar-items";
// import { SidebarToggle } from "./toggle-button";
// import { useSidebar } from "@/components/providers/sidebar-provider";

// export function Sidebar() {
//     const { isCollapsed } = useSidebar();

//     return (
//         // <aside
//         //     className={`bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"
//         //         }`}
//         // >
//         <aside
//             className={`bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"
//                 } flex-shrink-0`} // Added flex-shrink-0
//         >
//             <div className="flex flex-col h-full p-4">
//                 <SidebarToggle />
//                 <nav className="flex-1">
//                     <SidebarItems />
//                 </nav>
//             </div>
//         </aside >
//     );
// }

// src/components/layout/sidebar/sidebar.tsx
"use client";

import { SidebarItems } from "./sidebar-items";
import { SidebarToggle } from "./toggle-button";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { UserMenu } from "../user-menu";

export function Sidebar() {
    const { isCollapsed } = useSidebar();

    return (
        <aside
            className={`bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"
                } flex-shrink-0 flex flex-col`}
        >
            <div className="flex flex-col h-full p-4">
                <SidebarToggle />
                <nav className="flex-1">
                    <SidebarItems />
                </nav>

                {/* User menu positioned inside nav bar */}
                <div className="flex items-center justify-center mt-auto py-4">
                    <UserMenu />
                </div>
            </div>
        </aside>
    );
}
