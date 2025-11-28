'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FaApple, FaGoogle, FaMeta } from "react-icons/fa6";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/better-auth/client"
import { cn } from "@/lib/utils"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const { data, error: authError } = await authClient.signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            })

            if (authError) {
                setError(authError.message || "Login failed")
                return
            }

            if (data?.url) {
                router.push(data.url)
                return
            }

            router.push("/dashboard")
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Vibe Trading account
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </Field>

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <Field className="grid grid-cols-3 gap-4">
                                <Button variant="outline" type="button">
                                    <span><FaApple /></span>
                                </Button>
                                <Button variant="outline" type="button">
                                    <span><FaGoogle /></span>
                                </Button>
                                <Button variant="outline" type="button">
                                    <span><FaMeta /></span>
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <a href="/sign-up">Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="bg-muted relative hidden min-h-[320px] md:block">
                        <Image
                            src="/bull.jpg"
                            alt="Trading illustration"
                            fill
                            priority
                            className="object-cover dark:brightness-[0.8] dark:grayscale"
                            sizes="(min-width: 768px) 50vw, 100vw"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
