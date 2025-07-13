"use server";

import { createServerClientInstance } from "@/utils/supabase/server";
import { useAuthStore } from "./useAuthStore";
import { createClient } from "@/utils/supabase/client";

// Læs brugerens session og rolle
export async function readUserSession() {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data: roleResult, error: roleError } = await supabase
    .from("permissions")
    .select("role")
    .eq("member_id", user.id)
    .single();

  if (roleError || !roleResult) return null;

  return {
    user,
    role: roleResult.role as "admin" | "editor",
  };
}

// Hydrér Zustand-store med session og rolle
export async function fetchAndSetUserSession() {
  try {
    const session = await readUserSession();

    if (session) {
      useAuthStore.getState().setUser({
        id: session.user.id,
        email: session.user.email,
      });
      useAuthStore.getState().setRole(session.role as "admin" | "editor");
    } else {
      useAuthStore.getState().clearSession();
    }
  } catch (error) {
    console.error("Failed to fetch and set session:", error);
    useAuthStore.getState().clearSession();
  }
}

export async function checkFacebookLinked() {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    useAuthStore.getState().clearFacebookToken();
    return;
  }

  const { data, error } = await supabase.auth.getUserIdentities();

  if (error || !data?.identities) {
    console.error("Kunne ikke hente identities:", error);
    useAuthStore.getState().clearFacebookToken();
    return;
  }

  const isLinked = data.identities.some(
    (identity) => identity.provider === "facebook"
  );

  if (isLinked) {
    useAuthStore.getState().setFacebookToken("linked");
  } else {
    useAuthStore.getState().clearFacebookToken();
  }
}
