"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SetupPackagesDetails from "./packages/SetupPackagesDetails";
import SetupPackages from "./packages/SetupPackages";
import SetupTeachers from "./teachers/SetupTeachers";
import SetupTeachersDetails from "./teachers/SetupTeachersDetails";
import SetupTeachersCreate from "./teachers/SetupTeachersCreate";

const Setup = () => {
  const { t } = useTranslation();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isViewingPackageDetails, setIsViewingPackageDetails] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Teacher state
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isViewingTeacherDetails, setIsViewingTeacherDetails] = useState(false);
  const [showTeacherToast, setShowTeacherToast] = useState(false);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);

  const handlePackageDetailsToggle = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsViewingPackageDetails(!!pkg);
  };

  const handleBackToMain = () => {
    setIsViewingPackageDetails(false);
    setIsViewingTeacherDetails(false);
  };

  const handlePackageDelete = () => {
    setIsViewingPackageDetails(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Teacher handlers
  const handleTeacherEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setIsViewingTeacherDetails(true);
  };

  const handleTeacherCreate = () => {
    setSelectedTeacher(null);
    setIsViewingTeacherDetails(false);
    setIsCreatingTeacher(true);
  };

  const handleTeacherCreateBack = () => {
    setIsCreatingTeacher(false);
  };

  const handleTeacherCreateSave = () => {
    setIsCreatingTeacher(false);
    // evt. vis toast eller reload liste
  };

  const handleTeacherDelete = () => {
    setIsViewingTeacherDetails(false);
    setShowTeacherToast(true);
    setTimeout(() => setShowTeacherToast(false), 3000);
  };

  return (
    <div className="">
      {isViewingPackageDetails ? (
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupPackagesDetails
            packageId={selectedPackage?.id}
            onBack={handleBackToMain}
            onDelete={handlePackageDelete}
          />
        </div>
      ) : isViewingTeacherDetails ? (
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupTeachersDetails
            teacherId={selectedTeacher?.id}
            onBack={handleBackToMain}
            onDelete={handleTeacherDelete}
          />
        </div>
      ) : isCreatingTeacher ? (
        <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
          <SetupTeachersCreate
            onSave={handleTeacherCreateSave}
            onBack={handleTeacherCreateBack}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
            <SetupPackages onDetails={handlePackageDetailsToggle} />
          </div>
          <div className="bg-base-100 rounded-lg shadow-md p-5 md:p-7">
            <SetupTeachers
              onDetails={handleTeacherEdit}
              onCreate={handleTeacherCreate}
            />
          </div>
        </div>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("setup.deleted_package")}
            </span>
          </div>
        </div>
      )}
      {showTeacherToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {t("setup.deleted_teacher")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setup;
