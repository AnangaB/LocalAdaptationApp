import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import CheckBoxGroup from "./CheckBoxGroup";
import { DataSetFilters } from "../../types/Datasets/DatasetTypes";
import {
  searchCheckBoxOptions,
  searchTitles,
  SearchType,
} from "../../types/Advanced Search Bar/AdvancedSearchBar";

interface AdvancedSearchBarDisplayProps {
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void; // index is the column type of our main data, such as Authors, and event is output from clicking on checkboxes or typing values in search bar, expressed as regex, used for filtering
}

const AdvancedSearchBarDisplay: React.FC<AdvancedSearchBarDisplayProps> = ({
  handleFormChange,
}) => {
  //each search parameter as collected from the excel sheet,
  //either takes in user text input or is a checkbox or should not be displayed

  //store state for checkbox
  const [checkboxSelections, setCheckboxSelections] = useState<
    Record<string, Record<string, boolean>>
  >(
    Object.keys(searchCheckBoxOptions).reduce((acc, key) => {
      acc[key] = searchCheckBoxOptions[key].reduce((innerAcc, option) => {
        innerAcc[option] = false;
        return innerAcc;
      }, {} as Record<string, boolean>);
      return acc;
    }, {} as Record<string, Record<string, boolean>>)
  );

  const handleCheckboxOnClick: (key: string, option: string) => void = (
    key,
    option
  ) => {
    const newCheckBoxSelections: Record<string, Record<string, boolean>> = {
      ...checkboxSelections,
      [key]: {
        ...checkboxSelections[key],
        [option]: !checkboxSelections[key][option],
      },
    };
    setCheckboxSelections(newCheckBoxSelections);
    const regexString = Object.keys(newCheckBoxSelections[key])
      .filter((val) => newCheckBoxSelections[key][val])
      .map((t) =>
        t.replace(
          /[-[\]{}()*+?.,\\^$|]/g, // Escape regex special characters
          "\\$&"
        )
      )
      .join("|");
    let newRegex: RegExp = new RegExp(regexString, "ig");
    if (
      !regexString ||
      Object.values(newCheckBoxSelections[key]).every(
        (value: boolean) => value === false
      )
    ) {
      newRegex = /.*/;
    }

    handleFormChange(key as keyof DataSetFilters, newRegex);
  };

  //function to reset checkboxes
  const resetCheckBoxSelections: (checkBoxGroupName: string) => void = (
    checkBoxGroupName
  ) => {
    //console.log("reset called on key: ", checkBoxGroupName);

    const currentSelections = checkboxSelections[checkBoxGroupName];

    const newSelections = Object.keys(currentSelections).reduce(
      (acc, option) => {
        acc[option] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );
    //console.log("print newSelections: ", newSelections);

    setCheckboxSelections((prevSelections) => ({
      ...prevSelections,
      [checkBoxGroupName]: newSelections,
    }));
    handleFormChange(checkBoxGroupName as keyof DataSetFilters, /.*/);
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
                    new RegExp(
                      event.target.value.replace(
                        /[-[\]{}()*+?.,\\^$|]/g, // Escape regex special characters
                        "\\$&"
                      ),
                      "gi"
                    )
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
