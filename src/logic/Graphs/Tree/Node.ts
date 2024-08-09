import { WeakKeysRecordType } from "../../../types/Graphs/TreeGraphTypes";


/**Defines a node for a tree
 * 
 */
export class TreeNode {
    public children: TreeNode[];
    public paperIds:Set<Number>;
    public parent: TreeNode | null;
    public similarValues:WeakKeysRecordType;

    constructor(rowIndex: number | null, WeakKeysRecord: WeakKeysRecordType, parent: TreeNode | null = null) {
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
    addChild(childNode: TreeNode|null): void {
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