import { SearchParamProps } from "../../types/SearchParamProps";
//import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
//import SimpleSearchBar from "./SimpleSearchBar.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Popover } from "bootstrap";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="navbar-nav">
        <span className="navbar-brand px-1">
          <Link
            to="/LocalAdaptationApp"
            onClick={refreshPage}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Local Adaptation Model Search
          </Link>
        </span>
        <Link
          to={`/LocalAdaptationApp/graphs`}
          className="text-light nav-item nav-link"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Graphs
        </Link>
        <form className="form-inline d-flex">
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
        </form>
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
        >
          {isAdvancedSearchMode ? "Hide Advanced" : "Advanced"}
        </button>
      </div>
    </nav>
  );
};
export default SimpleSearchBar;
