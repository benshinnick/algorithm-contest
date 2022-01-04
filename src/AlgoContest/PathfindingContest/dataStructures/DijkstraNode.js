export class DijkstraNode {

    constructor(row, col, weight, distance) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.distance = distance;
        this.previousNode = null;
        this.isVisited = false;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    getWeight() {
        return this.weight;
    }

    setDistance(distance) {
        this.distance = distance;
    }

    getDistance() {
        return this.distance;
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

}