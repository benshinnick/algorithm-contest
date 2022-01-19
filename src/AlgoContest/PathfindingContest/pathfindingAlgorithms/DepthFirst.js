import { DepthFirstNode } from "../dataStructures/DepthFirstNode";

export function getDepthFirstAnimations(grid, startNode, finishNode) {
    const animations = [];
    const depthFirstGrid = getDepthFirstGrid(grid, startNode.row, startNode.col);
    depthFirstSearch(depthFirstGrid, startNode, finishNode, animations);
    reconstructShortestPath(depthFirstGrid, finishNode, animations);
    return animations;
}

function depthFirstSearch(grid, startNode, finishNode, animations) {
    // Animation Codes:
    //  'v' denotes a visited node at a particular row and column
    //  'vf' denotes that we have finished visiting a node
    //  'sp' denotes that we are starting to reconstruct the shortest path on a node
    //  'spf' denotes that we are finishing to reconstruct the shortest path on a node
    let stack = [];
    let currentNode = grid[startNode.row][startNode.col];
    currentNode.setIsDiscovered(true);
    stack.push(currentNode);

    while(stack.length > 0) {
        currentNode = stack.pop();
        animations.push(['v', currentNode.getRow(), currentNode.getCol()]);
        animations.push(['vf', currentNode.getRow(), currentNode.getCol()]);
        if (currentNode.getRow() === finishNode.row && 
            currentNode.getCol() === finishNode.col) return;
        const undiscoveredNeighbors = getUndiscoveredNeighbors(currentNode, grid);
        for(const neighbor of undiscoveredNeighbors) {
            neighbor.setPreviousNode(currentNode);
            neighbor.setIsDiscovered(true);
            stack.push(neighbor);
        }
    }

    return;
}

function getUndiscoveredNeighbors(node, grid) {
    const neighbors = [];
    const row = node.getRow();
    const col = node.getCol();
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);

    return neighbors.filter(neighbor => !neighbor.isNodeDiscovered() && !neighbor.isNodeWall());
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

function getDepthFirstGrid(grid) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    let nodes = [];
    for (let row = 0; row < numRows; ++row) {
        nodes.push([]);
    }

    for (let row = 0; row < numRows; ++row) {
        for (let col = 0; col < numCols; ++col) {
            nodes[row][col] = new DepthFirstNode(row, col, parseFloat(grid[row][col].weight));
        }
    }

    return nodes;
}