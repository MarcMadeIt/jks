"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface SetupPackagesApplicationActionsProps {
  applicationId: string;
  onDeleteSuccess: () => void;
}

const SetupPackagesApplicationActions = ({
  applicationId,
  onDeleteSuccess,
}: SetupPackagesApplicationActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="flex gap-2">
      <button
        className="btn btn-sm"
        onClick={openModal}
        aria-label={t("setup.aria_delete_button")}
      >
        <FaTrash /> {t("setup.delete")}
      </button>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("setup.delete_confirmation")}
            </h3>
            <p className="py-4">{t("setup.delete_application_prompt")}</p>
            <p className="text-sm text-warning">
              {t("setup.delete_application_warning")}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("setup.cancel")}
              </button>
              <button className="btn btn-error">{t("setup.delete")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPackagesApplicationActions;
