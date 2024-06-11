import { SearchParamProps } from "../../types/SearchParamProps";
//import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
//import SimpleSearchBar from "./SimpleSearchBar.tsx";

interface SearchBarProps {
  advancedSearchButtonOnClick: (isAdvancedMode: boolean) => void;
  isAdvancedSearchMode: boolean;
  handleFormChange: (index: keyof SearchParamProps, event: RegExp) => void;
}

const SimpleSearchBar: React.FC<SearchBarProps> = ({
  advancedSearchButtonOnClick,
  isAdvancedSearchMode,
  handleFormChange,
}) => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <span className="navbar-brand h1">Local Adaptation Search</span>
        <div>
          <input
            className="form-control"
            id={`paperNameInput`}
            type="text"
            onChange={(event) =>
              handleFormChange(
                "Paper Name" as keyof SearchParamProps,
                new RegExp(
                  event.target.value.replace(
                    /[-[\]{}()*+?.,\\^$|]/g, // Escape regex special characters
                    "\\$&"
                  ),
                  "gi"
                )
              )
            }
            placeholder="Enter Citation Key"
          ></input>
        </div>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
        >
          {isAdvancedSearchMode ? "Hide Advanced" : "Advanced"}
        </button>
      </div>
    </nav>
  );
};
export default SimpleSearchBar;
