import { Combination}  from "js-combinatorics";
import { RawNodeDatum } from "react-d3-tree";

const weakKeysList = [
    "Eco-Evo Focus",
    "Life history",
    "Ecological Loci/Traits",
    "Mating system",
    "Ploidy",
    "Selection",
    "Spatial Structure",
    "Population Size",
    "Ecological Model",
    "Recurrent Mutation"
  ];
  
type WeakKeysType = typeof weakKeysList[number];
type WeakKeysRecordType = Partial<Record<WeakKeysType, string>>;

class Node {
    children: Node[];
    paperIds:Set<Number>;
    parent: Node | null;
    similarValues:WeakKeysRecordType;

    constructor(rowIndex: number | null, WeakKeysRecord: WeakKeysRecordType, parent: Node | null = null) {
        this.children = [];
        this.paperIds = rowIndex !== null ? new Set([rowIndex]) : new Set();
        this.parent = parent;
        this.similarValues = WeakKeysRecord;
    }
    
    isEmpty(): boolean {
        return !this.paperIds || this.paperIds.size === 0;
    }

    isLeaf(): boolean {
        return !this.children === null || this.children.length === 0;
    }
    getDifferingValueFromParent() {
        if (this.parent && this.similarValues && this.parent.similarValues) {
            let differingVal = Object.keys(this.parent.similarValues).filter((val: any) => !Object.keys(this.similarValues).includes(val))[0];
            return differingVal;
        }
        return null;
    }
    deleteNode(): void {
        if (this.parent) {
            const removingIndex = this.parent.children.findIndex(child => child === this);
            if (removingIndex !== -1) {
                this.parent.children.splice(removingIndex, 1);
                
            }
        }
    }
    addChild(childNode: Node|null): void {
        if(childNode){
            childNode.parent = this;
            this.children.push(childNode);
        }
        
    }
    addToPaperIds(rowIndex:Number){
        this.paperIds.add(rowIndex)
    }
    setPaperIds(rowIndices:Number[]){
        this.paperIds = new Set<Number>(rowIndices)
    }

}
const treeToString = (node: Node, level = 0) => {
    const indent = ' '.repeat(level * 2); // Use spaces for indentation
    //let result = `${indent}Node: { similarValues: ${JSON.stringify(node.similarValues)}, paperIds: [${Array.from(node.paperIds).join(', ')}] }\n`;
     let result = `${indent}paperIds: [${Array.from(node.paperIds).join(', ')}] } ${Object.keys(node.similarValues).length}\n`;
    node.children.forEach((child: any) => {
        result += treeToString(child, level + 1);
    });
    return result;
};

const getTreeGraphData = (node: Node,): Record<string, any> => {
    let differingPart = "";
    if(node.getDifferingValueFromParent() != null){
        differingPart = "Differing: " + node.getDifferingValueFromParent() + ", ";
    }
    let result:RawNodeDatum = {name:`${differingPart}${Array.from(node.paperIds).map((index) => allRows[Number(index)]["Citation Key"]).join(', ')}`};
    
    result.attributes ={
        "Papers": `[${Object.keys(node.similarValues).join(', ')}]`,
      };
    
    if (node.children.length > 0) {
        result.children  = node.children.map((child: Node) => getTreeGraphData(child)) as RawNodeDatum[];
    }
    
    return result as RawNodeDatum ;
};


let remainingRows:Record<string,string>[];
let allRows:Record<string,string>[];
let maxScore:number = 0;
let minScore:number = 0;
let scores: Record<number, number>;
/**
 * Function to construct a tree showing the row and its connection to other rows
 * @param row 
 * @param allRowsList 
 * @param scoresRecord 
 * @returns 
 */
export const makeTree = (row:Record<string,string>, allRowsList:Record<string,string>[], scoresRecord: Record<number, number>) => {
    if(scoresRecord && row && allRowsList && allRowsList.length > 0 && Object.keys(scoresRecord).length > 0){
        //set the global vars, used in getChildNode function below
        allRows = allRowsList;
        scores = scoresRecord;

        console.log("makeTree params : ",row,allRowsList,scoresRecord)

        //will store teh 
        let similarWeakKeys: WeakKeysRecordType = {};
        remainingRows = allRowsList;
        // Map through keys in row and filter to only include keys from WeakKeysType
        Object.keys(row).forEach((key) => {
            if (weakKeysList.includes(key)) {
                similarWeakKeys[key] = row[key];
            }
        });
        console.log("makeTree: similarWeakKeys: ",similarWeakKeys)

        let root = new Node(Number(row["Index"]), similarWeakKeys);
    
        //get all other similar papers
        maxScore = Math.max(...Object.values(scores));
        minScore = Math.max(1,maxScore-3)
        console.log("makeTree: maxScore: ",maxScore," minScore: ",minScore)

        let sameScoreIndices: number[] = Object.keys(scores)
        .filter((k) => scores[Number(k)] == maxScore)
        .map((v) => Number(v));
    
        root.setPaperIds(sameScoreIndices);
        
        allRowsList = allRowsList.filter(row => !sameScoreIndices.includes(
            Number(row["Index"])
        ));
    
        //need to go lower levels
        if(similarWeakKeys && Object.keys(similarWeakKeys).length > 0){
             let combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
            for(let c of combinations){
                //console.log("makeTree: looking for children with combination: ",c)
                let childSimilarWeakKeys:WeakKeysRecordType = {};
                c.forEach((key: string | number) => {
                    if (weakKeysList.includes(String(key))) {
                        childSimilarWeakKeys[key] = row[key];
                    }
                });
                //console.log("maxScore",maxScore)
                //console.log("lengthh",Object.keys(similarWeakKeys).length)
                let childnode = getChildNode(childSimilarWeakKeys,maxScore-1)
                root.addChild(childnode)
            }
        }
        //console.log("done computing the tree)
        removeEmptyRoots(root)
        console.log(getTreeGraphData(root))
        console.log("make tree: remaining allRows ", allRows)
        return getTreeGraphData(root) as RawNodeDatum;
    }
  return null;
}


const getChildNode= (similarWeakKeys:WeakKeysRecordType, scoreLevel:number) => {
    if(scoreLevel < minScore || !remainingRows || remainingRows.length < 1){
        return null;
    }

    //WeakKeysRecordType

    let node = new Node(null, similarWeakKeys);

    //get all other similar papers

    let sameScoreIndices = remainingRows
    .filter((row) => {
        const rowIndex = Number(row["Index"]);
        const score = Number(scores[rowIndex]);
        const isMatchingScore = score === scoreLevel;
        return isMatchingScore;
    })
    .filter((row) => {
        let valid = true;
        Object.keys(similarWeakKeys).forEach((key) => {
            const weakKeyVal = String(similarWeakKeys[String(key)]);
            const rowVal = String(row[String(key)]);
            //console.log(`Key: ${key}, similarWeakKeys Value: ${weakKeyVal}, Row Value: ${rowVal}`);
            if (weakKeyVal !== rowVal) {
                valid = false;
            }
            
        });
        //console.log(`Row Index: ${row["Index"]}, Is Valid: ${valid}`);
        return valid;
    })
    .map((row) => Number(row["Index"]));

    node.setPaperIds(sameScoreIndices);

    remainingRows = remainingRows.filter((row) => !sameScoreIndices.includes(
        Number(row["Index"])
    ));

    if(Object.keys(similarWeakKeys).length > 0){
            let combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
        for(let c of combinations){
            let childSimilarWeakKeys:WeakKeysRecordType = {};
            c.forEach((key: string | number) => {
                if (weakKeysList.includes(String(key))) {
                    childSimilarWeakKeys[key] = similarWeakKeys[key];
                }
            });
            let childnode = getChildNode(childSimilarWeakKeys,scoreLevel-1)
            node.addChild(childnode)
        }
    }

    return node;

}

const gatherNodesToDelete = (root: Node, nodesToDelete: Node[]) => {
    root.children.forEach(child => {
        gatherNodesToDelete(child, nodesToDelete);
    });

    if (root.isEmpty() && root.isLeaf()) {
        nodesToDelete.push(root);
    }
};

const removeEmptyRoots = (root: Node) => {
    if (!root) {
        return;
    }

    let nodesToDelete: Node[] = [];
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
