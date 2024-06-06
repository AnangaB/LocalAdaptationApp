import { SearchParamProps } from "../../types/SearchParamProps";
import AdvancedSearchBar from "./AdvancedSearchBar.tsx";
import SimpleSearchBar from "./SimpleSearchBar.tsx";

interface SearchBarProps {
  selectedSearchParams: SearchParamProps;
  setSelectedSearchParams: (value: SearchParamProps) => void;
  advancedSearchButtonOnClick: (isAdvancedMode: boolean) => void;
  isAdvancedSearchMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  selectedSearchParams,
  setSelectedSearchParams,
  advancedSearchButtonOnClick,
  isAdvancedSearchMode,
}) => {
  //function to call whenever, user makes changes to search menu
  const handleFormChange = (index: keyof SearchParamProps, value: RegExp) => {
    if (String(value) === String("/(?:)/")) {
      value = /.*/;
      console.log("foind ? thing");
    }
    const newData = {
      ...selectedSearchParams,
      [index]: value,
    };
    setSelectedSearchParams(newData);
    console.log(newData);
  };

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
    <div className="bg-info p-3 m-0 container-fluid">
      <p className="h1">Local Adaptation Search</p>

      {!isAdvancedSearchMode ? (
        <div className="row">
          <div className="col-sm-10">
            <SimpleSearchBar handleFormChange={handleFormChange} />
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => advancedSearchButtonOnClick(isAdvancedSearchMode)}
            >
              Advanced
            </button>
          </div>
        </div>
      ) : (
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
    </div>
  );
};
export default SearchBar;
