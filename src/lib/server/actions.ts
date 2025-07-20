"use server";

import {
  createAdminClient,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { postToFacebookPage } from "./some";

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const supabase = await createServerClientInstance();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Failed to login:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function createMember(data: {
  email: string;
  password: string;
  role: "editor" | "admin" | "developer";
  name: string;
}) {
  const supabase = await createAdminClient();

  try {
    if (!supabase.auth.admin) {
      throw new Error("REGISTRATION_ERROR");
    }

    const createResult = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        role: data.role,
      },
    });

    if (createResult.error) {
      const msg = createResult.error.message.toLowerCase();

      if (msg.includes("already") && msg.includes("registered")) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      if (msg.includes("not allowed")) {
        throw new Error("REGISTRATION_ERROR");
      }

      throw new Error("REGISTRATION_ERROR");
    }

    const userId = createResult.data.user?.id;
    if (!userId) {
      throw new Error("REGISTRATION_ERROR");
    }

    const memberResult = await supabase
      .from("members")
      .insert({ name: data.name, id: userId });

    if (memberResult.error) {
      console.error(
        "Failed to insert into members:",
        memberResult.error.message
      );
      throw new Error("REGISTRATION_ERROR");
    }

    const permissionsResult = await supabase
      .from("permissions")
      .insert({ role: data.role, member_id: userId });

    if (permissionsResult.error) {
      console.error(
        "Failed to insert into permissions:",
        permissionsResult.error.message
      );
      throw new Error("REGISTRATION_ERROR");
    }

    return createResult.data.user;
  } catch (err) {
    console.error("Unexpected error during member creation:", err);
    throw err;
  }
}

export async function signOut() {
  const supabase = await createServerClientInstance();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const supabase = await createAdminClient();

  const {
    data: { users },
    error: fetchError,
  } = await supabase.auth.admin.listUsers();

  if (fetchError) {
    throw new Error("Failed to fetch users: " + fetchError.message);
  }

  const userIds = users.map((user) => user.id);
  const { data: permissions, error: permissionsError } = await supabase
    .from("permissions")
    .select("member_id, role")
    .in("member_id", userIds);

  if (permissionsError) {
    throw new Error("Failed to fetch permissions: " + permissionsError.message);
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("id, name")
    .in("id", userIds);

  if (membersError) {
    throw new Error("Failed to fetch members: " + membersError.message);
  }

  const usersWithRolesAndNames = users.map((user) => {
    const userPermission = permissions.find(
      (permission) => permission.member_id === user.id
    );
    const userName = members.find((member) => member.id === user.id)?.name;
    return {
      ...user,
      role: userPermission ? userPermission.role : null,
      name: userName || null,
    };
  });

  return usersWithRolesAndNames || [];
}

export async function deleteUser(userId: string) {
  const supabase = await createAdminClient();

  try {
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      userId
    );

    if (deleteAuthError) {
      console.error(
        "Failed to delete user from auth:",
        deleteAuthError.message
      );
      throw new Error(
        "Failed to delete user from auth: " + deleteAuthError.message
      );
    }

    console.log("User deleted from auth:", userId);

    const { error: deleteMemberError } = await supabase
      .from("members")
      .delete()
      .eq("id", userId);

    if (deleteMemberError) {
      console.error(
        "Failed to delete user from members:",
        deleteMemberError.message
      );
      throw new Error(
        "Failed to delete user from members: " + deleteMemberError.message
      );
    }

    console.log("User deleted from members:", userId);

    const { error: deletePermissionError } = await supabase
      .from("permissions")
      .delete()
      .eq("member_id", userId);

    if (deletePermissionError) {
      console.error(
        "Failed to delete user from permissions:",
        deletePermissionError.message
      );
      throw new Error(
        "Failed to delete user from permissions: " +
          deletePermissionError.message
      );
    }

    console.log("User deleted from permissions:", userId);

    return { success: true };
  } catch (err) {
    console.error("Unexpected error during user deletion:", err);
    throw err;
  }
}

export async function updateUser(
  userId: string,
  data: { email?: string; password?: string; role?: string; name?: string }
): Promise<void> {
  const supabase = await createAdminClient();

  try {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        email: data.email,
        password: data.password,
      }
    );

    if (authError) {
      throw new Error(`Failed to update user in auth: ${authError.message}`);
    }

    const { error: memberError } = await supabase
      .from("members")
      .update({ name: data.name })
      .eq("id", userId);

    if (memberError) {
      throw new Error(
        `Failed to update user in members: ${memberError.message}`
      );
    }

    if (data.role) {
      const { error: permissionError } = await supabase
        .from("permissions")
        .update({ role: data.role })
        .eq("member_id", userId);

      if (permissionError) {
        throw new Error(
          `Failed to update user role: ${permissionError.message}`
        );
      }
    }
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// News
// ─────────────────────────────────────────────────────────────────────────────

export async function createNews({
  title,
  content,
  images,
  postToFacebook = false,
}: {
  title: string;
  content: string;
  images?: File[];
  postToFacebook?: boolean;
}): Promise<{ fbPostLink?: string } | void> {
  const supabase = await createServerClientInstance();
  const apiKey = process.env.DEEPL_API_KEY!;
  const endpoint = "https://api-free.deepl.com/v2/translate";

  // Translate title
  const titleParams = new URLSearchParams({
    auth_key: apiKey,
    text: title,
    target_lang: "EN",
  });
  const titleRes = await fetch(endpoint, { method: "POST", body: titleParams });
  if (!titleRes.ok)
    throw new Error(`DeepL error ${titleRes.status}: ${await titleRes.text()}`);
  const {
    translations: [titleFirst],
  } = (await titleRes.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  const titleSourceLang = titleFirst.detected_source_language.toLowerCase();

  let title_translated = titleFirst.text;
  if (titleSourceLang === "en") {
    const titleParams2 = new URLSearchParams({
      auth_key: apiKey,
      text: title,
      target_lang: "DA",
    });
    const titleR2 = await fetch(endpoint, {
      method: "POST",
      body: titleParams2,
    });
    if (!titleR2.ok)
      throw new Error(`DeepL error ${titleR2.status}: ${await titleR2.text()}`);
    const {
      translations: [titleSecond],
    } = (await titleR2.json()) as {
      translations: { text: string }[];
    };
    title_translated = titleSecond.text;
  }

  // Translate content
  const params1 = new URLSearchParams({
    auth_key: apiKey,
    text: content,
    target_lang: "EN",
  });
  const r1 = await fetch(endpoint, { method: "POST", body: params1 });
  if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
  const {
    translations: [first],
  } = (await r1.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  const sourceLang = first.detected_source_language.toLowerCase();

  let content_translated = first.text;
  if (sourceLang === "en") {
    const params2 = new URLSearchParams({
      auth_key: apiKey,
      text: content,
      target_lang: "DA",
    });
    const r2 = await fetch(endpoint, { method: "POST", body: params2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    content_translated = second.text;
  }

  const { data: ud, error: ue } = await supabase.auth.getUser();
  if (ue || !ud?.user) throw new Error("Not authenticated");

  const { data: newsData, error: insertError } = await supabase
    .from("news")
    .insert([
      {
        title,
        title_translated,
        content,
        content_translated,
        source_lang: sourceLang,
        creator_id: ud.user.id,
      },
    ])
    .select("id")
    .single();
  if (insertError || !newsData?.id) throw insertError;

  if (images?.length) {
    try {
      await Promise.all(
        images.map(async (file, index) => {
          const ext = "webp";
          const name = `${Math.random().toString(36).slice(2)}.${ext}`;
          const path = `${ud.user.id}/${name}`;

          try {
            const buf = await sharp(Buffer.from(await file.arrayBuffer()))
              .rotate()
              .resize({ width: 1080, height: 1080, fit: "cover" })
              .webp({ quality: 65 })
              .toBuffer();

            const { error: uploadError } = await supabase.storage
              .from("news-images")
              .upload(path, buf, {
                contentType: "image/webp",
              });

            if (uploadError) {
              console.error(`Failed to upload image ${index}:`, uploadError);
              throw uploadError;
            }

            const { error: insertError } = await supabase
              .from("news_images")
              .insert({
                news_id: newsData.id,
                path,
                sort_order: index,
              });

            if (insertError) {
              console.error(
                `Failed to insert image record ${index}:`,
                insertError
              );
              throw insertError;
            }

            console.log(`Successfully processed image ${index}: ${path}`);
          } catch (imageError) {
            console.error(`Error processing image ${index}:`, imageError);
            throw imageError;
          }
        })
      );
    } catch (imagesError) {
      console.error("Failed to process images:", imagesError);
      // Don't throw - news creation should succeed even if image processing fails
    }
  }

  // Post to Facebook if requested
  let fbPostLink: string | undefined;
  if (postToFacebook) {
    try {
      const fbMessage = `${title}\n\n${content}`;

      // Get public URLs for uploaded images
      let imageUrls: string[] = [];
      if (images?.length) {
        try {
          const imageData = await supabase
            .from("news_images")
            .select("path")
            .eq("news_id", newsData.id)
            .order("sort_order");

          if (imageData.data) {
            imageUrls = imageData.data.map((img) => {
              const { data: publicUrl } = supabase.storage
                .from("news-images")
                .getPublicUrl(img.path);
              return publicUrl.publicUrl;
            });
          }
        } catch (error) {
          console.error("Failed to get image URLs:", error);
        }
      }

      const fbResult = await postToFacebookPage({
        message: fbMessage,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });

      if (fbResult?.link) {
        fbPostLink = fbResult.link;
      }

      // Update news record with Facebook post link
      if (fbPostLink) {
        await supabase
          .from("news")
          .update({ facebook_post_link: fbPostLink })
          .eq("id", newsData.id);
      }
    } catch (error) {
      console.error("Failed to post to Facebook:", error);
      // Don't throw error - news creation should succeed even if Facebook posting fails
      // But we can provide more specific error information
      if (
        error instanceof Error &&
        error.message.includes("Facebook token not available")
      ) {
        console.log(
          "Facebook posting skipped - user not logged in with Facebook"
        );
      }
    }
  }

  return fbPostLink ? { fbPostLink } : undefined;
}

export async function updateNews(
  id: number,
  title: string,
  content: string,
  images?: File[]
): Promise<void> {
  const supabase = await createServerClientInstance();
  const apiKey = process.env.DEEPL_API_KEY!;
  const endpoint = "https://api-free.deepl.com/v2/translate";

  // Translate title
  const titleParams = new URLSearchParams({
    auth_key: apiKey,
    text: title,
    target_lang: "EN",
  });
  const titleRes = await fetch(endpoint, { method: "POST", body: titleParams });
  if (!titleRes.ok)
    throw new Error(`DeepL error ${titleRes.status}: ${await titleRes.text()}`);
  const {
    translations: [titleFirst],
  } = (await titleRes.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  const titleSourceLang = titleFirst.detected_source_language.toLowerCase();

  let title_translated = titleFirst.text;
  if (titleSourceLang === "en") {
    const titleParams2 = new URLSearchParams({
      auth_key: apiKey,
      text: title,
      target_lang: "DA",
    });
    const titleR2 = await fetch(endpoint, {
      method: "POST",
      body: titleParams2,
    });
    if (!titleR2.ok)
      throw new Error(`DeepL error ${titleR2.status}: ${await titleR2.text()}`);
    const {
      translations: [titleSecond],
    } = (await titleR2.json()) as {
      translations: { text: string }[];
    };
    title_translated = titleSecond.text;
  }

  // Translate content
  const params1 = new URLSearchParams({
    auth_key: apiKey,
    text: content,
    target_lang: "EN",
  });
  const r1 = await fetch(endpoint, { method: "POST", body: params1 });
  if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
  const {
    translations: [first],
  } = (await r1.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };
  const sourceLang = first.detected_source_language.toLowerCase();

  let content_translated = first.text;
  if (sourceLang === "en") {
    const params2 = new URLSearchParams({
      auth_key: apiKey,
      text: content,
      target_lang: "DA",
    });
    const r2 = await fetch(endpoint, { method: "POST", body: params2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    content_translated = second.text;
  }

  const { data: ud, error: ue } = await supabase.auth.getUser();
  if (ue || !ud?.user) throw new Error("Not authenticated");

  const { error: updateError } = await supabase
    .from("news")
    .update({
      title,
      title_translated,
      content,
      content_translated,
      source_lang: sourceLang,
      creator_id: ud.user.id,
    })
    .eq("id", id);
  if (updateError) throw updateError;

  if (images?.length) {
    await Promise.all(
      images.map(async (file, index) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const path = `${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("news-images").upload(path, buf, {
          contentType: "image/webp",
        });
        await supabase.from("news_images").insert({
          news_id: id,
          path,
          sort_order: index,
        });
      })
    );
  }
}

interface NewsImage {
  path: string;
  sort_order: number;
}

export async function getAllNews(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("news")
    .select("*, news_images(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);

  // Transform data to include image URLs
  const transformedNews =
    data?.map((newsItem) => {
      const images =
        (newsItem.news_images as NewsImage[] | undefined)
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.map((img) => {
            const { data: publicUrlData } = supabase.storage
              .from("news-images")
              .getPublicUrl(img.path);
            return publicUrlData.publicUrl;
          }) || [];

      return {
        ...newsItem,
        images,
      };
    }) || [];

  return { news: transformedNews, total: count ?? 0 };
}

export async function getLatestNews() {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("news")
    .select("*, news_images(*)")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    throw new Error("Failed to fetch latest news: " + error.message);
  }

  // Transform data to include image URLs
  const transformedNews =
    data?.map((newsItem) => {
      const images =
        (newsItem.news_images as NewsImage[] | undefined)
          ?.sort((a, b) => a.sort_order - b.sort_order)
          ?.map((img) => {
            const { data: publicUrlData } = supabase.storage
              .from("news-images")
              .getPublicUrl(img.path);
            return publicUrlData.publicUrl;
          }) || [];

      return {
        ...newsItem,
        images,
      };
    }) || [];

  return transformedNews;
}

export async function getNewsById(newsId: number) {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("news")
    .select("*, news_images(*)")
    .eq("id", newsId)
    .single();
  if (error) throw new Error(error.message);

  // Transform data to include image URLs
  const images =
    (data.news_images as NewsImage[] | undefined)
      ?.sort((a, b) => a.sort_order - b.sort_order)
      ?.map((img) => {
        const { data: publicUrlData } = supabase.storage
          .from("news-images")
          .getPublicUrl(img.path);
        return publicUrlData.publicUrl;
      }) || [];

  return {
    ...data,
    images,
  };
}

export async function deleteNews(newsId: number): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    // 1. Hent alle billeder tilknyttet nyheden
    const { data: images, error: imagesError } = await supabase
      .from("news_images")
      .select("path")
      .eq("news_id", newsId);

    if (imagesError) {
      console.error("Error fetching news images:", imagesError);
      throw new Error(`Failed to fetch news images: ${imagesError.message}`);
    }

    // 2. Slet billeder fra storage
    if (images && images.length > 0) {
      const paths = images.map((img: { path: string }) => img.path);
      const { error: storageError } = await supabase.storage
        .from("news-images")
        .remove(paths);

      if (storageError) {
        console.error("Error removing images from storage:", storageError);
        throw new Error(
          `Failed to remove images from storage: ${storageError.message}`
        );
      }
    }

    // 3. Slet rækker fra news_images
    const { error: deleteImagesError } = await supabase
      .from("news_images")
      .delete()
      .eq("news_id", newsId);

    if (deleteImagesError) {
      console.error("Error deleting news images records:", deleteImagesError);
      throw new Error(
        `Failed to delete news images records: ${deleteImagesError.message}`
      );
    }

    // 4. Slet selve nyheden
    const { error: deleteNewsError } = await supabase
      .from("news")
      .delete()
      .eq("id", newsId);

    if (deleteNewsError) {
      console.error("Error deleting news:", deleteNewsError);
      throw new Error(`Failed to delete news: ${deleteNewsError.message}`);
    }

    console.log(`Successfully deleted news with ID: ${newsId}`);
  } catch (error) {
    console.error("Error in deleteNews function:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────────────────────────────────────

const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";

async function detectAndTranslate(text: string) {
  const apiKey = process.env.DEEPL_API_KEY!;
  const p1 = new URLSearchParams({ auth_key: apiKey, text, target_lang: "EN" });
  const r1 = await fetch(DEEPL_ENDPOINT, { method: "POST", body: p1 });
  if (!r1.ok) throw new Error(`DeepL error ${r1.status}: ${await r1.text()}`);
  const {
    translations: [first],
  } = (await r1.json()) as {
    translations: { text: string; detected_source_language: string }[];
  };

  const sourceLang = first.detected_source_language.toLowerCase();
  let translated = first.text;

  if (sourceLang === "en") {
    const p2 = new URLSearchParams({
      auth_key: apiKey,
      text,
      target_lang: "DA",
    });
    const r2 = await fetch(DEEPL_ENDPOINT, { method: "POST", body: p2 });
    if (!r2.ok) throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
    const {
      translations: [second],
    } = (await r2.json()) as {
      translations: { text: string }[];
    };
    translated = second.text;
  }

  return { sourceLang, translated };
}

interface ReviewInput {
  name: string;
  desc: string;
  rate: number;
  date: string;
  link?: string;
}

export async function createReview({
  name,
  desc,
  rate,
  date,
  link,
}: ReviewInput): Promise<void> {
  const supabase = await createServerClientInstance();
  const { sourceLang, translated } = await detectAndTranslate(desc);
  const { data: u, error: ue } = await supabase.auth.getUser();
  if (ue || !u?.user) throw new Error("Not authenticated");

  const { error } = await supabase.from("reviews").insert([
    {
      creator: u.user.id,
      name,
      desc,
      desc_translated: translated,
      source_lang: sourceLang,
      rate,
      date,
      link: link || null,
    },
  ]);

  if (error) throw error;
}

export async function getAllReviews(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return { reviews: data, total: count ?? 0 };
}

export async function deleteReview(reviewId: number): Promise<void> {
  const supabase = await createServerClientInstance();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) throw new Error(error.message);
}

export async function getLatestReviews(limit: number = 10) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch latest reviews: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching latest reviews:", err);
    throw err;
  }
}

interface ReviewUpdateInput {
  id: number;
  name: string;
  desc: string;
  rate: number;
  date: string;
  link?: string;
}

export async function updateReview({
  id,
  name,
  desc,
  rate,
  date,
  link,
}: ReviewUpdateInput): Promise<void> {
  const supabase = await createServerClientInstance();
  const { sourceLang, translated } = await detectAndTranslate(desc);

  const { data: u, error: ue } = await supabase.auth.getUser();
  if (ue || !u?.user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("reviews")
    .update({
      name,
      desc,
      desc_translated: translated,
      source_lang: sourceLang,
      rate,
      date,
      link: link || null,
      creator: u.user.id,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function getReviewById(reviewId: number) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", reviewId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch review by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching review by ID:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REQUESTS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllRequests(page: number = 1, limit: number = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;

  try {
    const { data, count, error } = await supabase
      .from("requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(
        `Failed to fetch requests: ${error.message || "Unknown error"}`
      );
    }

    return { requests: data || [], total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching requests:", err);
    throw err;
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to delete request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteRequest:", error);
    throw error;
  }
}

export async function updateRequest(
  requestId: string,
  data: {
    name?: string;
    company?: string;
    category?: string;
    mobile?: string;
    mail?: string;
    message?: string;
    address?: string;
    city?: string;
  }
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("requests")
      .update(data)
      .eq("id", requestId);

    if (error) {
      throw new Error(`Failed to update request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in updateRequest:", error);
    throw error;
  }
}

export async function getRequestById(requestId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch request by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching request by ID:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST NOTES
// ─────────────────────────────────────────────────────────────────────────────

export async function createRequestNote(
  message: string,
  requestId: string
): Promise<{ id: string; message: string; created_at: string }> {
  const supabase = await createServerClientInstance();

  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          message: message,
          request_id: requestId,
          creator: userData.user.id,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create request note: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createRequestNote:", error);
    throw error;
  }
}

export async function getNotesByRequestId(requestId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("request_id", requestId);

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching notes:", err);
    throw err;
  }
}

export async function deleteRequestNote(noteId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      throw new Error(`Failed to delete request note: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in deleteRequestNote:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES AND FEATURES
// ─────────────────────────────────────────────────────────────────────────────

export async function getPackages() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch packs: ${error.message}`);
    }

    return { packs: data || [] };
  } catch (err) {
    console.error("Unexpected error during fetching packs:", err);
    throw err;
  }
}

export async function getPackageById(packageId: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("packages") // Ændret fra "jobs" til "packages"
      .select("*")
      .eq("id", packageId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch package by ID: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching package by ID:", err);
    throw err;
  }
}

export async function getFeaturesByPackageId(packageId: string) {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("package_features")
    .select(
      `
      *,
      features(*)
    `
    )
    .eq("package_id", packageId);

  if (error) {
    throw new Error("Failed to fetch features: " + error.message);
  }

  return data.map((item) => {
    const feature = item.features;
    return {
      ...item,
      ...feature,
      price: item.override_price ?? feature.price,
    };
  });
}

export async function updatePackage(
  packageId: string,
  data: {
    title?: string;
    price?: number;
    desc?: string;
    note?: string;
    title_eng?: string;
    desc_eng?: string;
    note_eng?: string;
  }
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("packages")
      .update(data)
      .eq("id", packageId);

    if (error) {
      throw new Error(`Failed to update package: ${error.message}`);
    }
  } catch (err) {
    console.error("Error in updatePackage:", err);
    throw err;
  }
}

export async function deleteFeature(featureId: string): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const { error } = await supabase
      .from("package_features")
      .delete()
      .eq("id", featureId);

    if (error) {
      throw new Error(`Failed to delete feature: ${error.message}`);
    }
  } catch (err) {
    console.error("Error in deleteFeature:", err);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getTeachers() {
  const supabase = await createServerClientInstance();

  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("priority");
    if (error) {
      throw new Error(`Failed to fetch teachers: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error during fetching teachers:", err);
    throw err;
  }
}

export async function fetchTeacherById(teacherId: string) {
  const supabase = await createServerClientInstance();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", teacherId)
      .single();
    if (error) {
      throw new Error(`Failed to fetch teacher: ${error.message}`);
    }
    return data;
  } catch (err) {
    console.error("Unexpected error during fetching teacher by id:", err);
    throw err;
  }
}

export async function createTeacher({
  name,
  desc,
  desc_eng,
  since,
  image,
}: {
  name: string;
  desc: string;
  desc_eng: string;
  since: string;
  image?: File;
}): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    let imageUrl: string | null = null;

    if (image) {
      const safeName = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const timestamp = Date.now();
      const filename = `${safeName}-${timestamp}.webp`;

      const buffer = await sharp(Buffer.from(await image.arrayBuffer()))
        .rotate()
        .resize({ width: 800, height: 800, fit: "cover" })
        .webp({ quality: 70 })
        .toBuffer();

      const { error: uploadError } = await supabase.storage
        .from("teacher-images")
        .upload(filename, buffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.error("Fejl ved upload til Supabase Storage:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("teacher-images")
        .getPublicUrl(filename);

      if (!data?.publicUrl) {
        throw new Error("Kunne ikke hente public URL fra Supabase.");
      }

      imageUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from("teachers").insert([
      {
        name,
        desc,
        desc_eng,
        since,
        image: imageUrl,
      },
    ]);

    if (insertError) {
      console.error("Fejl ved insert i teachers:", insertError);
      throw insertError;
    }
  } catch (err) {
    console.error("createTeacher error:", err);
    throw err;
  }
}
