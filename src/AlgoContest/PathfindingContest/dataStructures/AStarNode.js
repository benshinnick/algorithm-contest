export class AStarNode {

    constructor(row, col, weight, fScore, gScore, hScore) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.fScore = fScore;
        this.gScore = gScore;
        this.hScore = hScore;
        this.previousNode = null;
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

    setGScore(gScore) {
        this.gScore = gScore;
    }

    getGScore() {
        return this.gScore;
    }

    setHScore(hScore) {
        this.hScore = hScore;
    }

    getHScore() {
        return this.hScore;
    }

    setPreviousNode(prevNode) {
        this.previousNode = prevNode;
    }

    getPreviousNode() {
        return this.previousNode;
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