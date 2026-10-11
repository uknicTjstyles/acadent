import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "acadent_session";
const MAX_AGE = 60 * 60 * 24 * 7;

export type Session = { userId: string; name: string; email: string };

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is missing. Add it to .env.local");
  return new TextEncoder().encode(secret);
}

function isSessionPayload(payload: Record<string, unknown>): payload is Record<string, string> {
  return (
    typeof payload.userId === "string" &&
    typeof payload.name === "string" &&
    typeof payload.email === "string"
  );
}

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = getSecret();
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!isSessionPayload(payload)) return null;
    return {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
