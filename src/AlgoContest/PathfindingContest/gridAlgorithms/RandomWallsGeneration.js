const WALL_APPEARANCE_PERCENTAGE = 25;

export function getRandomWallsCoordinates(numRows, numCols, startNode, finishNode) {
    const wallCoordinates = generateRandomWalls(numRows, numCols, startNode, finishNode);
    return wallCoordinates;
}

function generateRandomWalls(numRows, numCols, startNode, finishNode) {
    const wallCoordinates = [];

    for(let r = 0; r < numRows; ++r) {
        for(let c = 0; c < numCols; ++c) {
            if((r === startNode.row && c === startNode.col) || 
               (r === finishNode.row && c === finishNode.col)) {
                   continue;
            }
            if(doesWallAppearAtCurrentPosition()) {
                wallCoordinates.push([r, c]);
            }
        }
    }

    return wallCoordinates;
}

function doesWallAppearAtCurrentPosition() {
    return getRandomInt(101) < WALL_APPEARANCE_PERCENTAGE;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}