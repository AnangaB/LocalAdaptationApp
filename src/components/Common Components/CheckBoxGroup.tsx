import { useState } from "react";
import { CheckBoxHeader } from "../../types/Search Bar/AdvancedSearchBarTypes";

interface CheckBoxGroupProps {
  groupName: CheckBoxHeader;
  CheckBoxOptions: string[];
  handleCheckboxOnClick: (key: string, option: string) => void;
  resetCheckBoxSelections: (key: string) => void;
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({
  groupName,
  CheckBoxOptions,
  handleCheckboxOnClick,
  resetCheckBoxSelections,
}) => {
  const [isShowingOptions, setIsShowingOptions] = useState<boolean>(false);

  const toggleVisibility = () => {
    setIsShowingOptions(!isShowingOptions);
    resetCheckBoxSelections(groupName);
  };

  return (
    <div className="p-0 w-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-10 p-1">
            <p className="font-weight-bold">{groupName}:</p>
          </div>

          <div className="col-2">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn p-0 border-0 bg-transparent"
                onClick={toggleVisibility}
                aria-label={isShowingOptions ? "Hide options" : "Show options"}
              >
                <i
                  className={
                    isShowingOptions
                      ? "bi bi-arrow-up-circle-fill"
                      : "bi bi-arrow-down-circle-fill"
                  }
                ></i>
              </button>
            </div>
          </div>
        </div>
        {isShowingOptions && (
          <div id={`${groupName}CheckBoxOptions`}>
            {CheckBoxOptions &&
              CheckBoxOptions.map((option) => (
                <div
                  className="form-check"
                  key={`${groupName}-${option}Checkbox`}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`$(key)_$(option)_checkbox`}
                    onClick={() => handleCheckboxOnClick(groupName, option)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`$(key)_$(option)_checkbox`}
                  >
                    {option}
                  </label>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CheckBoxGroup;
