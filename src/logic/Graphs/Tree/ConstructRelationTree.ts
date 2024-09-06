import { Combination}  from "js-combinatorics";
import {TreeNodeDatum } from "react-d3-tree";
import { DataHeaders, DataRow, Dataset, RowSimilarityScores, weakKeysList } from "../../../types/Datasets/DatasetTypes";
import { TreeNode } from "./Node";
import { WeakKeysRecordType } from "../../../types/Graphs/TreeGraphTypes";

/**Returns the tree rooted at the param node, as type of RawNodeDatum, so it can be displayed 
 * 
 * @param node 
 * @returns 
 */
const getTreeGraphData = (node: TreeNode,depth: number = 0): TreeNodeDatum  => {
    let differingPart = "";
    if(node.getDifferingValueFromParent() != ""){
        differingPart = "Differing: " + node.getDifferingValueFromParent() + ", ";
    }    

    
    const result:TreeNodeDatum  = {
        name: `${differingPart}${Array.from(node.paperIds).map((index) => allRows[Number(index)]["Citation Key"]).join(', ')}`,
        __rd3t: {
            id: "",
            depth: depth,
            collapsed: false
        }
    };

    result.attributes ={
        "Papers": `[${Object.keys(node.similarValues).join(', ')}]`      };
    if (node.children.length > 0) {
        result.children  = node.children.map((child: TreeNode) => getTreeGraphData(child, depth + 1)) as TreeNodeDatum [];
    }
    
    return result as TreeNodeDatum  ;
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
//order of the nodes, to handle symmetry: "Recurrent Mutation",  "Ecological Model", "Population Size",  "Spatial Structure", "Selection",  "Ploidy", "Mating system", "Ecological Loci/Traits",  "Life history", "Eco-Evo Focus"  
export const makeTree = (row:DataRow, allRowsList:Dataset, scoresRecord: RowSimilarityScores) => {

    if(scoresRecord && row && allRowsList && allRowsList.length > 0 && scoresRecord.size > 0){
        //set the global vars, used in getChildNode function below
        allRows = allRowsList;
        scores = scoresRecord;

        const similarWeakKeys: WeakKeysRecordType = {};

        // Map through keys in row and filter to only include keys from WeakKeysType
        Object.keys(row).forEach((key) => {
            if (weakKeysList.includes(key as keyof DataRow)) {
                similarWeakKeys[key as keyof DataRow] = row[key as keyof DataRow];
            }
        });

        const root = new TreeNode(Number(row["Index"]), similarWeakKeys);
    
        //get all other similar papers
        maxScore = Math.max(...Array.from(scores.values()).map(Number));
        minScore = Math.max(1,maxScore-2)
        //console.log("makeTree: maxScore: ",maxScore," minScore: ",minScore)


        const sameScoreIndices: number[] = Array.from(scores.entries()).filter(([, value]) => value === maxScore).map(([key]) => Number(key));
    
        root.setPaperIds(sameScoreIndices);
        
        //record visited indices
        visitedIndices =  new Set([...sameScoreIndices.map(String)]);
        
    
        //need to go lower levels
        if(similarWeakKeys && Object.keys(similarWeakKeys).length > 0){
            console.log(Object.keys(similarWeakKeys))
             const combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
            for(const c of combinations){
                console.log("makeTree: looking for children with combination: ",c)
                const childSimilarWeakKeys:WeakKeysRecordType = {};
                c.forEach((key: string | number) => {
                    if (weakKeysList.includes(String(key) as keyof DataRow)) {
                        childSimilarWeakKeys[key as keyof DataRow] = row[key as keyof DataRow];
                    }
                });
                const childnode = getChildNode(childSimilarWeakKeys,maxScore-1)
                root.addChild(childnode)
            }
        }
        //console.log("done computing the tree")
        removeEmptyRoots(root)
        return getTreeGraphData(root) as TreeNodeDatum;
    }
  return null;
}


const getChildNode= (similarWeakKeys:WeakKeysRecordType, scoreLevel:number) => {
    if(scoreLevel < minScore){
        return null;
    }

    //WeakKeysRecordType
    const node = new TreeNode(null, similarWeakKeys);

    //get all other similar papers

    const sameScoreIndices: number[] = [];
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
                }
            }
            
            if(isRowValid){
                sameScoreIndices.push(Number(rowIndex))
                visitedIndices.add(rowIndex)
            }
        }
    }

    node.setPaperIds(sameScoreIndices);

    if(Object.keys(similarWeakKeys).length > 0){
            const combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
        for(const c of combinations){
            const childSimilarWeakKeys:WeakKeysRecordType = {};
            c.forEach((key: string | number) => {
                if (weakKeysList.includes(String(key)  as keyof DataRow)) {
                    childSimilarWeakKeys[key as keyof DataRow] = similarWeakKeys[key  as keyof DataRow];
                }
            });
            const childnode = getChildNode(childSimilarWeakKeys,scoreLevel-1)
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
