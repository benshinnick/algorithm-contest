import { GreedyBestFirstNode } from "../dataStructures/GreedyBestFirstNode";
import { PriorityQueue } from "../dataStructures/TieBreakingMinPriorityQueue";

export function getGreedyBestFirstAnimations(grid, startNode, finishNode) {
    const animations = [];
    const aStarGrid = getGreedyBestFirstGrid(grid);
    greedyBestFirst(aStarGrid, startNode, finishNode, animations);
    reconstructShortestPath(aStarGrid, finishNode, animations);
    return animations;
}

function greedyBestFirst(grid, startNode, finishNode, animations) {
    // Animation Codes:
    //  'v' denotes a visited node at a particular row and column
    //  'vf' denotes that we have finished visiting a node
    //  'sp' denotes that we are starting to reconstruct the shortest path on a node
    //  'spf' denotes that we are finishing to reconstruct the shortest path on a node

    let count = new Counter();
    let openSet = new PriorityQueue();
    let openSetHash = new Set();

    grid[startNode.row][startNode.col].setFScore(0);
    const startFScore = calculateHeuristic(startNode, finishNode);
    grid[startNode.row][startNode.col].setFScore(startFScore);
    grid[startNode.row][startNode.col].setIsVisited(true);

    openSet.enqueue(grid[startNode.row][startNode.col], 0, count.getCount());
    openSetHash.add([startNode.row, startNode.col]);

    while (!openSet.isEmpty()) {
        let currentNode = openSet.dequeue().getValue();

        animations.push(['v', currentNode.getRow(), currentNode.getCol()]);
        animations.push(['vf', currentNode.getRow(), currentNode.getCol()]);

        if (currentNode.getRow() === finishNode.row && 
            currentNode.getCol() === finishNode.col) return;
        
        updateCurrentNodeNeighbors(currentNode, grid, openSet, openSetHash, finishNode, count);
    }
}

function updateCurrentNodeNeighbors(node, grid, openSet, openSetHash, finishNode, count) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if(!openSetHash.has([neighbor.getRow(), neighbor.getCol()])) {
            count.increment();
            neighbor.setIsVisited(true);
            neighbor.setPreviousNode(node);
            neighbor.setFScore(calculateHeuristic(neighbor, finishNode) + neighbor.getWeight());
            openSet.enqueue(neighbor, neighbor.getFScore(), count.getCount());
            openSetHash.add([neighbor.getRow(), neighbor.getCol()]);
        }
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const row = node.getRow();
    const col = node.getCol();
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isWall() && !neighbor.isNodeVisited());
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

function calculateHeuristic(node1, node2) {
    // Used manhatten distance to determine the f score
    let d1 = Math.abs(node2.row - node1.row);
    let d2 = Math.abs(node2.col - node1.col);
    return d1 + d2;
}

function getGreedyBestFirstGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    let nodes = [];
    for (let row = 0; row < numRows; ++row) {
        nodes.push([]);
    }

    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            nodes[row][col] = new GreedyBestFirstNode(
                row, col, parseFloat(grid[row][col].weight), Infinity
            );
        }
    }

    return nodes;
}

// Counter is used to keep track of the amount of times that we insert 
//  into the priority queue and is used to determine which node will
//  be visited next if multiple nodes share the same f score or priority
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