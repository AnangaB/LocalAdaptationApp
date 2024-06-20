import { SearchParamProps } from "../types/SearchParamProps";

//for a given row and given regex constraints selectedSearchParams, outputs a similairy score and whether the row fully matches the constraints in selectedSearchParams

const getRowValidityAndScore = (
    row: Record<string, any>,
    selectedSearchParams: SearchParamProps
  ) => {
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
          similarScore += 1;
        } else {
          isFullyMatching = false;
        }
      }
      return { isMatch: isFullyMatching, similarScore: similarScore };
    }
    return { isMatch: false, similarScore: 0 };
  };
  

  export const filterAllRows = (allRowsList:Record<string,string>[], SearchParams: SearchParamProps,
    setRowSimilarityScore: (scores: Record<number, number>) => void, setFullyMatchingRowsList: (rows: Record<string, any>[]) => void

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
  
        setRowSimilarityScore(similarScoresRecord);
        setFullyMatchingRowsList(rows);
      }

  }