import { SearchParamProps } from "../../types/SearchParamProps";

interface SearchBarProps {
  selectedSearchParams: SearchParamProps;
  setSelectedSearchParams: (value: SearchParamProps) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  selectedSearchParams,
  setSelectedSearchParams,
}) => {
  const handleFormChange = (
    index: keyof SearchParamProps,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = { ...selectedSearchParams, [index]: event.target.value };
    setSelectedSearchParams(newData);
  };

  /* 
  const updateCurrentSearchParams: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setSelectedSearchParams({
      paperName: event.target.value,
    });
  }; */

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

  return (
    <div className="d-flex align-content-stretch flex-wrap">
      {Object.entries(searchTitles).map(([key, value]) =>
        Array.isArray(value) ? (
          <div key={`${key}InputDiv`} className="m-1 p-2">
            <label htmlFor={`${key}Input`}>{`${key}: `}</label>
            <select
              className="m-1"
              id={`${key}Input`}
              onChange={(event) =>
                handleFormChange(key as keyof SearchParamProps, event)
              }
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
    </div>
  );
};
export default SearchBar;
