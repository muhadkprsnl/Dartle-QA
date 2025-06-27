// src/lib/logout.ts
import toast from "react-hot-toast"

export function logout() {
    localStorage.removeItem("token") // remove JWT
    toast.success("Logged out successfully 👋", {
        duration: 3000
    })


    window.location.href = "/auth/login" // full redirect
}
