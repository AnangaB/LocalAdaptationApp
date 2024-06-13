import { useState } from "react";
import { SearchParamProps } from "../../types/SearchParamProps";
import "bootstrap-icons/font/bootstrap-icons.css";
import CheckBoxGroup from "./CheckBoxGroup";

interface AdvancedSearchBarProps {
  handleFormChange: (index: keyof SearchParamProps, event: RegExp) => void;
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  handleFormChange,
}) => {
  //each search parameter as collected from the excel sheet,
  //either takes in user text input or is a checkbox or should not be displayed

  enum SearchType {
    DisplayNone,
    Checkbox,
    TextSearch,
  }

  const searchTitles: Record<keyof SearchParamProps, SearchType> = {
    Index: SearchType.DisplayNone,
    "Citation Key": SearchType.DisplayNone,
    Authors: SearchType.TextSearch,
    Year: SearchType.TextSearch,
    Journal: SearchType.TextSearch,
    "Journal ISO Abbreviation": SearchType.TextSearch,
    Title: SearchType.TextSearch,
    Abstract: SearchType.TextSearch,
    DOI: SearchType.TextSearch,
    ISSN: SearchType.DisplayNone,
    url: SearchType.DisplayNone,
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

  //for checkbox search types, record their options
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
    /*console.log(
      "handleCheckboxOnClick invoked with key: ",
      key,
      " and newregex: ",
      newRegex
    );*/

    handleFormChange(key as keyof SearchParamProps, newRegex);
  };

  //function to reset checkboxes
  const resetCheckBoxSelections: (checkBoxGroupName: string) => void = (
    checkBoxGroupName
  ) => {
    //console.log("reset called on key: ", checkBoxGroupName);

    const currentSelections = checkboxSelections[checkBoxGroupName];

    const newSelections = Object.keys(currentSelections).reduce(
      (acc, option) => {
        acc[option] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );
    //console.log("print newSelections: ", newSelections);

    setCheckboxSelections((prevSelections) => ({
      ...prevSelections,
      [checkBoxGroupName]: newSelections,
    }));
    handleFormChange(checkBoxGroupName as keyof SearchParamProps, /.*/);
  };

  return (
    <div className="bg-light row p-2">
      {Object.entries(searchTitles).map(([key, value]) => {
        if (value == SearchType.TextSearch) {
          return (
            <div key={`${key}InputDiv`} className="p-2 col-12 align-self-top">
              <label htmlFor={`${key}Input`}>{`${key}: `}</label>

              <input
                className="m-1 form-control"
                id={`${key}Input`}
                type="text"
                onChange={(event) =>
                  handleFormChange(
                    key as keyof SearchParamProps,
                    new RegExp(
                      event.target.value.replace(
                        /[-[\]{}()*+?.,\\^$|]/g, // Escape regex special characters
                        "\\$&"
                      ),
                      "gi"
                    )
                  )
                }
                placeholder={`${key} Input`}
              ></input>
            </div>
          );
        } else if (value == SearchType.Checkbox) {
          return (
            <CheckBoxGroup
              key={`${key}InputDiv`}
              groupName={key}
              CheckBoxOptions={searchCheckBoxOptions[key]}
              handleCheckboxOnClick={handleCheckboxOnClick}
              resetCheckBoxSelections={resetCheckBoxSelections}
            />
          );
        }
      })}
    </div>
  );
};
export default AdvancedSearchBar;
