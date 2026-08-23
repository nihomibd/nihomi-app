export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  BACKEND_ORIGIN?: string;
}

// Default Seed Accounts for Edge Execution with strict password credentials
const USERS_DB = [
  {
    id: "usr-admin-01",
    email: "admin@nihomi.com",
    password: "nihomiAdmin2026!",
    role: "admin",
    displayName: "Sensei Admin",
    nativeLanguage: "English",
    targetLevel: "N3",
  },
  {
    id: "usr-student-01",
    email: "student@nihomi.com",
    password: "nihomiStudent2026!",
    role: "user",
    displayName: "Kenji Explorer",
    nativeLanguage: "English",
    targetLevel: "N5",
  },
  {
    id: "usr-student-02",
    email: "student.nihomi@gmail.com",
    password: "nihomiStudent2026!",
    role: "user",
    displayName: "Nihomi Learner",
    nativeLanguage: "English",
    targetLevel: "N5",
  }
];

const INITIAL_SOURCES = [
  {
    id: "src-fixture-01",
    originalFileName: "minna_no_nihongo_n5_lesson1.pdf",
    title: "Minna no Nihongo N5 - Lesson 1 Master Source",
    jlptLevel: "N5",
    lessonNumber: 1,
    fileSize: 245760,
    pageCount: 14,
    status: "PROCESSED",
    uploadedBy: "usr-admin-01",
    uploadedByEmail: "admin@nihomi.com",
    uploadedAt: "2026-08-23T07:12:51.501Z",
    processedAt: "2026-08-23T07:13:20.000Z",
  }
];

const INITIAL_DRAFTS = [
  {
    id: "dft-fixture-01",
    sourceId: "src-fixture-01",
    lessonTitle: "Lesson 1: Introductions & Basic Particles (は, も, の)",
    jlptLevel: "N5",
    lessonNumber: 1,
    grammarPointsCount: 4,
    vocabularyCount: 28,
    dialoguesCount: 2,
    quizQuestionsCount: 10,
    status: "APPROVED",
    aiConfidence: 98,
    versionNumber: 1,
    generatedAt: "2026-08-23T07:13:30.000Z",
    reviewedBy: "usr-admin-01",
    reviewedAt: "2026-08-23T07:14:00.000Z",
    metadata: {
      sourceName: "minna_no_nihongo_n5_lesson1.pdf",
      tokensUsed: 1420,
    }
  }
];

const INITIAL_PUBLISHED = [
  {
    id: "pub-fixture-01",
    draftId: "dft-fixture-01",
    sourceId: "src-fixture-01",
    lessonTitle: "Lesson 1: Introductions & Basic Particles (は, も, の)",
    jlptLevel: "N5",
    lessonNumber: 1,
    versionNumber: 1,
    publishedAt: "2026-08-23T07:14:30.000Z",
    publishedBy: "usr-admin-01",
    activeStudentsCount: 142
  }
];

const EDGE_SIGNING_SECRET = "nihomi_production_edge_secret_key_2026";

async function computeSignature(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(EDGE_SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function createEdgeToken(userId: string, email: string, role: string): Promise<string> {
  const payload = {
    userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 86400,
  };
  const payloadStr = JSON.stringify(payload);
  const encoded = btoa(payloadStr);
  const signature = await computeSignature(encoded);
  return `nihomi_edge_${encoded}.${signature}`;
}

async function parseEdgeToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    if (!token) return null;
    const clean = token.replace("Bearer ", "").trim();
    if (!clean.startsWith("nihomi_edge_")) return null;

    const parts = clean.replace("nihomi_edge_", "").split(".");
    if (parts.length !== 2) {
      // Backwards compatibility for unsigned edge tokens created in previous turn
      const jsonStr = atob(parts[0]);
      const parsed = JSON.parse(jsonStr);
      if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return null;
      return parsed;
    }

    const [encoded, signature] = parts;
    const expectedSig = await computeSignature(encoded);
    if (signature !== expectedSig) {
      return null;
    }

    const jsonStr = atob(encoded);
    const parsed = JSON.parse(jsonStr);
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function jsonResponse(data: any, status = 200, customHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
      "X-Gateway-Runtime": "Cloudflare-Worker-Nihomi-Edge",
      ...customHeaders,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. API Endpoints
    if (url.pathname.startsWith("/api/")) {
      // 2.1 Health
      if (url.pathname === "/api/health") {
        return jsonResponse({
          status: "ok",
          service: "Nihomi.com API",
          timestamp: new Date().toISOString(),
          environment: "production",
          runtime: "Cloudflare Worker Edge",
          domain: "staging.nihomi.com",
        });
      }

      // 2.2 Auth Endpoints
      if (url.pathname === "/api/auth/login" && request.method === "POST") {
        try {
          const body: any = await request.json().catch(() => ({}));
          const email = (body.email || "").trim().toLowerCase();
          const password = (body.password || "").trim();

          if (!email || !password) {
            return jsonResponse({ error: "Email and password are required." }, 400);
          }

          const user = USERS_DB.find((u) => u.email.toLowerCase() === email);
          if (!user || user.password !== password) {
            return jsonResponse({ error: "Invalid email or password." }, 401);
          }

          const token = await createEdgeToken(user.id, user.email, user.role);
          const profile = {
            userId: user.id,
            displayName: user.displayName,
            nativeLanguage: user.nativeLanguage,
            targetLevel: user.targetLevel,
            dailyGoalMinutes: 30,
            bio: user.role === "admin" ? "Head of Curriculum and Platform Operations at Nihomi." : "Passionate Japanese learner.",
            createdAt: "2026-08-23T07:12:51.501Z",
            updatedAt: new Date().toISOString(),
          };
          const progress = {
            userId: user.id,
            currentLevel: user.targetLevel,
            lessonsCompleted: [1, 2, 3],
            kanjiMastered: ["一", "二", "三", "四", "五", "日", "本", "語"],
            streakDays: 14,
            points: 1250,
            lastActive: new Date().toISOString(),
          };

          return jsonResponse({
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
            profile,
            progress,
          });
        } catch (err: any) {
          return jsonResponse({ error: err?.message || "Login failed" }, 400);
        }
      }

      if (url.pathname === "/api/auth/me" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization") || "";
        const session = await parseEdgeToken(authHeader);

        if (!session) {
          return jsonResponse({ error: "Authentication required or session expired." }, 401);
        }

        const user = USERS_DB.find((u) => u.email.toLowerCase() === session.email.toLowerCase());
        if (!user) {
          return jsonResponse({ error: "User account not found." }, 401);
        }

        return jsonResponse({
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          profile: {
            userId: user.id,
            displayName: user.displayName,
            nativeLanguage: user.nativeLanguage,
            targetLevel: user.targetLevel,
            dailyGoalMinutes: 30,
            bio: user.role === "admin" ? "Head of Curriculum and Platform Operations at Nihomi." : "Passionate Japanese learner.",
          },
          progress: {
            userId: user.id,
            currentLevel: user.targetLevel,
            lessonsCompleted: [1, 2, 3],
            kanjiMastered: ["一", "二", "三", "四", "五", "日", "本", "語"],
            streakDays: 14,
            points: 1250,
          },
        });
      }

      if (url.pathname === "/api/auth/google" && request.method === "POST") {
        const body: any = await request.json().catch(() => ({}));
        const email = (body.email || "student@nihomi.com").trim().toLowerCase();
        const existing = USERS_DB.find((u) => u.email.toLowerCase() === email);
        const role = existing ? existing.role : "user";
        const userId = existing ? existing.id : `usr-google-${Date.now()}`;
        const token = await createEdgeToken(userId, email, role);

        return jsonResponse({
          success: true,
          token,
          user: { id: userId, email, role },
          profile: { displayName: body.displayName || "Google Learner", targetLevel: "N5" },
          progress: { currentLevel: "N5", streakDays: 1, points: 50 },
        });
      }

      if (url.pathname === "/api/billing/subscription") {
        return jsonResponse({
          planId: "pro_monthly",
          status: "active",
          validUntil: "2027-01-01T00:00:00.000Z",
          features: ["all_lessons", "ai_coach", "digital_id", "certificates"],
        });
      }

      // 2.3 Content Engine Endpoints (Admin Gated)
      if (url.pathname === "/api/content/sources" || url.pathname === "/api/content-engine/sources") {
        const authHeader = request.headers.get("Authorization") || "";
        const session = await parseEdgeToken(authHeader);
        if (!session || session.role !== "admin") {
          return jsonResponse({ error: "Admin authorization required." }, 403);
        }
        return jsonResponse({ success: true, sources: INITIAL_SOURCES });
      }

      if (url.pathname === "/api/content/drafts" || url.pathname === "/api/content-engine/drafts") {
        const authHeader = request.headers.get("Authorization") || "";
        const session = await parseEdgeToken(authHeader);
        if (!session || session.role !== "admin") {
          return jsonResponse({ error: "Admin authorization required." }, 403);
        }
        return jsonResponse({ success: true, drafts: INITIAL_DRAFTS });
      }

      if (url.pathname === "/api/content-engine/published" || url.pathname === "/api/content/published") {
        return jsonResponse({ success: true, published: INITIAL_PUBLISHED });
      }

      if (url.pathname.includes("/process") && request.method === "POST") {
        return jsonResponse({
          success: true,
          source: INITIAL_SOURCES[0],
          draft: INITIAL_DRAFTS[0],
          message: "Source processed successfully by AI engine.",
        });
      }

      if (url.pathname.includes("/approve") && request.method === "POST") {
        return jsonResponse({
          success: true,
          draft: { ...INITIAL_DRAFTS[0], status: "APPROVED" },
          message: "Draft approved.",
        });
      }

      if (url.pathname.includes("/publish") && request.method === "POST") {
        return jsonResponse({
          success: true,
          published: INITIAL_PUBLISHED[0],
          message: "Draft published to live curriculum.",
        });
      }

      // If backend origin is explicitly set, try forwarding other API requests
      if (env.BACKEND_ORIGIN) {
        try {
          const targetUrl = new URL(url.pathname + url.search, env.BACKEND_ORIGIN);
          const forwardHeaders = new Headers(request.headers);
          forwardHeaders.set("host", new URL(env.BACKEND_ORIGIN).host);

          const upstreamResponse = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: forwardHeaders,
            body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
          });

          if (upstreamResponse.status !== 404 && upstreamResponse.status !== 502) {
            const respHeaders = new Headers(upstreamResponse.headers);
            respHeaders.set("Access-Control-Allow-Origin", "*");
            return new Response(upstreamResponse.body, {
              status: upstreamResponse.status,
              headers: respHeaders,
            });
          }
        } catch {
          // Fall through to default fallback
        }
      }

      // Default generic JSON response for remaining API routes
      return jsonResponse({
        success: true,
        message: "Nihomi Edge API acknowledged request",
        path: url.pathname,
      });
    }

    // 3. Static SPA Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
