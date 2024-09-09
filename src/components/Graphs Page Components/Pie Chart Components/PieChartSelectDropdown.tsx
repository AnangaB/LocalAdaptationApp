import "bootstrap/js/dist/dropdown";
import { useState } from "react";

type PieChartSelectDropdownProps = {
  options: string[];
  optionOnClick: (text: string) => void;
  activeButtonName: string;
};

const PieChartSelectDropdown: React.FC<PieChartSelectDropdownProps> = ({
  options,
  optionOnClick,
  activeButtonName,
}) => {
  const [isDropDownDisplaying, setIsDropDownDisplaying] = useState(false);
  const toggleDropDown = () => {
    if (isDropDownDisplaying) {
      setIsDropDownDisplaying(false);
    } else {
      setIsDropDownDisplaying(true);
    }
  };
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle w-100"
        type="button"
        id="dropdownMenuButton"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={toggleDropDown}
      >
        Select Pie Chart Type
      </button>
      <div
        className={
          isDropDownDisplaying ? "w-100 dropdown-menu show" : "dropdown-menu"
        }
        aria-labelledby="dropdownMenuButton"
      >
        {options.map((option, index) => (
          <button
            key={index}
            className={
              option == activeButtonName
                ? "dropdown-item active"
                : "dropdown-item"
            }
            onClick={() => {
              setIsDropDownDisplaying(false);
              optionOnClick(option);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PieChartSelectDropdown;
