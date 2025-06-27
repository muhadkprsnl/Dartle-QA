

// "use client";

// import { SidebarProvider } from "@/components/providers/sidebar-provider";
// import { Sidebar } from "@/components/layout/sidebar/sidebar";
// import { NavigationProgress } from "@/components/navigation-progress";
// import { useAuthRedirect } from "@/hooks/auth-redirect"
// import Loading from "./loading"

// export default function MainLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {

//     const loading = useAuthRedirect()

//     if (loading) return <Loading /> // 🔒 show spinner while checking token

//     return (
//         <SidebarProvider>
//             <NavigationProgress />
//             <div className="flex h-screen w-full bg-gray-50">
//                 <Sidebar />
//                 <main className="flex-1 overflow-auto">
//                     {children}
//                 </main>
//             </div>
//         </SidebarProvider>
//     );
// }



// src/app/(main)/layout.tsx
"use client";

import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { Sidebar } from "@/components/layout/sidebar/sidebar";
import { NavigationProgress } from "@/components/navigation-progress";
import { useAuthRedirect } from "@/hooks/auth-redirect";
import { Footer } from "@/components/layout/footer";
import Loading from "./loading";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const loading = useAuthRedirect();

    if (loading) return <Loading />;

    return (
        <SidebarProvider>
            <NavigationProgress />
            <div className="flex min-h-screen w-full bg-gray-50"> {/* Changed from h-screen to min-h-screen */}
                <Sidebar />
                <div className="flex-1 flex flex-col"> {/* Removed min-h-screen here */}
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </SidebarProvider>
    );
}