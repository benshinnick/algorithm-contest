export class GreedyBestFirstNode {

    constructor(row, col, weight, fScore) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.fScore = fScore;
        this.previousNode = null;
        this.isVisited = false;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    getWeight() {
        return this.weight;
    }

    setFScore(fScore) {
        this.fScore = fScore;
    }

    getFScore() {
        return this.fScore;
    }

    setPreviousNode(prevNode) {
        this.previousNode = prevNode;
    }

    getPreviousNode() {
        return this.previousNode;
    }

    setIsVisited(isVisited) {
        this.isVisited = isVisited;
    }

    isNodeVisited() {
        return this.isVisited;
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    isWall() {
        return this.weight === Infinity;
    }

}