'use client'
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
export default function LoginPage() {

    return (
        <div className="bg-background text-foreground min-h-[100vh] flex flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
            <div className="mt-10">
                <ThemeToggle />
            </div>

        </div>
    );
}
