import { PriorityQueue } from "../dataStructures/MinPriorityQueue";
import { DijkstraNode } from "../dataStructures/DijkstraNode";

export function getDijkstraAnimations(grid, startNode, finishNode) {
    const animations = [];
    const dijkstraGrid = getDijkstraGrid(grid, startNode.row, startNode.col);
    dijkstra(dijkstraGrid, startNode, finishNode, animations);
    findNodesInShortestPathOrder(dijkstraGrid, finishNode, animations);
    // console.log(animations);
    // console.log('hey');
    return animations;
}

function dijkstra(grid, startNode, finishNode, animations) {

    // Animation Codes:
    //  'v' denotes a visited node at a particular row and column
    //  'vf' denotes that we have finished visiting a node
    //  'sp' denotes a node is part of the shortest path

    grid[startNode.row][startNode.col].setDistance(0);
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(grid[startNode.row][startNode.col], 0);

    while (!priorityQueue.isEmpty()) {
        let closestNode = priorityQueue.dequeue().getValue();
        grid[closestNode.getRow()][closestNode.getCol()].setIsVisited(true);
        animations.push(['v', closestNode.getRow(), closestNode.getCol()]);
        animations.push(['vf', closestNode.getRow(), closestNode.getCol()]);
        if (closestNode.getRow() === finishNode.row && 
            closestNode.getCol() === finishNode.col) return;
        updateClosestNodeNeighbors(closestNode, grid, priorityQueue);
    }
}

function updateClosestNodeNeighbors(node, grid, priorityQueue) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        let altDistance = parseInt(node.getDistance()) + parseInt(neighbor.getWeight());
        if (altDistance < neighbor.getDistance()) {
            neighbor.setDistance(altDistance);
            neighbor.setPreviousNode(node);
            priorityQueue.enqueue(neighbor, neighbor.distance);
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

    return neighbors.filter(neighbor => !neighbor.isNodeVisited());
}

function findNodesInShortestPathOrder(grid, finishNode, animations) {
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

function getDijkstraGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    let nodes = [];
    for (let row = 0; row < numRows; ++row) {
        nodes.push([]);
    }

    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            nodes[row][col] = new DijkstraNode(row, col, grid[row][col].weight, Infinity);
        }
    }

    return nodes;
}