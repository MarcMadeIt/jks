import { NextResponse } from "next/server";
import { getAllNews } from "@/lib/server/actions";

interface NewsRow {
  id: number;
  title: string;
  desc: string;
  desc_translated: string | null;
  source_lang: string;
  image: string | null;
  creator_id: string;
  created_at: string;
}

interface NewsResponse {
  id: number;
  title: string;
  image: string | null;
  creator_id: string;
  created_at: string;
  desc: string;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const uiLang = url.searchParams.get("lang") === "en" ? "en" : "da";

    const { news, total } = await getAllNews(page);
    const raw = news as NewsRow[];

    const transformed: NewsResponse[] = raw.map((c) => {
      const desc =
        c.source_lang === uiLang ? c.desc : c.desc_translated ?? c.desc;

      return {
        id: c.id,
        title: c.title,
        image: c.image,
        creator_id: c.creator_id,
        created_at: c.created_at,
        desc,
      };
    });

    return NextResponse.json({ news: transformed, total }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/news error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
