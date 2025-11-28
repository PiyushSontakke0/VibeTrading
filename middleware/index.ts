import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    // Redirect unauthenticated users trying to reach protected routes
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}
