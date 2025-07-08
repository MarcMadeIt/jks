import { fetchCoursesServerAction } from "@/lib/client/gondrive";
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  const courses = await fetchCoursesServerAction();
  return NextResponse.json(courses);
}
