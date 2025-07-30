import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://junkerskoreskole.dk"; // Produktions-URL
  const today = new Date().toISOString().split("T")[0];

  const staticPaths = [
    "",
    "om-os",
    "korekort-forlob",
    "den-lille-hjaelper",
    "information",
    "afdelinger",
    "priser",
    "kontakt",
    "tilmelding",
  ];

  const departments = ["ribe", "grindsted", "billund"];

  const priceCategories = [
    "bil-korekort",
    "trailer-korekort",
    "generhverv",
    "tractor-korekort",
  ];

  const urls = [
    // Statisk
    ...staticPaths.map((path) => {
      let priority = "0.8";
      if (path === "") priority = "1.0";
      else if (path === "tilmelding" || path === "priser") priority = "0.9";

      return `
    <url>
      <loc>${baseUrl}/${path}</loc>
      <changefreq>monthly</changefreq>
      <priority>${priority}</priority>
      <lastmod>${today}</lastmod>
    </url>`;
    }),

    // Afdelinger
    ...departments.map(
      (city) => `
    <url>
      <loc>${baseUrl}/afdelinger/${city}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
      <lastmod>${today}</lastmod>
    </url>`
    ),

    // Priser
    ...priceCategories.map(
      (type) => `
    <url>
      <loc>${baseUrl}/priser/${type}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
      <lastmod>${today}</lastmod>
    </url>`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
