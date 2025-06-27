// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"

// export function useAuthRedirect() {
//     const router = useRouter()

//     useEffect(() => {
//         const token = localStorage.getItem("token")
//         if (!token) {
//             router.replace("/auth/login")
//         }
//     }, [router])
// }



// src/hooks/use-auth-redirect.ts
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { isTokenValid } from "@/lib/token"

export function useAuthRedirect(): boolean {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (!token || !isTokenValid(token)) {
            localStorage.removeItem("token")
            toast.error("Session expired. Please log in again.")
            router.replace("/auth/login")
        } else {
            setLoading(false)
        }
    }, [router])

    return loading
}

