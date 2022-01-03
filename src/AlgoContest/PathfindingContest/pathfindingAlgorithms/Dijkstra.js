import { PriorityQueue } from "../dataStructures/MinPriorityQueue";
import { DijkstraNode } from "../dataStructures/DijkstraNode";

export function getDijkstraAnimations(grid, startNode, finishNode) {
    const animations = [];
    const dijkstraGrid = getDijkstraGrid(grid, startNode.row, startNode.col);
    dijkstra(dijkstraGrid, startNode, finishNode, animations);
    getNodesInShortestPathOrder(dijkstraGrid, finishNode, animations);
    return animations;
}

// Animation Codes:
//  'v' denotes a visited node at a particular row and column
//  'vf' denotes that we have finished visiting a node
//  'sp' denotes a node is part of the shortest path

function dijkstra(grid, startNode, finishNode, animations) {
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(grid[startNode.row][startNode.col], grid[startNode.row][startNode.col].distance);

    while (!priorityQueue.isEmpty()) {
        const closestNode = priorityQueue.dequeue();
        closestNode.isVisited = true;
        animations.push(['v', closestNode.row, closestNode.col]);
        if (closestNode.row === finishNode.row && closestNode.row === finishNode.row) {
            return;
        }
        updateClosestNodeNeighbors(closestNode, grid, priorityQueue);
        animations.push(['vf', closestNode.row, closestNode.col]);
    }
}
  
function updateClosestNodeNeighbors(node, grid, priorityQueue) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + grid[neighbor.row][neighbor.col].distance;
        neighbor.previousNode = node;
        priorityQueue.enqueue(neighbor, neighbor.distance);
    }
}
  
function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const row = node.getRow();
    const col = node.getCol();
    // only checking adjacent nodes not along a diagonal
    if (row > 0) {
        if(isAvailableNode(grid[row - 1][col])) neighbors.push(grid[row - 1][col]);
    }
    if (row < grid.length - 1) {
        if(isAvailableNode(grid[row +1][col])) neighbors.push(grid[row + 1][col]);
    }
    if (col > 0) {
        if(isAvailableNode(grid[row][col - 1])) neighbors.push(grid[row][col - 1]);
    }
    if (col < grid[0].length - 1) {
        if(isAvailableNode(grid[row][col - 1])) neighbors.push(grid[row][col + 1]);
    }

    return neighbors;
}

function isAvailableNode(node) {
    return node.weight !== Infinity && node.isVisited !== true;
}

function getDijkstraGrid(grid, startRow, startCol) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    const nodes = [];
    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            const nodeWeight = grid[row][col].weight;
            let nodeDistance = Infinity;
            if(row === startRow && col === startCol) {
                nodeDistance = 0;
            }
            nodes[row][col] = new DijkstraNode(row, col, nodeWeight, nodeDistance);
        }
    }

    return nodes;
}

function getNodesInShortestPathOrder(grid, finishNode, animations) {
    let currentNode = grid[finishNode.row][finishNode.col];
    while (currentNode !== null) {
        animations.push(['sp', currentNode.row, currentNode.col]);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}