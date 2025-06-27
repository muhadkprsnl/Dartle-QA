"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { LayoutDashboard, Table, FileText } from "lucide-react";

const items = [
    {
        href: "/main/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
    },
    {
        href: "/main/table",
        icon: Table,
        label: "Table View",
    },
    {
        href: "/main/report",
        icon: FileText,
        label: "Report Form",
    },
];

export function SidebarItems() {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();

    return (
        <ul className="space-y-2">
            {items.map((item) => (
                <li key={item.href}>
                    <Link href={item.href} passHref>
                        <Button
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={`w-full justify-start ${isCollapsed ? "justify-center" : ""
                                }`}
                        >
                            <item.icon className={isCollapsed ? "mr-0" : "mr-2"} />
                            {!isCollapsed && item.label}
                        </Button>
                    </Link>
                </li>
            ))}
        </ul>
    );
}