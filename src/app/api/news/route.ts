import { NextResponse } from "next/server";
import { getLatestNews } from "@/lib/server/actions";

interface NewsRow {
  id: number;
  title: string;
  content: string;
  content_translated: string | null;
  source_lang: string;
  images: string[];
  creator_id: string;
  created_at: string;
  fb_link?: string | null;
}

interface NewsResponse {
  id: number;
  title: string;
  images: string[];
  creator_id: string;
  created_at: string;
  content: string;
  fb_link?: string | null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const uiLang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const news = await getLatestNews();
    const raw = news as NewsRow[];

    const transformed: NewsResponse[] = raw.map((c) => {
      // Altid brug dansk version af content
      const content = c.content; // Brug altid original dansk content

      return {
        id: c.id,
        title: c.title,
        images: c.images || [],
        creator_id: c.creator_id,
        created_at: c.created_at,
        content,
        fb_link: c.fb_link,
      };
    });

    return NextResponse.json({ news: transformed }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/news error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
