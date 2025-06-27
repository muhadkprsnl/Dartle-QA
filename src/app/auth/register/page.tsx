"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

export default function RegisterPage() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
        const name = formData.get("name")

        // Add your registration logic here
        console.log({ name, email, password })

        // Example: Call your authentication API
        // const response = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   body: JSON.stringify({ name, email, password }),
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline">
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                        <Button variant="outline">
                            <Icons.google className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                            />
                        </div>
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
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}