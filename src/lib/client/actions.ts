"use server";

import { createClient } from "@/utils/supabase/client";

export async function createRequest(
  name: string,
  company: string,
  mobile: string,
  mail: string,
  category: string,
  consent: boolean,
  message: string
): Promise<void> {
  const supabase = createClient();

  try {
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    const consentTimestamp = consent ? new Date().toISOString() : null;
    const { error } = await supabase.from("requests").insert([
      {
        name,
        mobile,
        mail,
        category,
        consent,
        message,
        consent_timestamp: consentTimestamp,
        ip_address: ipAddress,
        terms_version: "v1.0",
      },
    ]);

    if (error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in createRequest:", error);
    throw error;
  }
}

export async function getCarPackages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("id, label, title, title_eng, desc, desc_eng, price")
    .in("label", ["basic", "platin"]);

  if (error) throw new Error("Failed to fetch car packages: " + error.message);
  return data || [];
}

export async function getTrailerPackages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("id, label, title, title_eng, desc, desc_eng, price")
    .in("label", ["trailer"]);

  if (error)
    throw new Error("Failed to fetch trailer packages: " + error.message);
  return data || [];
}

export async function getTractorPackages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, label, title, title_eng, desc, desc_eng, price, note, note_eng"
    )
    .in("label", ["tractor"]);

  if (error)
    throw new Error("Failed to fetch tractor packages: " + error.message);
  return data || [];
}

export async function getRetakePackages() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("id, label, title, title_eng, desc, desc_eng, price")
    .in("label", ["retake-old", "retake-new"]);

  if (error)
    throw new Error("Failed to fetch retake packages: " + error.message);
  return data || [];
}

export async function getFeaturesByPackageId(packageId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("package_features")
    .select("included, override_price, features(id, title, title_eng, price)")
    .eq("package_id", packageId);

  if (error || !data) {
    throw new Error("Failed to fetch features for package: " + error?.message);
  }

  return data.flatMap((item) => {
    const features = Array.isArray(item.features)
      ? item.features
      : [item.features];

    return features.map(
      (feature: {
        id: string;
        title: string;
        title_eng: string;
        price: number | null;
      }) => {
        return {
          id: feature.id,
          title: feature.title,
          title_eng: feature.title_eng,
          price: item.override_price ?? feature.price,
          included: item.included ?? false,
        };
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllTeachers() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("priority");

  if (error) {
    throw new Error("Failed to fetch latest news: " + error.message);
  }

  return data;
}
