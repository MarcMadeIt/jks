// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let cachedCourses: Course[] | null = null;
let cacheTimestamp: number | null = null;

export const fetchCourses = async (): Promise<Course[]> => {
  // Check if we have valid cached data
  if (
    cachedCourses &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION
  ) {
    console.log("Returning cached courses");
    return cachedCourses;
  }

  try {
    console.log("Fetching fresh courses data");
    const response = await fetch(
      "https://gondrive.com/api/site/school/30/lessons"
    );
    const data = await response.json();

    // Update cache
    cachedCourses = data.lessons;
    cacheTimestamp = Date.now();

    return data.lessons;
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return cached data if available, even if expired
    if (cachedCourses) {
      console.log("Returning stale cached courses due to error");
      return cachedCourses;
    }
    return [];
  }
};

// Define the Course type
export type Course = {
  id: number;
  title: string;
  license_type: string;
  capacity: number;
  reservations: number;
  start_date: string;
  start: string;
  end: string;
  address: string;
  url: string;
  api_link?: string;
  api_text?: string;
};
