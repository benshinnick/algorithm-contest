export class DepthFirstNode {

    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.previousNode = null;
        this.isDiscovered = false;
        this.isWall = (weight === Infinity);
    }

    setPreviousNode(prevNode) {
        this.previousNode = prevNode;
    }

    getPreviousNode() {
        return this.previousNode;
    }

    setIsDiscovered(isDiscovered) {
        this.isDiscovered = isDiscovered;
    }

    isNodeDiscovered() {
        return this.isDiscovered;
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