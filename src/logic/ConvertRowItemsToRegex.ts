import { SearchParamProps } from "../types/SearchParamProps";

export const covertRowItemsToRegex = (row:Record<string,string>) => {
    let output: SearchParamProps ={
        Index: /.*/,
        "Citation Key": /.*/,
        Authors: /.*/,
        Year: /.*/,
        Journal: /.*/,
        "Journal ISO Abbreviation": /.*/,
        Title: /.*/,
        Abstract: /.*/,
        "Open Access": /.*/,
        "Reviewer 1": /.*/,
        "Reviewer 2": /.*/,
        Scope: /.*/,
        "Eco-Evo Focus": /.*/,
        Metric: /.*/,
        "Life history": /.*/,
        "Ecological Loci/Traits": /.*/,
        "Additional Loci/Traits": /.*/,
        "Mating system": /.*/,
        Ploidy: /.*/,
        Selection: /.*/,
        "Spatial Structure": /.*/,
        "Population Size": /.*/,
        "Ecological Model": /.*/,
        "Recurrent Mutation": /.*/,
        IBS: /.*/,
        DOI: /.*/,
        ISSN: /.*/,
        url: /.*/,
      };

    if (row) {
        Object.keys(row).forEach((k) => {
            if (k in output) {
                let value = String(row[k])
                .replace("))", ")")
                .replace("(", "\(")
                .replace(")", "\)");
                console.log(value)
                if (String(value) && String(value).length > 0) {
                    output[k as keyof SearchParamProps] = new RegExp(value, "ig");
                    console.log(new RegExp(value, "ig"), value,String(row[k]))
                }
            }
        
        })
    }
    
    return output;

  }