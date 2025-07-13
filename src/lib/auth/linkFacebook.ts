// lib/auth/linkFacebook.ts
"use client";

import { createClient } from "@/utils/supabase/client";

export async function linkFacebookToCurrentUser() {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Ingen aktiv session");
  }

  const { error } = await supabase.auth.linkIdentity({
    provider: "facebook",
    options: {
      redirectTo: "https://ny.junkerskøreskole.dk/admin",
    },
  });

  if (error) {
    if (error.message?.includes("identity_already_exists")) {
      console.warn("Facebook allerede linket.");
      return;
    }

    console.error("Fejl ved Facebook-linking:", error.message);
    throw error;
  }

  console.log("✅ Facebook linket");
}
