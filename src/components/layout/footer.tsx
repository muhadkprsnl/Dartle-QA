// src/components/layout/footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Button } from "@/components/ui/button"; // Import your button component

export function Footer() {
    const { isCollapsed } = useSidebar();

    return (
        <footer className={cn(
            "w-full bg-black text-white border-t border-gray-800",
            "h-16 flex items-center mt-auto"
        )}>
            <div className={cn(
                "mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-8",
                "transition-[max-width] duration-300 ease-in-out",
                isCollapsed ? "max-w-[calc(100%-4rem)]" : "max-w-[calc(100%-16rem)]"
            )}>
                <Button
                    asChild
                    variant="ghost"
                    className="hover:bg-gray-900 p-2 h-auto" // Custom button styling
                >
                    <Link href="https://academy.dartle.app/" className="flex items-center gap-2">
                        <Image
                            src="https://academy-dev.dartle.app/images/dartle_logo_navbar.png"
                            alt="Dartle Logo"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                        />
                        <span className="text-sm font-medium">Dartle</span>
                    </Link>
                </Button>
                <div className="text-sm text-gray-400">v1.0.0</div>
            </div>
        </footer>
    );
}