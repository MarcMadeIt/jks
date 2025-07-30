import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { updateRequest, getRequestById } from "@/lib/server/actions";
import { Request } from "../RequestsList";
import { useTranslation } from "next-i18next";

interface UpdateRequestProps {
  requestId: string;
  onBackClick: () => void;
  setShowToast: (show: boolean) => void;
  onUpdateRequest: (requestId: string, data: Partial<Request>) => void;
}

const UpdateRequest = ({
  requestId,
  onBackClick,
  setShowToast,
  onUpdateRequest,
}: UpdateRequestProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const charLimit = 500;

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const requestData = await getRequestById(requestId);
        if (requestData) {
          setName(requestData.name || "");
          setCategory(requestData.category || "");
          setMobile(requestData.mobile?.toString() || "");
          setMail(requestData.mail || "");
          setMessage(requestData.message || "");
          setCharCount(requestData.message?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch request data:", error);
      }
    };

    fetchRequestData();
  }, [requestId]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= charLimit) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<Request> = {
      name,
      category,
      mobile,
      mail,
      message,
    };
    onUpdateRequest(requestId, updatedData);
    setShowToast(true);
    onBackClick();
    try {
      await updateRequest(requestId, updatedData);
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex items-start">
        <button
          onClick={onBackClick}
          className="btn btn-ghost"
          aria-label={t("aria.updateRequest.backButton")}
        >
          <FaAngleLeft />
          {t("back")}
        </button>
      </div>

      <div className="flex flex-col gap-10 w-full p-3">
        <h2 className="text-lg font-bold">Opdater kundedetaljer</h2>
        <form className="flex flex-col gap-10 w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
            <div className="flex flex-col gap-5 items-center w-full lg:w-1/3">
              <fieldset className="flex flex-col gap-2 relative w-full fieldset">
                <legend className="fieldset-legend">Mailadresse</legend>
                <input
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Tilføj mail"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                  aria-label={t("aria.updateRequest.mailInput")}
                />
              </fieldset>
              <fieldset className="flex flex-col gap-2 relative w-full fieldset">
                <legend className="fieldset-legend">Mobil nr.</legend>
                <input
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Tilføj mobil nr."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  aria-label={t("aria.updateRequest.mobileInput")}
                />
              </fieldset>

              <fieldset className="flex flex-col gap-2 relative w-full fieldset">
                <legend className="fieldset-legend">Valg af opgave</legend>
                <select
                  className="select select-bordered"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  aria-label={t("aria.updateRequest.categorySelect")}
                >
                  <option value="" disabled>
                    {t("task_interest")}
                  </option>
                  <option value="Kørekort til Bil">
                    {t("taskSelect.options.car")}
                  </option>
                  <option value="Kørekort til Trailer">
                    {t("taskSelect.options.trailer")}
                  </option>
                  <option value="Kørekort til Traktor">
                    {t("taskSelect.options.traktor")}
                  </option>
                  <option value="Generhvervelse af kørekort">
                    {t("taskSelect.options.generhvervelse")}
                  </option>
                  <option value="Other">{t("taskSelect.options.other")}</option>
                </select>
              </fieldset>
            </div>

            <div className="flex flex-col gap-5 items-center w-full lg:w-1/3">
              <fieldset className="flex flex-col gap-2 relative w-full fieldset">
                <legend className="fieldset-legend">Navn</legend>
                <input
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Tilføj navn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-label={t("aria.updateRequest.nameInput")}
                />
              </fieldset>
              <fieldset className="flex flex-col gap-2 relative w-full fieldset">
                <legend className="fieldset-legend">Besked</legend>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="textarea textarea-bordered textarea-md text-base w-full resize-none"
                  placeholder="Tilføj besked"
                  value={message}
                  onChange={handleMessageChange}
                  required
                  aria-label={t("aria.updateRequest.messageTextarea")}
                />
                <div className="text-right text-xs font-medium text-zinc-500">
                  {charCount}/{charLimit}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="flex items-center justify-start gap-3">
            <button
              className="btn btn-primary"
              type="submit"
              aria-label={t("aria.updateRequest.submitButton")}
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequest;
