import * as cheerio from "cheerio";

export type Course = {
  id: string;
  name: string;
  start_date: string;
  location: string;
  registration_url: string;
  fewSeatsLeft?: boolean;
  seatsLeft?: string;
};

export async function fetchCoursesServerAction(): Promise<Course[]> {
  const html = await fetch("https://gondrive.com/api/site/school/30/iframe/", {
    next: { revalidate: 300 },
  }).then((res) => res.text());

  const $ = cheerio.load(html);
  const courses: Course[] = [];

  $(".gnd-item").each((i, el) => {
    const $el = $(el);

    const day = $el.find(".gnd-day").first().text().trim();
    const month = $el.find(".gnd-month").first().text().trim();
    const start_date = `${day} ${month}`;

    const name = $el
      .find(".flex-column")
      .eq(1)
      .find(".flex-row")
      .first()
      .text()
      .trim();
    const seatsLeft = $el
      .find(".flex-column")
      .eq(1)
      .find(".flex-row")
      .eq(1)
      .text()
      .trim();
    const registration_url = $el.find("a.gnd-button").attr("href") ?? "#";
    const location = name.split(" kl.")[0]?.trim() ?? "";

    const id = registration_url.split("lesson=")[1] ?? `fallback-${i}`;

    const fewSeatsLeft = seatsLeft.toLowerCase().includes("få");

    courses.push({
      id,
      name,
      start_date,
      location,
      registration_url,
      seatsLeft,
      fewSeatsLeft,
    });
  });

  return courses;
}
