import { SearchParamProps } from "../types/SearchParamProps";

//for a given row and given regex constraints selectedSearchParams, outputs a similairy score and whether the row fully matches the constraints in selectedSearchParams



const getRowValidityAndScore = (
    row: Record<string, any>,
    selectedSearchParams: SearchParamProps
  ) => {
    const weakSearchKeys = ["Eco-Evo Focus","Life history",
      "Ecological Loci/Traits",
      "Mating system",
      "Ploidy",
      "Selection",
      "Spatial Structure",
      "Population Size","Ecological Model",
      "Recurrent Mutation"]
    if (row) {
      let similarScore = 0;
      let isFullyMatching: boolean = true;

      for (const key of Object.keys(selectedSearchParams)) {
        const searchValue: RegExp =
          selectedSearchParams[key as keyof SearchParamProps] || /.*/gi;
        const rowValue = row[key]?.toString().trim().toLowerCase() || "";
        const matches = rowValue.match(searchValue);
        const isMatch = matches !== null;
  
        if (isMatch) {
          if(weakSearchKeys.includes(key)){
            similarScore += 1;
          }
        } else {
          isFullyMatching = false;
        }
      }
      return { isMatch: isFullyMatching, similarScore: similarScore };
    }
    return { isMatch: false, similarScore: 0 };
  };
  

  export const filterAllRows = (allRowsList:Record<string,string>[], SearchParams: SearchParamProps,
    setRowSimilarityScore: null | ((scores: Record<number, number>) => void), setFullyMatchingRowsList: null | ((rows: Record<string, any>[]) => void)

  ) => {

    if (allRowsList != null && allRowsList.length > 0) {
        let similarScoresRecord: Record<number, number> = {};
        let rows: Record<string, any>[] = [];
        for (let i = 0; i < allRowsList.length; i++) {
          let { isMatch, similarScore } = getRowValidityAndScore(
            allRowsList[i],
            SearchParams
          );
  
          similarScoresRecord[i] = similarScore;
  
          if (isMatch) {
            rows.push(allRowsList[i]);
          }
        }
        if(setRowSimilarityScore){
          setRowSimilarityScore(similarScoresRecord);
        }
        if(setFullyMatchingRowsList){
          setFullyMatchingRowsList(rows);
        }
      }

  }