"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { deleteFeature } from "@/lib/server/actions";

interface SetupPackagesApplicationActionsProps {
  featureId: string;
  onDeleteSuccess: () => void;
}

const SetupPackagesApplicationActions = ({
  featureId,
  onDeleteSuccess,
}: SetupPackagesApplicationActionsProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      await deleteFeature(featureId);
      onDeleteSuccess();
      closeModal();
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };

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
              <button className="btn btn-error" onClick={handleDelete}>
                {t("setup.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPackagesApplicationActions;
