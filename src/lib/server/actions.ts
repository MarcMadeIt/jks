"use server";

import {
  createAdminClient,
  createServerClientInstance,
} from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const supabase = await createServerClientInstance();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Tjek om brugeren er registreret med OAuth (Facebook)
    if (
      error.message.includes("Email not confirmed") ||
      error.message.includes("Invalid login credentials") ||
      error.message.includes("signup_disabled")
    ) {
      // Prøv at tjekke om brugeren eksisterer via admin API
      try {
        const adminClient = await createAdminClient();
        const { data: users } = await adminClient.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === email);

        if (user && user.app_metadata.providers?.includes("facebook")) {
          // Brugeren er registreret med Facebook - redirect til OAuth login
          console.log("User is registered with Facebook OAuth");
          redirect(
            "/login?provider=facebook&email=" + encodeURIComponent(email)
          );
        }
      } catch (adminError) {
        console.error("Admin check failed:", adminError);
      }
    }

    console.error("Failed to login:", error.message);
    redirect("/login?error=true&message=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function createMember(data: {
  email: string;
  password: string;
  role: "editor" | "admin";
  name: string;
}) {
  const supabase = await createAdminClient();

  try {
    // Ensure the Supabase admin client is properly configured
    if (!supabase.auth.admin) {
      throw new Error("Supabase admin client is not configured correctly.");
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
      console.error("Failed to create user:", createResult.error.message);

      // Provide more context for the error
      if (createResult.error.message.includes("not allowed")) {
        throw new Error(
          "Failed to create user: Insufficient permissions or invalid configuration."
        );
      }

      throw new Error("Failed to create user: " + createResult.error.message);
    }

    console.log("User created:", createResult.data.user);

    const memberResult = await supabase
      .from("members")
      .insert({ name: data.name, id: createResult.data.user?.id });

    if (memberResult.error) {
      console.error(
        "Failed to insert into members:",
        memberResult.error.message
      );
      throw new Error(
        "Failed to insert into members: " + memberResult.error.message
      );
    }

    console.log("Member inserted:", memberResult.data);

    const permissionsResult = await supabase
      .from("permissions")
      .insert({ role: data.role, member_id: createResult.data.user?.id });

    if (permissionsResult.error) {
      console.error(
        "Failed to insert into permissions:",
        permissionsResult.error.message
      );
      throw new Error(
        "Failed to insert into permissions: " + permissionsResult.error.message
      );
    }

    console.log("Permissions inserted:", permissionsResult.data);

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
  desc,
  image,
}: {
  title: string;
  desc: string;
  image?: File;
}): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const apiKey = process.env.DEEPL_API_KEY!;
    const endpoint = "https://api-free.deepl.com/v2/translate";

    const params1 = new URLSearchParams({
      auth_key: apiKey,
      text: desc,
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

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const params2 = new URLSearchParams({
        auth_key: apiKey,
        text: desc,
        target_lang: "DA",
      });
      const r2 = await fetch(endpoint, { method: "POST", body: params2 });
      if (!r2.ok)
        throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
      const {
        translations: [second],
      } = (await r2.json()) as {
        translations: { text: string }[];
      };
      desc_translated = second.text;
    }

    let imageUrl: string | null = null;
    if (image) {
      const uploadFile = async (file: File) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: ud, error: ue } = await supabase.auth.getUser();
        if (ue || !ud?.user) throw new Error("Not authenticated");
        const path = `news-images/${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("news-images").upload(path, buf, {
          contentType: "image/webp",
        });
        const { data } = await supabase.storage
          .from("news-images")
          .getPublicUrl(path);
        return data.publicUrl!;
      };
      imageUrl = await uploadFile(image);
    }

    const { data: ud, error: ue } = await supabase.auth.getUser();
    if (ue || !ud?.user) throw new Error("Not authenticated");

    const { error } = await supabase.from("news").insert([
      {
        title,
        desc,
        desc_translated,
        source_lang: sourceLang,
        image: imageUrl,
        creator_id: ud.user.id,
      },
    ]);
    if (error) throw error;
  } catch (err) {
    console.error("createNews error:", err);
    throw err;
  }
}

export async function updateNews(
  id: number,
  title: string,
  desc: string,
  image: File | null,
  created_at?: string
): Promise<void> {
  const supabase = await createServerClientInstance();

  try {
    const apiKey = process.env.DEEPL_API_KEY!;
    const endpoint = "https://api-free.deepl.com/v2/translate";

    const params1 = new URLSearchParams({
      auth_key: apiKey,
      text: desc,
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

    let desc_translated = first.text;
    if (sourceLang === "en") {
      const params2 = new URLSearchParams({
        auth_key: apiKey,
        text: desc,
        target_lang: "DA",
      });
      const r2 = await fetch(endpoint, { method: "POST", body: params2 });
      if (!r2.ok)
        throw new Error(`DeepL error ${r2.status}: ${await r2.text()}`);
      const {
        translations: [second],
      } = (await r2.json()) as {
        translations: { text: string }[];
      };
      desc_translated = second.text;
    }

    let imageUrl: string | null = null;
    if (image) {
      const uploadFile = async (file: File) => {
        const ext = "webp";
        const name = `${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: ud, error: ue } = await supabase.auth.getUser();
        if (ue || !ud?.user) throw new Error("Not authenticated");
        const path = `news-images/${ud.user.id}/${name}`;
        const buf = await sharp(Buffer.from(await file.arrayBuffer()))
          .rotate()
          .resize({ width: 1024, height: 768, fit: "cover" })
          .webp({ quality: 65 })
          .toBuffer();
        await supabase.storage.from("news-images").upload(path, buf, {
          contentType: "image/webp",
        });
        const { data } = await supabase.storage
          .from("news-images")
          .getPublicUrl(path);
        return data.publicUrl!;
      };
      imageUrl = await uploadFile(image);
    } else {
      const { data: existing } = await supabase
        .from("news")
        .select("image")
        .eq("id", id)
        .single();
      imageUrl = existing?.image ?? null;
    }

    const { data: ud, error: ue } = await supabase.auth.getUser();
    if (ue || !ud?.user) throw new Error("Not authenticated");

    const payload: {
      title: string;
      desc: string;
      desc_translated: string;
      source_lang: string;
      image: string | null;
      creator_id: string;
      created_at?: string;
    } = {
      title,
      desc,
      desc_translated,
      source_lang: sourceLang,
      image: imageUrl,
      creator_id: ud.user.id,
      ...(created_at ? { created_at } : {}),
    };
    if (created_at) payload.created_at = created_at;

    const { error } = await supabase.from("news").update(payload).eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.error("updateNews error:", err);
    throw err;
  }
}

export async function getAllNews(page = 1, limit = 6) {
  const supabase = await createServerClientInstance();
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { news: data, total: count ?? 0 };
}

export async function getNewsById(caseId: number) {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", caseId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteNews(newsId: number): Promise<void> {
  const supabase = await createServerClientInstance();
  const { error } = await supabase.from("news").delete().eq("id", newsId);
  if (error) throw new Error(error.message);
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

export async function loginWithFacebook() {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin`,
    },
  });

  if (error) {
    console.error("Facebook login failed:", error.message);
    redirect(
      "/login?error=true&message=" + encodeURIComponent("Facebook login failed")
    );
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function handleFacebookConnect(accessToken: string) {
  const supabase = await createServerClientInstance();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      throw new Error("Bruger ikke logget ind");
    }

    // Gem Facebook access token som bruger metadata i stedet for at linke identities
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        facebook_access_token: accessToken,
        facebook_connected: true,
        facebook_connected_at: new Date().toISOString(),
      },
    });

    if (updateError) {
      throw new Error(
        "Kunne ikke gemme Facebook token: " + updateError.message
      );
    }

    return { success: true };
  } catch (err) {
    console.error("handleFacebookConnect error:", err);
    throw err;
  }
}
