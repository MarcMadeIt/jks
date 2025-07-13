"use client";

import React, { useState, FormEvent } from "react";
import { createRequest } from "@/lib/client/actions";
import TaskSelect from "./TaskSelect";
import ConsentModal from "../modal/ConsentModal";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const charLimit = 200;
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const validatePhoneNumber = (phoneNumber: string) => {
    const danishPhoneRegex = /^(?:\+45\d{8}|\d{8})$/;
    return danishPhoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePhoneNumber(mobile)) {
      setErrorText(t("contactForm.errors.invalidPhone"));
      return;
    }
    if (!isChecked) {
      setErrorText(t("contactForm.errors.consentRequired"));
      return;
    }

    setIsLoading(true);
    setErrorText("");
    setSuccessText("");

    try {
      await createRequest(name, "", mobile, mail, category, isChecked, message);

      const emailBody = [
        `Phone: ${mobile}`,
        `Category: ${category}`,
        `Consent given: ${isChecked ? "Yes" : "No"}`,
        "",
        "Message:",
        message,
      ].join("\n");

      const lang = (localStorage.getItem("i18nextLng") as "en" | "da") || "en";

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: mail,
          message: emailBody,
          lang,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Email send failed");
      }

      setIsSuccess(true);
      setSuccessText(t("contactForm.success.requestSent"));
    } catch (err: unknown) {
      console.error("Submit error:", err);
      if (err instanceof Error) {
        setErrorText(err.message || t("contactForm.errors.generic"));
      } else {
        setErrorText(t("contactForm.errors.generic"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= charLimit) {
      setMessage(val);
      setCharCount(val.length);
      if (!hasTyped) setHasTyped(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSuccessText("");
    setErrorText("");
    setName("");
    setMail("");
    setMobile("");
    setCategory("");
    setMessage("");
    setIsChecked(false);
  };

  return (
    <div className="md:max-w-2xl max-w-md w-full">
      {isSuccess ? (
        <div className="flex flex-col gap-4 bg-base-100 p-10 h-[600px]">
          <h2 className="text-xl font-bold">
            {t("contactForm.success.title")}
          </h2>
          <p>{t("contactForm.success.message")}</p>
          <button onClick={handleClose} className="btn btn-primary mt-5">
            {t("contactForm.success.closeButton")}
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-base-100 md:ring-2 md:ring-base-200 rounded-lg shadow-md p-8 md:p-10"
        >
          <h2 className="text-xl font-bold">{t("contactForm.title")}</h2>

          {/* Name / Email / Phone */}
          <div className="flex flex-col lg:flex-row gap-3 md:gap-10">
            <div className="flex-1 flex flex-col gap-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("contactForm.fields.name.label")}
                </legend>
                <label htmlFor="name" className="form-control w-full">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t("contactForm.fields.name.placeholder")}
                    aria-label={t("contactForm.aria.nameInput")}
                    className="input input-ghost bg-base-200 w-full lg:max-w-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("contactForm.fields.email.label")}
                </legend>
                <label htmlFor="mail" className="form-control w-full">
                  <input
                    id="mail"
                    name="mail"
                    type="email"
                    autoComplete="email"
                    placeholder={t("contactForm.fields.email.placeholder")}
                    aria-label={t("contactForm.aria.emailInput")}
                    className="input input-ghost bg-base-200 w-full lg:max-w-xs"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </label>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("contactForm.fields.phone.label")}
                </legend>
                <label htmlFor="phone" className="form-control w-full ">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder={t("contactForm.fields.phone.placeholder")}
                    aria-label={t("contactForm.aria.phoneInput")}
                    className="input input-ghost bg-base-200 w-full lg:max-w-xs"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </label>
              </fieldset>
            </div>

            {/* Category & Message */}
            <div className="flex-1 flex flex-col gap-3">
              <fieldset className="fieldset">
                <TaskSelect onChange={setCategory} />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  {t("contactForm.fields.message.label")}
                </legend>
                <label
                  htmlFor="message"
                  className="form-control w-full relative"
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder={t("contactForm.fields.message.placeholder")}
                    aria-label={t("contactForm.aria.messageInput")}
                    className="textarea textarea-ghost bg-base-200 textarea-md text-base w-full lg:max-w-xs resize-none"
                    value={message}
                    onChange={handleMessageChange}
                    maxLength={charLimit}
                    required
                  />
                  {hasTyped && (
                    <div className="text-right text-xs text-gray-500 absolute -bottom-5 right-0">
                      {charCount}/{charLimit}
                    </div>
                  )}
                </label>
              </fieldset>
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-center gap-3">
            <input
              id="consent"
              type="checkbox"
              className="checkbox checkbox-md checkbox-primary"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              aria-label={t("contactForm.aria.consentCheckbox")}
              required
            />
            <label htmlFor="consent" className="label-text text-xs max-w-60">
              {t("contactForm.fields.consent.label")}{" "}
              <ConsentModal
                buttonText={t("contactForm.fields.consent.readMore")}
                variant="primary"
              />
            </label>
          </div>

          {errorText && <p className="text-error">{errorText}</p>}
          {successText && <p className="text-success">{successText}</p>}

          <button
            type="submit"
            className="btn btn-primary mt-5"
            disabled={isLoading}
            aria-label={t("contactForm.aria.submitButton")}
          >
            {isLoading
              ? t("contactForm.buttons.sending")
              : t("contactForm.buttons.submit")}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
