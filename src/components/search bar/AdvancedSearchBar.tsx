import { useState } from "react";
import { SearchParamProps } from "../../types/SearchParamProps";

interface AdvancedSearchBarProps {
  handleFormChange: (index: keyof SearchParamProps, event: RegExp) => void;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  handleFormChange,
}) => {
  /* 
  const updateCurrentSearchParams: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    setSelectedSearchParams({
      paperName: event.target.value,
    });
  };*/
  enum SearchType {
    DisplayNone,
    Checkbox,
    TextSearch,
  }
  const searchTitles: Record<keyof SearchParamProps, SearchType> = {
    Index: SearchType.DisplayNone,
    "Paper Name": SearchType.TextSearch,
    Authors: SearchType.TextSearch,
    Year: SearchType.TextSearch,
    Journal: SearchType.TextSearch,
    Title: SearchType.TextSearch,
    Abstract: SearchType.TextSearch,
    "Open Access": SearchType.DisplayNone,
    "Reviewer 1": SearchType.DisplayNone,
    "Reviewer 2": SearchType.DisplayNone,
    Scope: SearchType.Checkbox,
    "Eco-Evo Focus": SearchType.Checkbox,
    Metric: SearchType.DisplayNone,
    "Life history": SearchType.Checkbox,
    "Ecological Loci/Traits": SearchType.Checkbox,
    "Additional Loci/Traits": SearchType.DisplayNone,
    "Mating system": SearchType.Checkbox,
    Ploidy: SearchType.Checkbox,
    Selection: SearchType.Checkbox,
    "Spatial Structure": SearchType.Checkbox,
    "Population Size": SearchType.Checkbox,
    "Ecological Model": SearchType.Checkbox,
    "Recurrent Mutation": SearchType.Checkbox,
    IBS: SearchType.Checkbox,
  };

  const searchCheckBoxOptions: Record<string, string[]> = {
    Scope: [
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
    "Life history": ["Discrete", "Continous", "Unknown"],
    "Ecological Loci/Traits": [
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
    "Mating system": [
      "Asex",
      "Hermaphrodite",
      "Diecious",
      "Dimorphic",
      "Self-fertilization",
      "Unknown",
      "NA",
    ],
    Ploidy: ["Haploid", "Diploid", "Haplodiploid", "Other", "Unknown", "NA"],
    Selection: [
      "Gaussian/Quad Stab",
      "GFG",
      "MAM",
      "Pheno Diff/Pheno Match",
      "Other",
      "Unknown",
    ],
    "Spatial Structure": [
      "2-patch",
      "Metapopulation (Finite or Infinite)",
      "Island Mainland",
      "Stepping Stone(1D,2D)",
      "Continous Space (1D or 2D)",
      "Other",
      "Unknown",
    ],
    "Population Size": ["Finite", "Infinite", "Both", "Other"],
    "Ecological Model": [
      "Constant",
      "Stochastic",
      "Intraspecific Competition",
      "Interspecific Competition",
      "Epidemiological",
      "Other",
      "Unknown",
    ],
    "Recurrent Mutation": [
      "Yes",
      "No",
      "Other",
      "Adaptive Dynamics",
      "Unknown",
    ],
    IBS: ["IBS", "Analytical Model", "Both", "Unknown"],
  };
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

    console.log("prior checkboxSelections: ", checkboxSelections);
    console.log("new checkboxSelections: ", newCheckBoxSelections);

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

    console.log("string of new regex: ", regexString);
    console.log("the actual new regex: ", newRegex);

    handleFormChange(key as keyof SearchParamProps, newRegex);
  };

  return (
    <div className="row">
      {Object.entries(searchTitles).map(([key, value]) => {
        if (value == SearchType.TextSearch) {
          return (
            <div
              key={`${key}InputDiv`}
              className="p-2 col-md-4 col-lg-3 align-self-center"
            >
              <label className="h5" htmlFor={`${key}Input`}>{`${key}: `}</label>

              <input
                className="m-1"
                id={`${key}Input`}
                type="text"
                onChange={(event) =>
                  handleFormChange(
                    key as keyof SearchParamProps,
                    new RegExp(
                      event.target.value.replace(
                        /[-[\]{}()*+?.,\\^$|]/g, // Escape regex special characters
                        "\\$&"
                      )
                    )
                  )
                }
                placeholder={`${key} Input`}
              ></input>
            </div>
          );
        } else if (value == SearchType.Checkbox) {
          return (
            <div
              key={`${key}InputDiv`}
              className="p-2 col-12 col-lg-3 align-self-center"
            >
              <div className="row">
                <p className="h3">{key}:</p>
              </div>
              <div className="row">
                {searchCheckBoxOptions[key] &&
                  searchCheckBoxOptions[key].map((option) => (
                    <div
                      className="form-check col-6"
                      key={`${key}-${option}Checkbox`}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id={`$(key)_$(option)_checkbox`}
                        onClick={() => handleCheckboxOnClick(key, option)}
                      />
                      <label
                        className="form-check-label h6"
                        htmlFor={`$(key)_$(option)_checkbox`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          );
        }
      })}
    </div>
  );

  /**
  return (
    <div key="paperNameSearchDiv" className="m-1 p-2">
      <label htmlFor={`paperName`}>{`Paper Name: `}</label>
      <input
        className="m-1"
        id={`paperNameInput`}
        type="text"
        onChange={(event) =>
          handleFormChange("Paper Name" as keyof SearchParamProps, event)
        }
        placeholder="Paper Name Input"
      ></input>
    </div>
  );**/
};
export default AdvancedSearchBar;
