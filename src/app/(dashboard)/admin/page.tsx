"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { processFacebookCallback } from "@/lib/server/actions";

const AdminPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleFacebookCallback = async () => {
      const facebookCallback = searchParams.get("facebook_callback");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (facebookCallback === "true") {
        // Tjek om der er en fejl fra Facebook OAuth
        if (error) {
          console.error("Facebook OAuth fejl:", error, errorDescription);

          // Redirect til admin uden callback parameter
          window.location.href = "/admin";
          return;
        }

        try {
          const result = await processFacebookCallback();
          if (result.success) {
            console.log("Facebook forbundet successfully");
            // Redirect til admin uden callback parameter
            window.location.href = "/admin";
          }
        } catch (error) {
          console.error("Facebook callback fejl:", error);
        }
      }
    };

    handleFacebookCallback();
  }, [searchParams]);

  return <div className="relative">{/* <Overview /> */}</div>;
};

export default AdminPage;
