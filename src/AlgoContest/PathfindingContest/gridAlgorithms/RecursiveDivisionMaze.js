export function getRecursiveDivisionMazeWallCoordinates(numRows, numCols, startNode, finishNode) {
    const mazeWallPoints = [];
    const passagePoints = [];
    passagePoints.push([startNode.row, startNode.col]);
    passagePoints.push([finishNode.row, finishNode.col]);
    addInnerWalls(0, numRows - 1, 0, numCols - 1, mazeWallPoints, passagePoints);
    return mazeWallPoints;
}

// Recursively add an inner wall with a hole and then recursively do the
//  same for two spaces the wall splits. The width and height checks make sure
//  that the cuts make the maze look better than completely random bisections
function addInnerWalls(minRow, maxRow, minCol, maxCol, mazeWallPoints, passagePoints) {
    let width = maxCol - minCol;
    let height = maxRow - minRow;

    if(width <= 0 || height <= 0) return;

    if (width >= height) {
        // Vertical bisection
        if (width > 3) {
            let bisection = Bisect(minCol, maxCol);
            let min = minRow + 1;
            let max = maxRow - 1;
            let passage = Passage(min, max - 1);

            for (let row = minRow; row <= maxRow; ++row) {
                const point = [row, bisection];
                if(!doesArrayIncludePair(passagePoints, point)) {
                    if (row === passage) {
                        passagePoints.push(point);
                        continue;
                    } else {
                        mazeWallPoints.push(point);
                    }
                }
            }

            addInnerWalls(minRow, maxRow, minCol, bisection, mazeWallPoints, passagePoints);
            addInnerWalls(minRow, maxRow, bisection, maxCol, mazeWallPoints, passagePoints);
        }
    } else {
        // Horizontal bisection
        if (height > 3) {
            let bisection = Bisect(minRow, maxRow);
            let min = minCol;
            let max = maxCol;
            let passage = Passage(min, max - 1);

            for (let col = minCol; col <= maxCol; ++col) {
                const point = [bisection, col];
                if(!doesArrayIncludePair(passagePoints, point)) {
                    if (col === passage) {
                        passagePoints.push(point);
                        continue;
                    }
                    else {
                        mazeWallPoints.push([bisection, col]);
                    }
                }
            }

            addInnerWalls(minRow, bisection, minCol, maxCol, mazeWallPoints, passagePoints);
            addInnerWalls(bisection, maxRow, minCol, maxCol, mazeWallPoints, passagePoints);
        }
    }
}

// Used to make sure we do not overwrite a passage point, it feels really innefficient but
//  this is the simplist implementation of this check I can think of right now.
function doesArrayIncludePair(array, pair) {
    for(let i = 0; i < array.length; ++i) {
        if(array[i][0] === pair[0] && array[i][1] === pair[1]) return true;
    }
    return false;
}

function Passage(max, min) {
    return (Math.floor(randomNumber(min, max) / 2) * 2) + 1;
}

function Bisect(min, max) {
    return Math.floor(randomNumber(min, max) / 2) * 2;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}