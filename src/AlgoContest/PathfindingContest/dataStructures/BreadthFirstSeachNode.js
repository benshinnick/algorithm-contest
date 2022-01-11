export class BreadthFirstNode {

    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.previousNode = null;
        this.isExplored = false;
        this.isWall = (weight === Infinity);
    }

    setPreviousNode(prevNode) {
        this.previousNode = prevNode;
    }

    getPreviousNode() {
        return this.previousNode;
    }

    setIsExplored(isExplored) {
        this.isExplored = isExplored;
    }

    isNodeExplored() {
        return this.isExplored;
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    isNodeWall() {
        return this.isWall;
    }

}