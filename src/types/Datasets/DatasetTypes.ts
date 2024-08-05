// List of headers
export const headers = [
"Index",
"Citation Key",
"Paper Name",
"Authors",
"Year",
"Journal",
"Title",
"Abstract",
"Open Access",
"Journal ISO Abbreviation",
"Reviewer 1",
"Reviewer 2",
"Scope",
"Eco-Evo Focus",
"Metric",
"Life history",
"Ecological Loci/Traits",
"Additional Loci/Traits",
"Mating system",
"Ploidy",
"Selection",
"Spatial Structure",
"Population Size",
"Ecological Model",
"Recurrent Mutation",
"IBS",
"DOI",
"ISSN",
"url",
] as const;

// Type for headers
export type DataHeaders = typeof headers[number];

// Type for a row in the dataset
export type DataRow = Record<DataHeaders, string>;

// Type for the dataset
export type Dataset = DataRow[];

// Define filters for dataset rows
export type DataSetFilters = Record<DataHeaders, RegExp>;

// Type for storing similarity scores between each row in a dataset and a dataset filter
export type RowSimilarityScores = Map<string, Number>;

// Returns an empty data row with all values initialized as ""
export function getEmptyDataRow(): DataRow {
return headers.reduce((row, header) => {
    row[header] = "";
    return row;
}, {} as DataRow);
}

// Get empty filters
export function getEmptyDataFilter(): DataSetFilters {
return headers.reduce((filters, header) => {
    filters[header] = /.*/;
    return filters;
}, {} as DataSetFilters);
}

// Returns whether a string key is a valid Data Row key
export function isDataRowKey(key: string): key is DataHeaders {
return headers.includes(key as DataHeaders);
}
