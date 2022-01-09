import { PriorityQueue } from "../dataStructures/MinPriorityQueue";
import { BreadthFirstNode } from "../dataStructures/BreadthFirstSeachNode";

export function getBreadthFirstAnimations(grid, startNode, finishNode) {
    const animations = [];
    const breadthFirstGrid = getBreadthFirstGrid(grid, startNode.row, startNode.col);
    breadthFirstSearch(breadthFirstGrid, startNode, finishNode, animations);
    reconstructShortestPath(breadthFirstGrid, finishNode, animations);
    return animations;
}

function breadthFirstSearch(grid, startNode, finishNode, animations) {
    // Animation Codes:
    //  'v' denotes a visited node at a particular row and column
    //  'vf' denotes that we have finished visiting a node
    //  'sp' denotes that we are starting to reconstruct the shortest path on a node
    //  'spf' denotes that we are finishing to reconstruct the shortest path on a node

    let count = new Counter();
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(grid[startNode.row][startNode.col], count.getCount());

    while (!priorityQueue.isEmpty()) {
        let closestNode = priorityQueue.dequeue().getValue();
        animations.push(['v', closestNode.getRow(), closestNode.getCol()]);
        grid[closestNode.getRow()][closestNode.getCol()].setIsExplored(true);
        if (closestNode.getRow() === finishNode.row && 
            closestNode.getCol() === finishNode.col) return;
        updateClosestNodeNeighbors(closestNode, grid, priorityQueue, count);
        animations.push(['vf', closestNode.getRow(), closestNode.getCol()]);
    }
}

function updateClosestNodeNeighbors(node, grid, priorityQueue, count) {
    const unexploredNeighbors = getUnexploredNeighbors(node, grid);
    for (const neighbor of unexploredNeighbors) {
            count.increment();
            neighbor.setIsExplored(true);
            neighbor.setPreviousNode(node);
            priorityQueue.enqueue(neighbor, count.getCount());
        }
}

function getUnexploredNeighbors(node, grid) {
    const neighbors = [];
    const row = node.getRow();
    const col = node.getCol();
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isNodeExplored() && !neighbor.isNodeWall());
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

function getBreadthFirstGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    let nodes = [];
    for (let row = 0; row < numRows; ++row) {
        nodes.push([]);
    }

    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            nodes[row][col] = new BreadthFirstNode(row, col, parseFloat(grid[row][col].weight));
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