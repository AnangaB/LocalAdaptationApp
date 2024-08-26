import { Combination}  from "js-combinatorics";
import { RawNodeDatum } from "react-d3-tree";
import { DataHeaders, DataRow, Dataset, RowSimilarityScores, weakKeysList } from "../../../types/Datasets/DatasetTypes";
import { TreeNode } from "./Node";
import { WeakKeysRecordType } from "../../../types/Graphs/TreeGraphTypes";



const treeToString = (node: TreeNode, level = 0) => {
    const indent = ' '.repeat(level * 2); // Use spaces for indentation
    //let result = `${indent}TreeNode: { similarValues: ${JSON.stringify(node.similarValues)}, paperIds: [${Array.from(node.paperIds).join(', ')}] }\n`;
     let result = `${indent}paperIds: [${Array.from(node.paperIds).join(', ')}] } ${Object.keys(node.similarValues).length}\n`;
    node.children.forEach((child: any) => {
        result += treeToString(child, level + 1);
    });
    return result;
};

const getTreeGraphData = (node: TreeNode,): Record<string, any> => {
    let differingPart = "";
    if(node.getDifferingValueFromParent() != null){
        differingPart = "Differing: " + node.getDifferingValueFromParent() + ", ";
    }
    let result:RawNodeDatum = {name:`${differingPart}${Array.from(node.paperIds).map((index) => allRows[Number(index)]["Citation Key"]).join(', ')}`};
    
    result.attributes ={
        "Papers": `[${Object.keys(node.similarValues).join(', ')}]`,
      };
    
    if (node.children.length > 0) {
        result.children  = node.children.map((child: TreeNode) => getTreeGraphData(child)) as RawNodeDatum[];
    }
    
    return result as RawNodeDatum ;
};


//let remainingRows:Dataset;
let allRows:Dataset;
let maxScore:number = 0;
let minScore:number = 0;
let scores: RowSimilarityScores;
let visitedIndices = new Set<string>();
/**
 * Function to construct a tree with the root being showing the row and its connection to other rows
 * @param row 
 * @param allRowsList 
 * @param scoresRecord 
 * @returns 
 */
export const makeTree = (row:DataRow, allRowsList:Dataset, scoresRecord: RowSimilarityScores) => {

    if(scoresRecord && row && allRowsList && allRowsList.length > 0 && scoresRecord.size > 0){
        //set the global vars, used in getChildNode function below
        allRows = allRowsList;
        scores = scoresRecord;

        //console.log("makeTree params : ",row,allRowsList,scoresRecord)

        //will store teh 
        let similarWeakKeys: WeakKeysRecordType = {};

        // Map through keys in row and filter to only include keys from WeakKeysType
        Object.keys(row).forEach((key) => {
            if (weakKeysList.includes(key as keyof DataRow)) {
                similarWeakKeys[key as keyof DataRow] = row[key as keyof DataRow];
            }
        });
        //console.log("makeTree: similarWeakKeys: ",similarWeakKeys)

        let root = new TreeNode(Number(row["Index"]), similarWeakKeys);
    
        //get all other similar papers
        maxScore = Math.max(...Array.from(scores.values()).map(Number));
        minScore = Math.max(1,maxScore-2)
        //console.log("makeTree: maxScore: ",maxScore," minScore: ",minScore)


        let sameScoreIndices: number[] = Array.from(scores.entries()).filter(([_, value]) => value === maxScore).map(([key]) => Number(key));
    
        root.setPaperIds(sameScoreIndices);
        
        //record visited indices
        visitedIndices =  new Set([...sameScoreIndices.map(String)]);
        

        //console.log(similarWeakKeys)
    
        //need to go lower levels
        if(similarWeakKeys && Object.keys(similarWeakKeys).length > 0){
             let combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
            for(let c of combinations){
                //console.log("makeTree: looking for children with combination: ",c)
                let childSimilarWeakKeys:WeakKeysRecordType = {};
                c.forEach((key: string | number) => {
                    if (weakKeysList.includes(String(key) as keyof DataRow)) {
                        childSimilarWeakKeys[key as keyof DataRow] = row[key as keyof DataRow];
                    }
                });
                //console.log("maxScore",maxScore)
                //console.log("lengthh",Object.keys(similarWeakKeys).length)
                let childnode = getChildNode(childSimilarWeakKeys,maxScore-1)
                root.addChild(childnode)
            }
        }
        //console.log("done computing the tree")
        removeEmptyRoots(root)
        //console.log(getTreeGraphData(root))
        //console.log("make tree: remaining allRows ", allRows)
        return getTreeGraphData(root) as RawNodeDatum;
    }
  return null;
}


const getChildNode= (similarWeakKeys:WeakKeysRecordType, scoreLevel:number) => {
    if(scoreLevel < minScore){
        return null;
    }

    //WeakKeysRecordType
    let node = new TreeNode(null, similarWeakKeys);

    //get all other similar papers

    //console.log(similarWeakKeys)

    let sameScoreIndices: number[] = [];
    const rowsWithScoreLevelAndNotVisited = allRows
    .filter((row) => {
        // Get all rows with scoreLevel similarity score and also not visited
        const rowIndex = row["Index"];
        if(visitedIndices.has(rowIndex)){
            return false;
        }
        const score = scores.get(rowIndex); // Use .get for Map
        const isMatchingScore = Number(score) === scoreLevel;
        return isMatchingScore;
    })
    //add to sameScoreIndices if match
    for (const row of rowsWithScoreLevelAndNotVisited) {
        const rowIndex = row["Index"];
        const score = scores.get(rowIndex);

        //if score matches
        if(Number(score) == scoreLevel){
            let isRowValid = true;
            for (const key of Object.keys(similarWeakKeys)) {
                if (String(similarWeakKeys[key]) !== "" && String(similarWeakKeys[key]) !== String(row[key as DataHeaders])) {
                    isRowValid = false;
                    /*if(rowIndex == "166"  && scoreLevel == 9 ){
                        console.log("Mismatch Values for index 166 at scorelevel 9 for key", key ,' Root: "',String(similarWeakKeys[key]),'"',' Index 20: "', String(row[key as DataHeaders]),'"')
                    }*/
                }
            }
            
            if(isRowValid){
                sameScoreIndices.push(Number(rowIndex))
                visitedIndices.add(rowIndex)
            }
        }
    }

    node.setPaperIds(sameScoreIndices);
    //if(sameScoreIndices.length > 0){
      //  console.log("setting Ids: ", sameScoreIndices)

    //}
    //console.log("visited so far:",visitedIndices)

    if(Object.keys(similarWeakKeys).length > 0){
            let combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
        for(let c of combinations){
            let childSimilarWeakKeys:WeakKeysRecordType = {};
            c.forEach((key: string | number) => {
                if (weakKeysList.includes(String(key)  as keyof DataRow)) {
                    childSimilarWeakKeys[key as keyof DataRow] = similarWeakKeys[key  as keyof DataRow];
                }
            });
            let childnode = getChildNode(childSimilarWeakKeys,scoreLevel-1)
            node.addChild(childnode)
        }
    }

    return node;

}

const gatherNodesToDelete = (root: TreeNode, nodesToDelete: TreeNode[]) => {
    root.children.forEach(child => {
        gatherNodesToDelete(child, nodesToDelete);
    });

    if (root.isEmpty() && root.isLeaf()) {
        nodesToDelete.push(root);
    }
};

const removeEmptyRoots = (root: TreeNode) => {
    if (!root) {
        return;
    }

    let nodesToDelete: TreeNode[] = [];
    let nodesDeleted: boolean;

    do {
        nodesDeleted = false;
        nodesToDelete = [];
        gatherNodesToDelete(root, nodesToDelete);

        if (nodesToDelete.length > 0) {
            nodesToDelete.forEach(node => {
                node.deleteNode();
            });
            nodesDeleted = true;
        }
    } while (nodesDeleted);

    // After deleting nodes, check root node
    if (root.isEmpty() && root.isLeaf()) {
        root.deleteNode();
    }
};
