import { NextRequest } from "next/server";
import { getAuth } from "@/lib/better-auth/auth";

const handler = async (request: NextRequest) => {
    const auth = await getAuth();
    return auth.handler(request);
};

export const GET = handler;
export const POST = handler;

