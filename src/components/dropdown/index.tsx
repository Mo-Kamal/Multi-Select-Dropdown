import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.scss";
import ArrowUp from "@/assets/up-arrow.svg";
import ArrowDown from "@/assets/down-arrow.svg";
import { Option } from "@/types/dropdown";
/**
 * MultiSelectDropDown Component
 *
 * A reusable multi select dropdown
 *
 * Props:
 * - options (Option[]): Initial list of options.
 * - selectedOptions (Option[]): Currently selected options.
 * - onChange (function): Callback triggered when selected options change.
 * - placeholder (string, optional): Placeholder text for the input field.
 *
 * */
interface MultiSelectDropDownProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
}

export const MultiSelectDropDown: React.FC<MultiSelectDropDownProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = "Type...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState<Option[]>(options);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    // Attach the event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    // Select the option if not already selected
    if (
      !selectedOptions.some(
        (o) => o.value.toLocaleLowerCase() === option.value.toLocaleLowerCase()
      )
    ) {
      const updatedOptions = [...selectedOptions, option];
      onChange(updatedOptions);
    } else {
      // Deselect the option if already selected
      const updatedOptions = selectedOptions.filter(
        (o) => o.value.toLocaleLowerCase() !== option.value.toLocaleLowerCase()
      );
      onChange(updatedOptions);
    }
  };

  const handleAddOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      // If option already exists, clear the input
      if (
        dropdownOptions.some(
          (o) => o.value.toLowerCase() === inputValue.toLowerCase()
        )
      ) {
        setInputValue("");
        return;
      }
      // add new option, select it and clear input
      const newOption = {
        label: inputValue,
        value: inputValue,
      };
      setDropdownOptions((prev) => [newOption, ...prev]);
      const updatedOptions = [...selectedOptions, newOption];
      onChange(updatedOptions);
      setInputValue("");
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {/* --- Select input --- */}
      <div
        className={`${styles.inputWrapper} ${
          isOpen ? styles.inputWrapperfocus : ""
        }`}
      >
        <div className={styles.selectedOptions}>
          {selectedOptions?.length > 2
            ? `${selectedOptions?.length} items selected`
            : selectedOptions.map((option, idx) => (
                <div key={idx} className={styles.selectedOption}>
                  {option.label}
                </div>
              ))}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddOption}
          className={styles.input}
          onFocus={() => setIsOpen(true)}
        />

        <img
          src={isOpen ? ArrowUp : ArrowDown}
          alt="arrow"
          className={styles.arrow}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {/* --- Select DropDown Menu --- */}
      {isOpen && (
        <div className={styles.dropdown}>
          {dropdownOptions.map((option, idx) => (
            <div
              key={idx}
              className={`${styles.option} ${
                selectedOptions.some(
                  (o) =>
                    o.value.toLocaleLowerCase() ===
                    option.value.toLocaleLowerCase()
                )
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <div className={styles.labelIconWrapper}>
                <div>{option.label}</div>
                {/* --- Icon --- */}
                {option.icon ? (
                  <img
                    src={option.icon}
                    alt={option.label}
                    className={styles.icon}
                  />
                ) : (
                  <></>
                )}
              </div>
              {selectedOptions.some(
                (o) =>
                  o.value.toLocaleLowerCase() ===
                  option.value.toLocaleLowerCase()
              ) ? (
                <span className={styles.check}>&#10003;</span>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
