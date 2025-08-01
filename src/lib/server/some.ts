const PAGE_ID = process.env.FB_SYSTEM_PAGE_ID!;
const PAGE_ACCESS_TOKEN = process.env.FB_SYSTEM_PAGE_TOKEN!;

export async function getPageAccessToken(): Promise<string> {
  const sysToken = process.env.FB_SYSTEM_PAGE_TOKEN!;
  const pageId = process.env.FB_SYSTEM_PAGE_ID!;

  const res = await fetch(
    `https://graph.facebook.com/v20.0/me/accounts?access_token=${sysToken}`
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kunne ikke hente page token: ${err}`);
  }

  const data = await res.json();
  const page = data.data?.find((p: { id: string }) => p.id === pageId);

  if (!page?.access_token) {
    throw new Error("Page access token ikke fundet");
  }

  return page.access_token;
}

export async function postToFacebookPage({
  message,
  imageUrls,
}: {
  message: string;
  imageUrls?: string[];
}): Promise<{ link?: string } | null> {
  console.log("🚀 [SERVER] Starting Facebook post via system user...");
  console.log("📝 Message:", message);

  if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
    throw new Error("Facebook systembruger token eller page ID mangler");
  }

  const selectedPageId = PAGE_ID;

  // Get proper page access token
  const pageAccessToken = await getPageAccessToken();
  console.log("🔑 [SERVER] Retrieved page access token");

  try {
    // Hvis der kun er ét billede - brug /photos endpoint direkte
    if (imageUrls && imageUrls.length === 1) {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${selectedPageId}/photos`,
        {
          method: "POST",
          body: new URLSearchParams({
            url: imageUrls[0],
            message,
            published: "true", // Publiser direkte
            access_token: pageAccessToken,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("Photo post error:", data);
        throw new Error(`Fejl ved billede-opslag: ${data.error?.message}`);
      }

      console.log(
        "✅ [SERVER] Facebook photo post created successfully:",
        data.id
      );
      return {
        link: data.id ? `https://www.facebook.com/${data.id}` : undefined,
      };
    }

    // For posts uden billeder eller med flere billeder - brug /feed endpoint
    const postBody: Record<string, string> = {
      message,
      access_token: pageAccessToken,
    };

    // Hvis flere billeder - upload dem først som published photos, så del dem
    if (imageUrls && imageUrls.length > 1) {
      const photoIds: string[] = [];

      for (const url of imageUrls) {
        const res = await fetch(
          `https://graph.facebook.com/v20.0/${selectedPageId}/photos`,
          {
            method: "POST",
            body: new URLSearchParams({
              url,
              published: "true", // Publiser direkte
              no_story: "true", // Undgå at lave separate posts
              access_token: pageAccessToken,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Photo upload error:", data);
          throw new Error(`Kunne ikke uploade billede: ${data.error?.message}`);
        }
        photoIds.push(data.id);
      }

      // Opret samlende post der refererer til billederne
      postBody.child_attachments = JSON.stringify(
        photoIds.map((id) => ({ media_fbid: id }))
      );
    }

    // Opret post (kun hvis ikke single photo)
    if (!imageUrls || imageUrls.length !== 1) {
      const postRes = await fetch(
        `https://graph.facebook.com/v20.0/${selectedPageId}/feed`,
        {
          method: "POST",
          body: new URLSearchParams(postBody),
        }
      );
      const postData = await postRes.json();

      if (!postRes.ok) {
        console.error("Facebook post error:", postData);
        throw new Error(`Fejl ved opslag: ${postData.error?.message}`);
      }

      console.log(
        "✅ [SERVER] Facebook post created successfully:",
        postData.id
      );
      return {
        link: postData.id
          ? `https://www.facebook.com/${postData.id}`
          : undefined,
      };
    }

    // If we got here, it was a single photo post that was already handled
    return null;
  } catch (error) {
    console.error("❌ [SERVER] Facebook posting failed:", error);
    throw error;
  }
}

export async function deleteFacebookPost(
  postId: string
): Promise<{ success: boolean }> {
  console.log("🗑️ [SERVER] Deleting Facebook post:", postId);

  if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
    throw new Error("Facebook system-token eller page ID mangler");
  }

  // Get proper page access token
  const pageAccessToken = await getPageAccessToken();

  const res = await fetch(`https://graph.facebook.com/v20.0/${postId}`, {
    method: "DELETE",
    body: new URLSearchParams({
      access_token: pageAccessToken,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("❌ [SERVER] Facebook deletion failed:", errorData);
    throw new Error(`Fejl ved sletning: ${errorData.error?.message}`);
  }

  console.log("✅ [SERVER] Facebook post deleted successfully!");
  return { success: true };
}

export async function postToInstagram({
  caption,
  imageUrl,
}: {
  caption: string;
  imageUrl: string;
}): Promise<{ success: boolean; id?: string }> {
  console.log("🚀 [SERVER] Starting Instagram post...");
  console.log("📝 Caption:", caption);

  const instagramBusinessId = process.env.INSTAGRAM_BUSINESS_ID!;
  const sysToken = process.env.FB_SYSTEM_PAGE_TOKEN!;

  if (!sysToken) {
    throw new Error("Instagram system token mangler");
  }

  try {
    // Step 1: Upload the image to Instagram
    const mediaRes = await fetch(
      `https://graph.facebook.com/v20.0/${instagramBusinessId}/media`,
      {
        method: "POST",
        body: new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: sysToken,
        }),
      }
    );

    const mediaData = await mediaRes.json();

    if (!mediaRes.ok) {
      console.error("Instagram media upload error:", mediaData);
      throw new Error(
        `Kunne ikke uploade billede: ${mediaData.error?.message}`
      );
    }

    console.log(
      "✅ [SERVER] Instagram media uploaded successfully:",
      mediaData.id
    );

    // Step 2: Publish the uploaded media
    const publishRes = await fetch(
      `https://graph.facebook.com/v20.0/${instagramBusinessId}/media_publish`,
      {
        method: "POST",
        body: new URLSearchParams({
          creation_id: mediaData.id,
          access_token: sysToken,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (!publishRes.ok) {
      console.error("Instagram publish error:", publishData);
      throw new Error(
        `Kunne ikke publicere opslag: ${publishData.error?.message}`
      );
    }

    console.log(
      "✅ [SERVER] Instagram post published successfully:",
      publishData.id
    );
    return { success: true, id: publishData.id };
  } catch (error) {
    console.error("❌ [SERVER] Instagram posting failed:", error);
    throw error;
  }
}
