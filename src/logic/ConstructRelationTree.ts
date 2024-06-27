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

    constructor(rowIndex:Number|null, WeakKeysRecord:WeakKeysRecordType, parent: Node | null = null) {
        this.children = [];
        if(rowIndex){
            this.paperIds = new Set([rowIndex]);
        }
        else{          
            this.paperIds = new Set();
        }
        this.parent = parent;
        this.similarValues = WeakKeysRecord;
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

const getTreeGraphData = (node: Node): Record<string, any> => {
    let result:RawNodeDatum = {name:`[${Array.from(node.paperIds).join(', ')}]`};
    
    result.attributes ={
        "Similar Keys": `[${Object.keys(node.similarValues).join(', ')}]`,
      };
    
    if (node.children.length > 0) {
        result.children  = node.children.map((child: Node) => getTreeGraphData(child)) as RawNodeDatum[];
    }
    
    return result as RawNodeDatum ;
};


export const makeTree = (row:Record<string,string>, allRowsList:Record<string,string>[], scores: Record<number, number>) => {
    if(scores && row && allRowsList && allRowsList.length > 0 && Object.keys(scores).length > 0){
        let similarWeakKeys: WeakKeysRecordType = {};

        // Map through keys in row and filter to only include keys from WeakKeysType
        Object.keys(row).forEach((key) => {
            if (weakKeysList.includes(key)) {
                similarWeakKeys[key] = row[key];
            }
        });

        let root = new Node(Number(row["Index"]), similarWeakKeys);
    
        //get all other similar papers
        let maxScore = Math.max(...Object.values(scores));
        let sameScoreIndices: number[] = Object.keys(scores)
        .filter((k) => scores[Number(k)] === maxScore)
        .map((v) => Number(v));
    
        root.setPaperIds(sameScoreIndices);
        
        allRowsList = allRowsList.filter(row => !sameScoreIndices.includes(
            Number(row["Index"])
        ));
    
        //need to go lower levels
        if(similarWeakKeys && Object.keys(similarWeakKeys).length > 0){
             let combinations = Combination.of(Object.keys(similarWeakKeys), Object.keys(similarWeakKeys).length - 1);
            for(let c of combinations){
                let childSimilarWeakKeys:WeakKeysRecordType = {};
                c.forEach((key: string | number) => {
                    if (weakKeysList.includes(String(key))) {
                        childSimilarWeakKeys[key] = row[key];
                    }
                });
                //console.log("maxScore",maxScore)
                //console.log("lengthh",Object.keys(similarWeakKeys).length)
                let childnode = getChildNode(allRowsList,scores,childSimilarWeakKeys,maxScore-1)
                root.addChild(childnode)
            }
        }
        //console.log("done computing the tree")
        return getTreeGraphData(root) as RawNodeDatum;
    }
  return null;
}


const getChildNode= (allRowsList:Record<string,string>[], scores: Record<number, number>,similarWeakKeys:WeakKeysRecordType, scoreLevel:number) => {
    if(scoreLevel <= 6 || !similarWeakKeys || Object.keys(similarWeakKeys).length <= 0 || !allRowsList){
        return null;
    }

    //WeakKeysRecordType

    let node = new Node(null, similarWeakKeys);

    //get all other similar papers

    let sameScoreIndices = allRowsList
    .filter((row) => {
        const rowIndex = Number(row["Index"]);
        const score = Number(scores[rowIndex]);
        const isMatchingScore = score === scoreLevel;
        
        //console.log(`Row Index: ${rowIndex}, Score: ${score}, Is Matching Score: ${isMatchingScore}`);
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

    //console.log(`Same Score Indices: ${sameScoreIndices}`);

    

    node.setPaperIds(sameScoreIndices);

    allRowsList = allRowsList.filter((row) => !sameScoreIndices.includes(
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
            let childnode = getChildNode(allRowsList,scores,childSimilarWeakKeys,scoreLevel-1)
            node.addChild(childnode)
        }
    }

    return node;

}
/*
const getValue = (row:Record<string,string>) => {
    const nodeValue: Partial<NodeValue> = {};

    const keys: WeakSearchKeys[] = [
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

    keys.forEach(key => {
        if (key in row) {
            nodeValue[key] = row[key];
        }
        else{
            nodeValue[key] = "";
        }
    });

    return nodeValue as NodeValue;
}*/
