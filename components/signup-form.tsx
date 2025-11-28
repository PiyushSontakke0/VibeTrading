'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion" // 1. Animation Library
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/better-auth/client"
import { ShakeWrapper } from "./ui/shake-wrapper"
// UI Components
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Icons
import { Loader2 } from "lucide-react"
import { FaApple, FaGoogle, FaMeta } from "react-icons/fa6"


// --- Mock Countries List ---
const countries = [
    "United States", "United Kingdom", "India", "Canada", "Australia", "Germany", "France", "Japan"
]

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [selectedCountry, setSelectedCountry] = useState("")

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string
        const country = selectedCountry

        const newErrors: Record<string, string> = {}

        if (!name.trim()) {
            newErrors.name = "Enter the name"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            newErrors.email = "Format for gmail is wrong"
        }

        if (!country) {
            newErrors.country = "Please select a country"
        }

        if (!password || password.length < 8) {
            newErrors.password = "Password is short (min 8 chars)"
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setLoading(false)
            return
        }

        // --- SUBMISSION LOGIC ---
        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/dashboard",
        }, {
            onSuccess: () => {
                router.push("/dashboard")
                router.refresh()
            },
            onError: (ctx) => {
                setErrors({ form: ctx.error.message || "Sign up failed" })
                setLoading(false)
            }
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">

                    {/* Left Side: Form */}
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center mb-6">
                                <h1 className="text-2xl font-bold">Get Started!</h1>
                                <p className="text-muted-foreground text-balance">
                                    Join the community of Vibe Traders!
                                </p>
                            </div>

                            <div className="grid gap-4">

                                {/* Full Name & Country Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="name" className={errors.name ? "text-red-500" : ""}>Full Name</FieldLabel>
                                        <ShakeWrapper isError={!!errors.name}>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Name"
                                                className={errors.name ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : ""}
                                                disabled={loading}
                                            />
                                        </ShakeWrapper>
                                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                    </Field>

                                    <Field>
                                        <FieldLabel className={errors.country ? "text-red-500" : ""}>Country</FieldLabel>
                                        <ShakeWrapper isError={!!errors.country}>
                                            <Select
                                                disabled={loading}
                                                onValueChange={setSelectedCountry}
                                                value={selectedCountry}
                                            >
                                                <SelectTrigger className={errors.country ? "border-red-500 bg-red-50 focus:ring-red-500" : ""}>
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map((c) => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </ShakeWrapper>
                                        {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                                    </Field>
                                </div>

                                {/* Email Field */}
                                <Field>
                                    <FieldLabel htmlFor="email" className={errors.email ? "text-red-500" : ""}>Email</FieldLabel>
                                    <ShakeWrapper isError={!!errors.email}>
                                        <Input
                                            id="email"
                                            name="email"
                                            placeholder="example@gmail.com"
                                            className={errors.email ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : ""}
                                            disabled={loading}
                                        />
                                    </ShakeWrapper>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </Field>

                                {/* Passwords Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password" className={errors.password ? "text-red-500" : ""}>Password</FieldLabel>
                                        <ShakeWrapper isError={!!errors.password}>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                className={errors.password ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : ""}
                                                disabled={loading}
                                            />
                                        </ShakeWrapper>
                                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : ""}>Confirm</FieldLabel>
                                        <ShakeWrapper isError={!!errors.confirmPassword}>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                className={errors.confirmPassword ? "border-red-500 bg-red-50 focus-visible:ring-red-500" : ""}
                                                disabled={loading}
                                            />
                                        </ShakeWrapper>
                                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                                    </Field>
                                </div>
                            </div>

                            {/* Global Form Error (from API) */}
                            {errors.form && (
                                <div className="p-3 mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md text-center animate-in fade-in slide-in-from-top-2">
                                    {errors.form}
                                </div>
                            )}

                            <Field className="mt-4">
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Checking details...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-4">
                                Or continue with
                            </FieldSeparator>

                            <Field className="grid grid-cols-3 gap-4">
                                <Button variant="outline" type="button" disabled={loading}>
                                    <FaApple className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" type="button" disabled={loading}>
                                    <FaGoogle className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" type="button" disabled={loading}>
                                    <FaMeta className="h-4 w-4" />
                                </Button>
                            </Field>

                            <FieldDescription className="text-center mt-4">
                                Already have an account? <a href="/sign-in" className="text-primary hover:underline">Sign In</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    {/* Right Side: Image */}
                    <div className="bg-muted relative hidden md:block h-full min-h-[500px]">
                        <Image
                            src="/bull.jpg"
                            alt="Trading illustration"
                            fill
                            className="object-cover dark:brightness-[0.8] dark:grayscale"
                            priority
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center text-xs">
                By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
                and <a href="#" className="underline">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}