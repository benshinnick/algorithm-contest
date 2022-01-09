import { AStarNode } from "../dataStructures/AStarNode";
import { PriorityQueue } from "../dataStructures/TieBreakingMinPriorityQueue";

export function getAStarAnimations(grid, startNode, finishNode) {
    const animations = [];
    const aStarGrid = getAStarGrid(grid);
    aStar(aStarGrid, startNode, finishNode, animations);
    reconstructShortestPath(aStarGrid, finishNode, animations);
    return animations;
}

function aStar(grid, startNode, finishNode, animations) {

    // Animation Codes:
    //  'v' denotes a visited node at a particular row and column
    //  'vf' denotes that we have finished visiting a node
    //  'sp' denotes a node is part of the shortest path
    //  'spf' denotes that we are finished with a shortest path node

    let count = new Counter();
    let openSet = new PriorityQueue();
    let openSetHash = new Set();

    grid[startNode.row][startNode.col].setGScore(0);
    grid[startNode.row][startNode.col].setFScore(0);

    const initialStartDistance = getManhattenDistance(startNode, finishNode);
    grid[startNode.row][startNode.col].setFScore(initialStartDistance);
    openSet.enqueue(grid[startNode.row][startNode.col], 0, count.getCount());
    openSetHash.add([startNode.row, startNode.col]);

    while (!openSet.isEmpty()) {
        let currentNode = openSet.dequeue().getValue();
        openSetHash.delete(currentNode);

        animations.push(['v', currentNode.getRow(), currentNode.getCol()]);

        if (currentNode.getRow() === finishNode.row && 
            currentNode.getCol() === finishNode.col) return;
        
        updateCurrentNodeNeighbors(currentNode, grid, openSet, openSetHash, finishNode, count);

        animations.push(['vf', currentNode.getRow(), currentNode.getCol()]);
    }
}

function updateCurrentNodeNeighbors(node, grid, openSet, openSetHash, finishNode, count) {
    const unvisitedNeighbors = getNodeNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        let altGScore = parseInt(node.getGScore()) + parseInt(neighbor.getWeight());
        if (altGScore < neighbor.getGScore()) {
            neighbor.setPreviousNode(node);
            neighbor.setGScore(altGScore);
            neighbor.setFScore(altGScore + getManhattenDistance(neighbor, finishNode));
            if(!openSetHash.has([neighbor.getRow(), neighbor.getCol()])) {
                count.increment();
                console.log(count);
                openSet.enqueue(neighbor, neighbor.getFScore(), count.getCount());
                openSetHash.add([neighbor.getRow(), neighbor.getCol()]);
            }
        }
    }
}

function getNodeNeighbors(node, grid) {
    const neighbors = [];
    const row = node.getRow();
    const col = node.getCol();
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isWall());
}

function reconstructShortestPath(grid, finishNode, animations) {
    // Keep track of next and previous node just for the path animations

    let nextNode = null;
    let currentNode = grid[finishNode.row][finishNode.col];
    let previousNode = currentNode.getPreviousNode();

    if(previousNode === null) {
        return;
    }

    while (currentNode !== null) {
        if(nextNode === null) {
            animations.push(['spf', currentNode.row, currentNode.col, previousNode.row, previousNode.col]);
        }
        else if(previousNode === null) {
            animations.push(['sp', currentNode.row, currentNode.col, nextNode.row, nextNode.col]);
        }
        else {
            animations.push(['sp', currentNode.row, currentNode.col, nextNode.row, nextNode.col]);
            animations.push(['spf', currentNode.row, currentNode.col, previousNode.row, previousNode.col]);
        }
        nextNode = currentNode;
        currentNode = previousNode;
        if(previousNode !== null) previousNode = previousNode.getPreviousNode();
    }
    return;
}

function getManhattenDistance(node1, node2) {
    let d1 = Math.abs(node2.row - node1.row);
    let d2 = Math.abs(node2.col - node1.col);
    return d1 + d2;
}

function getAStarGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    let nodes = [];
    for (let row = 0; row < numRows; ++row) {
        nodes.push([]);
    }

    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            nodes[row][col] = new AStarNode(
                row, col, grid[row][col].weight, Infinity, Infinity, Infinity
            );
        }
    }

    return nodes;
}

class Counter {
    constructor() {
        this.count = 1;
      }

      increment() {
          this.count++;
      }
  
      getCount() {
          return this.count;
      }
}