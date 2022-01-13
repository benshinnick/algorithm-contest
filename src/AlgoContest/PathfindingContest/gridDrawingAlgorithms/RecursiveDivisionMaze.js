export function getRecursiveDivisionMazeWallCoordinates(numRows, numCols, startNode, finishNode) {
    const mazeWallPoints = [];
    addInnerWalls(0, numRows - 1, 0, numCols - 1, mazeWallPoints);
    return mazeWallPoints;
}

// x1 = minCol x2 = maxCol y1 = minRow y2 = maxRow
function addInnerWalls(minRow, maxRow, minCol, maxCol, mazeWallPoints) {
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

            // console.log(`VETICAL LINE FROM minRow: ${minRow} to maxRow: ${maxRow} on col: ${bisection}`);
            let passageFound = false;
            for (let row = minRow; row <= maxRow; ++row) {
                if (row === passage) {
                    passageFound = true;
                    continue;
                } else {
                    if(!mazeWallPoints.includes([row, bisection])) {
                        mazeWallPoints.push([row, bisection]);
                    }
                }
            }
            console.log(passageFound);

            addInnerWalls(minRow, maxRow, minCol, bisection , mazeWallPoints);
            addInnerWalls(minRow, maxRow, bisection, maxCol, mazeWallPoints);
        }
    } else {
        // Horizontal bisection
        if (height > 3) {
            let bisection = Bisect(minRow, maxRow);
            let min = minCol;
            let max = maxCol;
            let passage = Passage(min, max - 1);

            // console.log(`HORIZONTAL LINE FROM minCol: ${minCol} to maxCol: ${maxCol} on row: ${bisection}`);
            let passageFound = false;
            for (let col = minCol; col <= maxCol; ++col) {
                if (col === passage) {
                    passageFound = true;
                    continue;
                }
                else mazeWallPoints.push([bisection, col]);
            }
            console.log(passageFound);

            addInnerWalls(minRow, bisection, minCol, maxCol, mazeWallPoints);
            addInnerWalls(bisection, maxRow, minCol, maxCol, mazeWallPoints);
        }
    }
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

// function addInnerWalls(isHorizontalWall, minRow, maxRow, minCol, maxCol, mazeWallPoints) {
//     if(isHorizontalWall) {
//         if (maxCol - minCol < 1) {
//             return;
//         }

//         //horizontal walls are added on even rows
//         let row;
//         if(minRow === 0) {
//             row = 2 * Math.round(Math.floor((minRow + maxRow) / 2) / 2);
//         }
//         else {
//             row = Math.floor(randomNumber(minRow, maxRow) / 2) * 2;
//         }
//         // console.log(`HORIZONTAL LINE FROM minCol: ${minCol} to maxCol: ${maxCol} on row: ${row}`);
//         addHorizontalWall(minCol, maxCol, row, mazeWallPoints);

//         addInnerWalls(!isHorizontalWall, minRow, row - 1, minCol, maxCol, mazeWallPoints);
//         addInnerWalls(!isHorizontalWall, row + 1, maxRow, minCol, maxCol, mazeWallPoints);
//     } else {
//         if (maxRow - minRow < 1) {
//             return;
//         }

//         //vertical walls are added on even columns
//         let col;
//         if(minCol === 0) {
//             col = 2 * Math.round(Math.floor((minCol + maxCol) / 2) / 2);
//         }
//         else {
//             col = Math.floor(randomNumber(minCol, maxCol) / 2 ) * 2;
//         }
//         // console.log(`VETICAL LINE FROM minRow: ${minRow} to maxRow: ${maxRow} on col: ${col}`);
//         addVerticalWall(minRow, maxRow, col, mazeWallPoints);

//         addInnerWalls(!isHorizontalWall, minRow, maxRow, minCol, col - 1, mazeWallPoints);
//         addInnerWalls(!isHorizontalWall, minRow, maxRow, col + 1, maxCol, mazeWallPoints);
//     }

//     return mazeWallPoints;
// }

// function addHorizontalWall(minCol, maxCol, row, mazeWallPoints) {
//     //holes are added on odd cols
//     let hole = Math.floor(randomNumber(minCol, maxCol) / 2) * 2 + 1;

//     for (let col = minCol; col <= maxCol; ++col) {
//         if (col === hole) continue;
//         else if (col === minCol && col !== 0) continue;
//         else if (col === maxCol && col != totCols - 1) continue;
//         else mazeWallPoints.push([row, col]);
//     }
// }

// function addVerticalWall(minRow, maxRow, col, mazeWallPoints) {
//     //holes are added on odd rows
//     let hole = Math.floor(randomNumber(minRow, maxRow) / 2) * 2 + 1;

//     for (let row = minRow; row <= maxRow; ++row) {
//         if (row === hole) continue;
//         else if (row === minRow && row !== 0) continue;
//         else if (row === maxRow && row !== totRows - 1) continue;
//         else mazeWallPoints.push([row, col]);
//     }
// }

// function randomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }