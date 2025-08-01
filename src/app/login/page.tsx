"use client";

import { login } from "@/lib/server/actions";
import React, { useState } from "react";
import { FaEnvelope, FaKey } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const errors = { email: "", password: "" };

    if (!validateEmail(email)) {
      errors.email = "Invalid email address";
      valid = false;
    }

    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(errors);
    setServerError(""); // Clear previous server error

    if (valid) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await login(formData);
        if (response.success) {
          router.push("/admin"); // Navigate to /admin
        } else {
          setServerError(t("messages.error_wrong")); // Display generic error message
        }
      } catch {
        setServerError(t("messages.error_wrong")); // Fallback error message
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="md:h-lvh bg-base-200 h-dvh flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-11 rounded-lg shadow-lg flex flex-col gap-5"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="font-bold text-lg">ADMIN</span>
            <span className="text-base font-semibold">Junkers Køreskole</span>
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="email"
              className="input input-bordered flex items-center gap-2 "
            >
              <FaEnvelope size={18} />
              <input
                id="email"
                name="email"
                autoComplete="email"
                type="text"
                className="grow"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            {errors.email && (
              <span className=" absolute -bottom-4 text-xs text-red-500">
                {errors.email}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="password"
              className="input input-bordered flex items-center gap-2"
            >
              <FaKey size={18} />
              <input
                id="password"
                name="password"
                autoComplete="current-password"
                type="password"
                className="grow"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.password && (
              <span className="text-xs absolute -bottom-4 text-red-500">
                {errors.password}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? "Logger ind..." : "Login"}
          </button>
          <span className="text-xs text-red-500 min-h-4 text-center">
            {serverError}
          </span>
        </form>
        <span className="text-zinc-400 text-[11px] items-center justify-center p-4 absolute bottom-0">
          © {new Date().getFullYear()} Powered by{" "}
          <span className="font-semibold">Arzonic</span>
        </span>
      </div>
    </>
  );
};

export default LoginPage;
