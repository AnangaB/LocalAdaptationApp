import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import CheckBoxGroup from "./CheckBoxGroup";
import { DataSetFilters } from "../../types/Datasets/DatasetTypes";
import {
  CheckboxActivationTracker,
  CheckBoxHeader,
  getEmptyCheckboxActivationTracker,
  searchCheckBoxOptions,
  searchTitles,
  SearchType,
} from "../../types/Search Bar/AdvancedSearchBarTypes";
import {
  convertStringListToRegex,
  convertStringToRegex,
} from "../../logic/Search Bar/ConvertStringsToRegex";

interface AdvancedSearchBarDisplayProps {
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void; // index is the column type of our main data, such as Authors, and event is output from clicking on checkboxes or typing values in search bar, expressed as regex, used for filtering
}

const AdvancedSearchBarDisplay: React.FC<AdvancedSearchBarDisplayProps> = ({
  handleFormChange,
}) => {
  //each search parameter as collected from the excel sheet,
  //either takes in user text input or is a checkbox or should not be displayed

  //store state for checkbox
  const [checkboxSelections, setCheckboxSelections] =
    useState<CheckboxActivationTracker>(getEmptyCheckboxActivationTracker());

  //handles when a check box is clicked, which then updates checkboxSelections
  const handleCheckboxOnClick: (key: CheckBoxHeader, option: string) => void = (
    key,
    option
  ) => {
    const newCheckBoxSelections: CheckboxActivationTracker = {
      ...checkboxSelections,
      [key]: {
        ...checkboxSelections[key],
        [option]: !checkboxSelections[key][option],
      },
    };
    setCheckboxSelections(newCheckBoxSelections);
    handleFormChange(
      key as keyof DataSetFilters,
      convertStringListToRegex(
        Object.keys(newCheckBoxSelections[key]).filter(
          (val) => newCheckBoxSelections[key][val]
        )
      ) // creates a regex that matche with
    );
  };

  //function to reset checkboxes
  const resetCheckBoxSelections: (checkBoxGroupName: CheckBoxHeader) => void = (
    checkBoxGroupName
  ) => {
    const currentSelections = checkboxSelections[checkBoxGroupName];

    const newSelections = Object.keys(currentSelections).reduce(
      (acc, option) => {
        acc[option] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );

    setCheckboxSelections((prevSelections) => ({
      ...prevSelections,
      [checkBoxGroupName]: newSelections,
    }));
    handleFormChange(checkBoxGroupName as keyof DataSetFilters, /.*/i);
  };

  return (
    <div className="bg-light row p-2">
      {Object.entries(searchTitles).map(([key, value]) => {
        if (value == SearchType.TextSearch) {
          return (
            <div key={`${key}InputDiv`} className="p-2 col-12 align-self-top">
              <label htmlFor={`${key}Input`}>{`${key}: `}</label>

              <input
                className="m-1 form-control"
                id={`${key}Input`}
                type="text"
                onChange={(event) =>
                  handleFormChange(
                    key as keyof DataSetFilters,
                    convertStringToRegex(event.target.value)
                  )
                }
                placeholder={`${key} Input`}
              ></input>
            </div>
          );
        } else if (value == SearchType.Checkbox) {
          return (
            <CheckBoxGroup
              key={`${key}InputDiv`}
              groupName={key}
              CheckBoxOptions={searchCheckBoxOptions[key]}
              handleCheckboxOnClick={handleCheckboxOnClick}
              resetCheckBoxSelections={resetCheckBoxSelections}
            />
          );
        }
      })}
    </div>
  );
};
export default AdvancedSearchBarDisplay;
