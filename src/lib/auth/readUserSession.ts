"use server";

import { createServerClientInstance } from "@/utils/supabase/server";
import { useAuthStore } from "./useAuthStore";
import { createClient } from "@/utils/supabase/client";

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

export async function fetchAndSetFacebookToken() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.provider_token) {
    useAuthStore.getState().clearFacebookToken?.();
    return;
  }

  useAuthStore.getState().setFacebookToken(session.provider_token);
}

export async function linkFacebookToCurrentUser() {
  const supabase = createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    throw new Error("Ingen aktiv session");
  }

  const { error } = await supabase.auth.linkIdentity({
    provider: "facebook",
    options: {
      redirectTo: "https://ny.junkerskøreskole.dk/admin", // OBS: ændr til dit domæne
    },
  });

  if (error) {
    if (error.message?.includes("identity_already_exists")) {
      console.warn("Facebook allerede linket til en anden bruger.");
      return;
    }

    console.error("Linking fejl:", error.message);
    throw error;
  }

  console.log("Facebook linket til bruger ✅");
}
