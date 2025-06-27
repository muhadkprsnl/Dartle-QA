"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/app/main/loading" // ✅ make sure this is the spinner
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")

        // Simulate API delay
        setTimeout(() => {
            setLoading(false)
            toast.success("Reset link sent to your email!", {
                icon: "📧",
            })
        }, 2000)

        // Example API call:
        // const response = await fetch('/api/auth/forgot-password', {
        //   method: 'POST',
        //   body: JSON.stringify({ email }),
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // })
    }

    if (loading) return <Loading />

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                    <div className="text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
