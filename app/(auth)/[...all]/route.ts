import { getAuth } from "@/lib/better-auth/auth";

const handler = async (request: Request) => {
    const auth = await getAuth();

    return auth.handler(request);
};

export const GET = handler;
export const POST = handler;