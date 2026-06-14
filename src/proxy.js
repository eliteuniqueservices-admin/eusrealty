import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export function proxy(req) {
  return auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isAdmin = req.auth?.user?.role === "admin";

    // Check login page redirect
    if (nextUrl.pathname === "/login") {
      return Response.redirect(new URL("/admin/login", nextUrl));
    }

    // API protection
    if (nextUrl.pathname.startsWith("/api/")) {
      const isAdminApi = nextUrl.pathname.startsWith("/api/leads") ||
                         nextUrl.pathname.startsWith("/api/employees") ||
                         nextUrl.pathname.startsWith("/api/notifications") ||
                         nextUrl.pathname.startsWith("/api/upload") ||
                         nextUrl.pathname.startsWith("/api/job-applications");
      if (isAdminApi) {
        if (!isLoggedIn || !isAdmin) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      return;
    }

    // Admin routes protection
    const isAuthPage = nextUrl.pathname.startsWith("/admin/login");
    const isAdminRoute = nextUrl.pathname.startsWith("/admin") && !isAuthPage;

    if (isAdminRoute) {
      if (!isLoggedIn) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
          callbackUrl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(
          new URL(`/admin/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
      }
      if (!isAdmin) {
        return Response.redirect(new URL("/", nextUrl));
      }
    }

    if (isAuthPage && isLoggedIn) {
      if (isAdmin) {
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }
    }
  })(req);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/api/leads/:path*",
    "/api/employees/:path*",
    "/api/notifications/:path*",
    "/api/upload/:path*",
    "/api/job-applications/:path*",
  ],
};

