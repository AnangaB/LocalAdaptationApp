import "bootstrap-icons/font/bootstrap-icons.css";
import { Popover } from "bootstrap";
import { useEffect } from "react";
import { DataSetFilters } from "../../../types/Datasets/DatasetTypes";
import { convertStringToRegex } from "../../../logic/Search Bar/ConvertStringsToRegex";

interface SearchBarProps {
  advancedSearchButtonOnClick: (isAdvancedMode: boolean) => void;
  isAdvancedSearchMode: boolean;
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void;
}

const SimpleSearchBar: React.FC<SearchBarProps> = ({
  advancedSearchButtonOnClick,
  isAdvancedSearchMode,
  handleFormChange,
}) => {
  //Handles popover side search bar, explaining citation key
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
    <div className="p-1 container-fluid search-bar">
      <div className="row">
        <div className="col-lg-10 col-8">
          <form className="form-inline d-flex">
            <input
              className="form-control"
              id={`paperNameInput`}
              type="text"
              onChange={(event) =>
                handleFormChange(
                  "Citation Key" as keyof DataSetFilters,
                  convertStringToRegex(event.target.value)
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
              <i className="bi bi-info-circle-fill text-secondary"></i>
            </button>
          </form>
        </div>
        <div className="col-lg-2 col-4">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
          >
            {isAdvancedSearchMode ? "Hide Advanced Menu" : "Show Advanced Menu"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SimpleSearchBar;
