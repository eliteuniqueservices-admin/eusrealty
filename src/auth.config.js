export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  providers: [], // Keep empty here to avoid Node.js modules in Edge runtime
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;
      const isAdmin = auth?.user?.role === "admin";

      if (nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/admin/login', nextUrl));
      }

      if (nextUrl.pathname === '/admin' || nextUrl.pathname === '/admin/') {
        if (isLoggedIn && isAdmin) {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        }
        return Response.redirect(new URL('/admin/login', nextUrl));
      }

      const isAuthPage = nextUrl.pathname.startsWith('/admin/login');
      const isAdminRoute = nextUrl.pathname.startsWith('/admin') && !isAuthPage;

      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false; // Automatically redirects to pages.signIn (/admin/login)
        }
        if (!isAdmin) {
          // If logged in but not as admin, redirect to public home page
          return Response.redirect(new URL('/', nextUrl));
        }
      }

      if (isAuthPage && isLoggedIn) {
        if (isAdmin) {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        }
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET || "this_is_a_fallback_secret_for_development",
};
