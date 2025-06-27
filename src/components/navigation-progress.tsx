"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.configure({ showSpinner: false }); // Optional configuration
        NProgress.done();
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleStart = () => NProgress.start();
        const handleDone = () => NProgress.done();

        // Listen to route changes
        window.addEventListener("routeChangeStart", handleStart);
        window.addEventListener("routeChangeComplete", handleDone);
        window.addEventListener("routeChangeError", handleDone);

        return () => {
            window.removeEventListener("routeChangeStart", handleStart);
            window.removeEventListener("routeChangeComplete", handleDone);
            window.removeEventListener("routeChangeError", handleDone);
        };
    }, []);

    return null;
}