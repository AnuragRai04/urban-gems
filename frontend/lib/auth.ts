// frontend/lib/auth.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { AuthUser } from "../types";

export const COOKIE_NAME = "ug_token";

// Convert the string secret into the Uint8Array format required by `jose`
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    // Provide a fallback for development if the env var isn't loaded yet
    return new TextEncoder().encode("super-secret-development-key-only");
  }
  return new TextEncoder().encode(secret);
};

export interface UserPayload extends JWTPayload {
  id: string;
  username: string;
  email: string;
}

export async function signToken(user: AuthUser): Promise<string> {
  const secret = getJwtSecretKey();
  
  return new SignJWT({
    id: user._id,
    username: user.username,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);
    
    // Cast the verified payload to our custom interface
    return payload as UserPayload;
  } catch (error) {
    // If token is invalid, expired, or malformed, gracefully return null
    return null;
  }
}

export function getRawToken(): string | undefined {
  // `cookies()` must be called dynamically inside Server Components or Server Actions
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const token = getRawToken();
  if (!token) {
    return null;
  }
  
  return await verifyToken(token);
}