"use client";
import { linkFacebookToCurrentUser } from "@/lib/auth/readUserSession";

const FacebookConnectButton = () => {
  const handleClick = async () => {
    try {
      await linkFacebookToCurrentUser();
    } catch (err) {
      console.error("Fejl ved linking:", err);
    }
  };

  return (
    <button onClick={handleClick} className="btn btn-sm">
      Forbind Facebook
    </button>
  );
};

export default FacebookConnectButton;
