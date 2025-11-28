import { SignUpForm } from "@/components/signup-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function () {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignUpForm />
                <ThemeToggle />
            </div>
        </div>
    )
}
