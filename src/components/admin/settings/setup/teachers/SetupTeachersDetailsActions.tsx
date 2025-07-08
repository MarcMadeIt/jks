"use client";

import React, { useState } from "react";
import { FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

interface SetupTeachersDetailsActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const SetupTeachersDetailsActions = ({
  onEdit,
  onDelete,
}: SetupTeachersDetailsActionsProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // TODO: Implement deleteTeacher and updateTeacher actions
  const handleDelete = async () => {
    try {
      // await deleteTeacher(teacherId);
      closeModal();
      onDelete();
      window.dispatchEvent(new Event("teacherDeleted"));
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Dropdown menu on small screens */}
      <div className="sm:hidden">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn"
            aria-label={t("aria.setupTeachersDetailsActions.dropdownMenu")}
          >
            <FaEllipsis size={20} />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 gap-2 p-2 shadow"
          >
            <li>
              <button
                onClick={onEdit}
                aria-label={t("aria.setupTeachersDetailsActions.editButton")}
              >
                <FaPen /> {t("edit")}
              </button>
            </li>
            <li>
              <button
                onClick={openModal}
                aria-label={t("aria.setupTeachersDetailsActions.deleteButton")}
              >
                <FaTrash /> {t("delete")}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Buttons on larger screens */}
      <div className="hidden sm:flex gap-2 items-center">
        <button
          className="btn btn-sm"
          onClick={onEdit}
          aria-label={t("aria.setupTeachersDetailsActions.editButton")}
        >
          <FaPen /> {t("edit")}
        </button>
        <button
          className="btn btn-sm"
          onClick={openModal}
          aria-label={t("aria.setupTeachersDetailsActions.deleteButton")}
        >
          <FaTrash /> {t("delete")}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {t("teachersDetails.delete_teacher_confirmation")}
            </h3>
            <p className="py-4">{t("teachersDetails.delete_teacher_prompt")}</p>
            <p className="text-sm text-warning">
              {t("teachersDetails.delete_teacher_warning")}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("teachersDetails.cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("teachersDetails.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupTeachersDetailsActions;
