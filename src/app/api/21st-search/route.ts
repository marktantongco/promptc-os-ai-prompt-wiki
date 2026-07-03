import { NextRequest, NextResponse } from "next/server";

// Live 21st.dev component registry search — server-side proxied.
// The browser never sees the API key. Adapted from skill-stack-field-guide's pattern.
//
// Env: API_KEY_21ST (canonical) or TWENTYFIRST_API_KEY (alias)
// Endpoint: https://21st.dev/api/v1/components/search

const API_KEY = process.env.API_KEY_21ST || process.env.TWENTYFIRST_API_KEY || "";
const API_URL = process.env.API_URL_21ST || "https://21st.dev";
const SEARCH_URL = `${API_URL}/api/v1/components/search`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);

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
    const upstream = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(query)}&limit=${limit}`, {
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
    const results = Array.isArray(data) ? data : (data.components || data.results || []);
    return NextResponse.json({
      query,
      count: results.length,
      results: results.slice(0, limit).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        author: c.author?.username || c.author || "",
        preview: c.preview || c.thumbnail || c.image || "",
        tags: c.tags || [],
        install_command: c.install_command || `npx twenty-first add ${c.id}`,
        url: c.url || `${API_URL}/components/${c.id}`,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({
      error: `Failed to fetch from 21st.dev: ${err.message}`,
      results: [],
    }, { status: 502 });
  }
}
