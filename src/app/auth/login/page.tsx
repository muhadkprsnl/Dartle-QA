

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { authService } from '@/lib/auth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import toast from "react-hot-toast"
import Loading from "@/app/main/loading"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (loading) return <Loading />

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await authService.login(email.toLowerCase(), password)
            router.push('/main/dashboard')
            setLoading(true)
            toast.success("Logged in successfully!")

        } catch (err: any) {
            // ✅ Handle server error response shape
            if (err?.field === "username") {
                toast.error("Username not found", {
                    duration: 3000,
                    icon: "❌"
                })
            } else if (err?.field === "password") {
                toast.error("Incorrect password", {
                    duration: 3000,
                    icon: "🔐"
                })
            } else {
                toast.error("Login failed. Please try again.")
            }
        } finally {
            // ✅ Always stop loading
            setLoading(false)
            // setLoading(true)

        }
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email and password below to login
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline"
                            onClick={() => toast.error("GitHub login not implemented yet", {
                                duration: 3000,
                                icon: "⚠️"
                            })}
                        >
                            <Icons.gitHub className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                        <Button variant="outline"
                            onClick={() => toast.error("Google login not implemented yet", {
                                duration: 3000,
                                icon: "⚠️"
                            })}
                        >
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
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {/* Remember me checkbox can be added here */}
                            </div>
                            {/* <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                onClick={() =>
                                    toast.error("Forgot password not implemented yet", {
                                        duration: 3000,
                                        icon: "⚠️"
                                    })

                                }
                            >
                                Forgot password?
                            </Link> */}

                            <Button
                                variant="link"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                onClick={() => {
                                    toast("Forgot password not implemented yet", {
                                        icon: "⚠️",
                                    })
                                    setLoading(true)
                                    router.push("/auth/forgot-password")
                                }}
                            >
                                Forgot password?
                            </Button>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Button
                            variant="link"
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            onClick={() => {
                                toast("Sign up not implemented yet", {
                                    icon: "⚠️",
                                })
                                setLoading(true)
                                router.push("/auth/register")
                            }}
                        >
                            Sign up
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </CardFooter>
            </Card>
        </div >
    )
}