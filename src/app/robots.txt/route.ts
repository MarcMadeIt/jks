import { NextResponse } from "next/server";

export function GET() {
  const content = `User-agent: *
Disallow: /api/
Disallow: /login/
Disallow: /dashboard/
Disallow: /admin/

Sitemap: https://junkerskøreskole.dk/sitemap.xml
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
