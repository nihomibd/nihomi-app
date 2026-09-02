import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const googleClient = new OAuth2Client();

export interface VerifiedGoogleIdentity {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

/**
 * Cryptographically verifies a Google OpenID Connect ID token using Google's public keys.
 * Extracts and returns the verified user identity.
 * 
 * Returns null if the token is invalid, expired, or failed signature verification.
 * Zero client-provided claims are trusted without cryptographic verification.
 */
export async function verifyGoogleIdToken(token: string): Promise<VerifiedGoogleIdentity | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const cleanToken = token.trim();
  if (!cleanToken) {
    return null;
  }

  try {
    const audience = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || undefined;

    const ticket = await googleClient.verifyIdToken({
      idToken: cleanToken,
      audience: audience ? audience : undefined,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return null;
    }

    // Reject unverified email addresses from Google
    if (payload.email_verified === false) {
      return null;
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const displayName = payload.name || payload.given_name || cleanEmail.split('@')[0];

    return {
      sub: payload.sub,
      email: cleanEmail,
      name: displayName,
      picture: payload.picture,
      emailVerified: Boolean(payload.email_verified)
    };
  } catch (error: any) {
    // Cryptographic verification failed (expired, invalid signature, or forged)
    // Note: Never log the raw token to preserve security in production
    return null;
  }
}
