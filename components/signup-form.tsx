'use client'

import { cn } from "@/lib/utils"
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
import { useState } from "react"
import Image from "next/image"
import { Loader2, } from "lucide-react"
import { FaApple, FaGoogle, FaMeta } from "react-icons/fa6";
import { useRouter } from "next/navigation"
import { LoaderD } from "./ui/loader"
import { authClient } from "@/lib/better-auth/client"
export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const { error: authError, data } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/dashboard",
            })

            if (authError) {
                setError(authError.message || "Sign up failed")
                return
            }

            if (data?.user) {
                router.push("/dashboard")
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

    return (<>
        {loading ? (<LoaderD />) : (<div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center mb-2">
                                <h1 className="text-2xl font-bold">Get Started!</h1>
                                <p className="text-muted-foreground text-balance">
                                    Join the community of Vibe Traders!
                                </p>
                            </div>

                            {/* --- CHANGED: Added a grid wrapper for inputs --- */}
                            <div className="grid gap-4">
                                <Field>
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input id="name" name="name" type="text" placeholder="John Doe" required />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" name="email" type="email" placeholder="johndoe@example.com" required />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input id="password" name="password" type="password" required />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                        <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                    </Field>
                                </div>
                            </div>
                            {/* --- END CHANGE --- */}

                            {error && (
                                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                            )}

                            <Field className="mt-4">
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing up...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-4">
                                Or continue with
                            </FieldSeparator>

                            {/* Social buttons (Content omitted for brevity, kept structure) */}
                            <Field className="grid grid-cols-3 gap-4">
                                <Button variant="outline" type="button"><FaApple /></Button>
                                <Button variant="outline" type="button"><FaGoogle /></Button>
                                <Button variant="outline" type="button"><FaMeta /></Button>
                            </Field>

                            <FieldDescription className="text-center mt-4">
                                Already have an account? <a href="/sign-in" className="text-primary hover:underline">Sign In</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="bg-muted relative min-h-[320px] block">
                        <Image
                            src="/bull.jpg" // make sure this is in /public
                            alt="Trading illustration"
                            fill
                            className="object-cover dark:brightness-[0.8] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center text-xs">
                By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
                and <a href="#" className="underline">Privacy Policy</a>.
            </FieldDescription>
        </div>)
        }</>
    )
}
