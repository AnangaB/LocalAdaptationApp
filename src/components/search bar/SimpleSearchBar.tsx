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
  /* 
  const updateCurrentSearchParams: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setSelectedSearchParams({
      paperName: event.target.value,
    });
  }; */
  /**
  const searchTitles: Record<keyof SearchParamProps, any> = {
    "Paper Name": "string",
    Authors: "string",
    Year: "string",
    Journal: "string",
    Title: "string",
    Abstract: "string",
    "Open Access": "string",
    "Reviewer 1": "string",
    "Reviewer 2": "string",
    Scope: [
      "",
      "Single Model",
      "Multi Model",
      "Not a MS Model",
      "Review",
      "Meta-analysis",
      "Data Analysis",
      "PDF Not Available",
      "Other",
    ],
    "Eco-Evo Focus": [
      "",
      "Variation (Divergence)",
      "Pop. Persistance and Conservation",
      "Coevolution",
      "Range Dynamic",
      "Evol. Processes",
      "Repeatability",
      "Other",
      "Unknown",
      "NA",
    ],
    Metric: "string",
    "Life history": ["", "Discrete", "Continous", "Unknown"],
    "Ecological Loci/Traits": [
      "",
      "1 Locus/2 allele",
      "2 Loci",
      "Multi_locus(>2 loci)",
      "Multi-allelic",
      "1 trait",
      "Multi-traits",
      "NA",
      "Other",
      "Unknown",
    ],
    "Additional Loci/Traits": "string",
    "Mating system": "string",
    Ploidy: "string",
    Selection: "string",
    "Spatial Structure": "string",
    "Population Size": "string",
    "Ecological Model": "string",
    "Recurrent Mutation": "string",
    IBS: "string",
  };


   *   {Object.entries(searchTitles).map(([key, value]) =>
        Array.isArray(value) ? (
          <div key={`${key}InputDiv`} className="m-1 p-2">
            <label htmlFor={`${key}Input`}>{`${key}: `}</label>
            <select
              className="m-1"
              id={`${key}Input`}
              // onChange={(event) =>
              // handleFormChange(key as keyof SearchParamProps, event)
              //}
            >
              {value.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div key={`${key}InputDiv`} className="m-1 p-2">
            <label htmlFor={`${key}Input`}>{`${key}: `}</label>
            <input
              className="m-1"
              id={`${key}Input`}
              type="text"
              onChange={(event) =>
                handleFormChange(key as keyof SearchParamProps, event)
              }
              placeholder={`${key} Input`}
            ></input>
          </div>
        )
      )}
   * 
   */
  return (
    <div className="bg-info fixed-top">
      <p className="h1">Local Adaptation Search</p>

      <div className="row  justify-content-between align-self-end">
        <div className="col-sm-3">
          <div key="paperNameSearchDiv" className="m-1 p-2">
            <label htmlFor={`paperName`}>
              <p className="h5">Paper Name:</p>
            </label>
            <input
              className="m-1 form-control"
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
                    "ig"
                  )
                )
              }
              placeholder="Paper Name Input"
            ></input>
          </div>{" "}
        </div>
        <div className="col-sm-2 p-1 m-3">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
          >
            {isAdvancedSearchMode ? "Hide Advanced" : "Advanced"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SimpleSearchBar;
/*

      {isAdvancedSearchMode && (
        <>
          <div className="container">
            <AdvancedSearchBar handleFormChange={handleFormChange} />

            <button
              type="button"
              className="m-1 btn btn-danger"
              onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
            >
              Hide Advanced
            </button>
          </div>
        </>
      )}
    </div>*/
