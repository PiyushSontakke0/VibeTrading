import { createAuthClient } from "better-auth/react";

const PROTOCOL_REGEX = /^https?:\/\//i;

function normalizeURL(url: string) {
    return url.replace(/\/+$/, "");
}

function resolveOrigin() {
    const deploymentOrigin =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        process.env.VERCEL_URL;

    const origin = deploymentOrigin
        ? deploymentOrigin.startsWith("http")
            ? deploymentOrigin
            : `https://${deploymentOrigin}`
        : "http://localhost:3000";

    return normalizeURL(origin);
}

function resolveBaseURL() {
    const explicit = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    const origin = resolveOrigin();

    if (explicit) {
        const trimmed = normalizeURL(explicit);

        if (PROTOCOL_REGEX.test(trimmed)) {
            return trimmed;
        }

        const relativePath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return `${origin}${relativePath}`;
    }

    return `${origin}/api/auth`;
}

export const authClient = createAuthClient({
    baseURL: resolveBaseURL(),
});