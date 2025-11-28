export { middleware } from "./middleware/index";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/predict/:path*",
        "/watchlist/:path*",
        "/stocks/:path*",
        "/ourteam/:path*",
    ],
};

