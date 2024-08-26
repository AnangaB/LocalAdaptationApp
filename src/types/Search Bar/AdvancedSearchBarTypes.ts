import { DataHeaders } from "../Datasets/DatasetTypes";
//describes whether a header in DataHeaders should not be displayed in the advanced menu, or should be a checkbox or should be text search
export enum SearchType {
    DisplayNone,
    Checkbox,
    TextSearch,
  }
//assigns a search type to each header in the advanced search bar menu
  export const searchTitles: Record<DataHeaders, SearchType> = {
    Index: SearchType.DisplayNone,
    "Citation Key": SearchType.DisplayNone,
    "Paper Name": SearchType.DisplayNone,
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
    Scope: SearchType.DisplayNone,
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

  // List of headers that appear as checkboxes
  const checkboxKeys = Object.keys(searchTitles).filter(key => searchTitles[key as DataHeaders] === SearchType.Checkbox);
  //type for checkboxKeys values
  export type CheckBoxHeader = typeof checkboxKeys[number];
  
  //type to decribe a record of Checkbox headers and thier corresponding options
  export type CheckBoxItems = Record<CheckBoxHeader, string[]>
  //for checkbox search types, record their options
  export const searchCheckBoxOptions: CheckBoxItems= {
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

  //intialize an record setting all possible checkbox selections to be false
  //type to decribe a record of Checkbox headers and thier corresponding options
  export type CheckboxActivationTracker = Record<CheckBoxHeader, Record<string, boolean>>

  export function getEmptyCheckboxActivationTracker(){
    return Object.keys(searchCheckBoxOptions).reduce((acc, key) => {
      acc[key as CheckBoxHeader] = searchCheckBoxOptions[key as CheckBoxHeader].reduce((innerAcc, option) => {
        innerAcc[option as string] = false;
        return innerAcc;
      }, {} as Record<string, boolean>);
      return acc;
    }, {} as CheckboxActivationTracker)
  }