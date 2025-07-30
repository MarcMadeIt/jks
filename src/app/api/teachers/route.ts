import { NextResponse } from "next/server";
import { getTeachers } from "@/lib/server/actions";

interface TeacherRow {
  id: string;
  name: string;
  desc: string;
  desc_translated: string | null;
  since: string;
  image: string | null;
  source_lang: string;
}

interface TeacherResponse {
  id: string;
  name: string;
  desc: string;
  since: string;
  image: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "da"; // Default to Danish

    const teachers = await getTeachers();
    const raw = teachers as TeacherRow[];

    const transformed: TeacherResponse[] = raw.map((t) => {
      const desc =
        lang === t.source_lang ? t.desc : t.desc_translated || t.desc;

      return {
        id: t.id,
        name: t.name,
        desc,
        since: t.since,
        image: t.image,
      };
    });

    return NextResponse.json({ teachers: transformed }, { status: 200 });
  } catch (err: unknown) {
    console.error("API GET /api/teachers error:", err);
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
