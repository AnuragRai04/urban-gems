// frontend/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "ug_token";

// Retrieve the secret using the same logic as our auth.ts
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    return new TextEncoder().encode("super-secret-development-key-only");
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;
  let payload: any = null;

  // 1 & 2. Read and verify the token
  if (token) {
    try {
      const secret = getJwtSecretKey();
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
      isAuthenticated = true;
    } catch (error) {
      // Token is invalid, expired, or malformed
      isAuthenticated = false;
    }
  }

  const { pathname } = request.nextUrl;

  // Protected route logic using regex
  const isProtectedRoute = 
    pathname === "/places/new" || 
    /^\/places\/[^/]+\/edit$/.test(pathname) || 
    pathname.startsWith("/profile");

  // 5. Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Save the attempted URL
    return NextResponse.redirect(loginUrl);
  }

  // 3 & 4. Setup request headers for downstream Server Components
  const requestHeaders = new Headers(request.headers);

  if (isAuthenticated && payload) {
    requestHeaders.set("x-authenticated", "true");
    if (payload.id) requestHeaders.set("x-user-id", payload.id as string);
    if (payload.username) requestHeaders.set("x-username", payload.username as string);
    if (payload.email) requestHeaders.set("x-user-email", payload.email as string);
  } else {
    requestHeaders.set("x-authenticated", "false");
  }

  // Pass the cloned and modified headers to the next middleware or route handler
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Config to run middleware on all routes EXCEPT static assets and Next.js internals
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};