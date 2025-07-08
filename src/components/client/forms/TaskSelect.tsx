"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import translation hook

interface ContactSelectProps {
  onChange: (value: string) => void;
}

const TaskSelect = ({ onChange }: ContactSelectProps) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{t("taskSelect.legend")}</legend>
      <label className="form-control w-full">
        <select
          className="select select-ghost bg-base-200 select-md w-full md:max-w-xs"
          value={selectedOption}
          onChange={handleChange}
          aria-label={t("taskSelect.aria.selectTask")}
          required
        >
          <option value="" disabled>
            {t("taskSelect.placeholder")}
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
      </label>
    </fieldset>
  );
};

export default TaskSelect;
