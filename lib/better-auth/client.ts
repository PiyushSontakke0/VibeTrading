import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // This tells the client where your API route lives
    baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
});