"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Instead of importing the type manually, we extract it from the component itself.
// This prevents the "Export doesn't exist" error.
export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}