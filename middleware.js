export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/quiz/:path*", "/admin/:path*", "/leaderboard/:path*"],
};