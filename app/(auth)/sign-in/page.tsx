'use client'
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
    // Step 1: Define the toggle function inside the component
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className="bg-background text-foreground min-h-[100vh] flex flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>

            {/* Step 2: Add a button to trigger the toggle */}
            <button
                onClick={toggleDarkMode}
                className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Toggle Dark Mode
            </button>
        </div>
    );
}
