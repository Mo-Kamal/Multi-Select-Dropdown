import { DROPDOWN_OPTIONS } from "@/constants/dropdownOptions";
import { MultiSelectDropDown } from "@/components/dropdown";
import styles from "./style.module.scss";
import { useState } from "react";
import { Option } from "@/types/dropdown";

export const Form: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Multi Select Dropdown</h1>
      <MultiSelectDropDown
        options={DROPDOWN_OPTIONS}
        selectedOptions={selectedOptions}
        onChange={(options) => setSelectedOptions(options)}
      />
    </div>
  );
};
