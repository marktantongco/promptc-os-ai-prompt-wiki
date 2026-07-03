import { NextRequest, NextResponse } from "next/server";

// Live 21st.dev component registry search — server-side proxied.
// The browser never sees the API key. Adapted from skill-stack-field-guide's pattern.
//
// Env: API_KEY_21ST (canonical) or TWENTYFIRST_API_KEY (alias)
// Endpoint: https://21st.dev/api/v1/components/search
// Query params: q=<query>, limit=<n>, scope=public (defaults to "team" which is empty)

const API_KEY = process.env.API_KEY_21ST || process.env.TWENTYFIRST_API_KEY || "";
const API_URL = process.env.API_URL_21ST || "https://21st.dev";
const SEARCH_URL = `${API_URL}/api/v1/components/search`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
  const scope = searchParams.get("scope") || "public";

  if (!query.trim()) {
    return NextResponse.json({ error: "Missing 'q' query parameter", results: [] }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({
      error: "21st.dev API key not configured. Set API_KEY_21ST in .env.local",
      results: [],
      hint: "Get a key at https://21st.dev/dashboard",
    }, { status: 401 });
  }

  try {
    const upstreamUrl = `${SEARCH_URL}?q=${encodeURIComponent(query)}&limit=${limit}&scope=${scope}`;
    const upstream = await fetch(upstreamUrl, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      return NextResponse.json({
        error: `21st.dev returned HTTP ${upstream.status}`,
        upstream_error: body.slice(0, 500),
        results: [],
      }, { status: upstream.status });
    }

    const data = await upstream.json();
    // 21st.dev returns { query, scope, results: [...] }
    const rawResults = Array.isArray(data) ? data : (data.results || []);
    return NextResponse.json({
      query,
      scope,
      count: rawResults.length,
      results: rawResults.slice(0, limit).map((c: any) => ({
        id: c.slug || c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        author: c.author || "",
        registry: c.registry || "ui",
        visibility: c.visibility || "public",
        preview: c.preview_url || c.preview || c.thumbnail || "",
        bundle_html_url: c.bundle_html_url || "",
        tags: c.tags || [],
        install_ref: c.install_ref || "",
        install_command: c.install_ref ? `npx twenty-first add ${c.install_ref}` : `npx twenty-first add ${c.slug}`,
        url: c.url || `${API_URL}/components/${c.slug}`,
        updated_at: c.updated_at || "",
        score: c.score || 0,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({
      error: `Failed to fetch from 21st.dev: ${err.message}`,
      results: [],
    }, { status: 502 });
  }
}
