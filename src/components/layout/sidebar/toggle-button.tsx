"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/providers/sidebar-provider";

export function SidebarToggle() {
    const { isCollapsed, toggle } = useSidebar();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="ml-auto mb-4"
            onClick={toggle}
        >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
    );
}