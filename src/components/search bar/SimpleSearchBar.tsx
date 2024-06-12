import { SearchParamProps } from "../../types/SearchParamProps";
//import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
//import SimpleSearchBar from "./SimpleSearchBar.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Popover } from "bootstrap";
import { useEffect } from "react";

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
  useEffect(() => {
    // Ensure Bootstrap is available and popovers are initialized
    const popoverTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new Popover(popoverTriggerEl);
    });
  }, []);

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <span className="navbar-brand h1">Local Adaptation Search</span>
        <div className="d-flex">
          <input
            className="form-control"
            id={`paperNameInput`}
            type="text"
            onChange={(event) =>
              handleFormChange(
                "Citation Key" as keyof SearchParamProps,
                new RegExp(
                  event.target.value.replace(
                    /[-[\]{}()*+?.,\\^$|]/gi, // Escape regex special characters
                    "\\$&"
                  ),
                  "gi"
                )
              )
            }
            placeholder="Enter Citation Key"
          ></input>

          <button
            type="button"
            className="btn btn-primary p-0 border-0 bg-transparent p-1"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-placement="bottom"
            data-bs-trigger="focus"
            data-bs-content={
              'Citation key for each paper is generated based on the authors\' names, the number of authors, and the date of publication. If a publication has only one author, Alice Smith, and the date of publication is 2000, then the citation key for it would be "Smith 2000". Similarly, if there are two authors, for example, Alice Smith and Bob Johnson, and the date of publication is 2000, the citation key would be "Smith & Johnson 2000". For publications with more than two authors, such as Alice Smith, Bob Johnson, and Carol Davis, and the date of publication is 2000, the citation key would be "Smith et al. 2000".'
            }
          >
            <i className="bi bi-info-circle-fill"></i>
          </button>
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
