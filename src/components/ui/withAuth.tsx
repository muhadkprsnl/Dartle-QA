

"use client"

import React from "react"
import { useAuthRedirect } from "@/hooks/auth-redirect"
import Loading from "@/app/main/loading"

export default function withAuth<P extends object>(
    Component: React.ComponentType<P>
) {
    return function ProtectedComponent(props: P) {
        const loading = useAuthRedirect()

        if (loading) return <Loading />
        return <Component {...props} />
    }
}