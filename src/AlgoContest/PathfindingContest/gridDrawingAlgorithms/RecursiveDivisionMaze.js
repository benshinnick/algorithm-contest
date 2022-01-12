export function getRecursiveDivisionMazeWallCoordinates(numRows, numCols) {
    const mazeWallPoints = []
    addInnerWalls(true, 0, numRows - 1, 0, numCols - 1, mazeWallPoints);
    return mazeWallPoints;
}

function addInnerWalls(isHorizontalWall, minRow, maxRow, minCol, maxCol, mazeWallPoints) {
    if(isHorizontalWall) {
        if (maxCol - minCol < 1) {
            return;
        }

        //horizontal walls are added on even rows
        let row;
        if(minRow === 0) {
            row = 2 * Math.round(Math.floor((minRow + maxRow) / 2) / 2);
        }
        else {
            row = Math.floor(randomNumber(minRow, maxRow) / 2) * 2;
        }
        // console.log(`HORIZONTAL LINE FROM minCol: ${minCol} to maxCol: ${maxCol} on row: ${row}`);
        addHorizontalWall(minCol, maxCol, row, mazeWallPoints);

        addInnerWalls(!isHorizontalWall, minRow, row - 1, minCol, maxCol, mazeWallPoints);
        addInnerWalls(!isHorizontalWall, row + 1, maxRow, minCol, maxCol, mazeWallPoints);
    } else {
        if (maxRow - minRow < 1) {
            return;
        }

        //vertical walls are added on even columns
        let col;
        if(minCol === 0) {
            col = 2 * Math.round(Math.floor((minCol + maxCol) / 2) / 2);
        }
        else {
            col = Math.floor(randomNumber(minCol, maxCol) / 2 ) * 2;
        }
        // console.log(`VETICAL LINE FROM minRow: ${minRow} to maxRow: ${maxRow} on col: ${col}`);
        addVerticalWall(minRow, maxRow, col, mazeWallPoints);

        addInnerWalls(!isHorizontalWall, minRow, maxRow, minCol, col - 1, mazeWallPoints);
        addInnerWalls(!isHorizontalWall, minRow, maxRow, col + 1, maxCol, mazeWallPoints);
    }

    return mazeWallPoints;
}

function addHorizontalWall(minCol, maxCol, row, mazeWallPoints) {
    //holes are added on odd cols
    let hole = Math.floor(randomNumber(minCol, maxCol) / 2) * 2 + 1;

    for (let col = minCol; col <= maxCol; ++col) {
        if (col === hole) continue;
        else if (col === minCol && col !== 0) continue;
        // else if (col === maxCol) continue;
        else mazeWallPoints.push([row, col]);
    }
}

function addVerticalWall(minRow, maxRow, col, mazeWallPoints) {
    //holes are added on odd rows
    let hole = Math.floor(randomNumber(minRow, maxRow) / 2) * 2 + 1;

    for (let row = minRow; row <= maxRow; ++row) {
        if (row === hole) continue;
        else if (row === minRow && row !== 0) continue;
        // else if (row === maxRow) continue;
        else mazeWallPoints.push([row, col]);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// // x1 = minCol x2 = maxCol y1 = minRow y2 = maxRow
// function addInnerWalls(minRow, maxRow, minCol, maxCol) {
//     let width = maxCol - minCol;
//     let height = maxRow - minRow;

//     if (width >= height) {
//         // Vertical bisection
//         if (maxCol - minCol > 4) {
//             let bisection = Bisect(minCol, maxCol);
//             let passage = Passage(maxRow, minRow);
//             let first = false;
//             let second = false;

//             if (!mazeWallPoints.includes([maxRow, bisection])) {    
//                 passage = maxRow;
//                 first = true;
//             }
//             if (!mazeWallPoints.includes([minRow, bisection])) {   
//                 passage = minRow;
//                 second = true;
//             }

//             for (let row = minRow; row <= maxRow; ++row) {
//                 if (row === passage) {
//                     continue;
//                 } else {
//                     mazeWallPoints.push([row, bisection]);
//                 }
//             }

//             addInnerWalls(minRow, maxRow, minCol, bisection);
//             addInnerWalls(minRow, maxRow, bisection, maxCol);
//         }
//     } else {
//         // Horizontal bisection
//         if (maxRow - minRow > 4) {
//             let bisection = Bisect(minRow, maxRow);
//             let passage = Passage(maxCol, minCol);
//             let first = false;
//             let second = false;

//             if (!mazeWallPoints.includes([bisection, maxCol])) {  
//                 passage = maxCol;
//                 first = true;
//             }
//             if (!mazeWallPoints.includes([bisection, minCol])) {
//                 passage = minCol;
//                 second = true;
//             }

//             for (let col = minCol; col <= maxCol; ++col) {
//                 if (col === passage) {
//                     continue;
//                 } else {
//                     mazeWallPoints.push([bisection, col]);
//                 }
//             }

//             addInnerWalls(minRow, bisection, minCol, maxCol);
//             addInnerWalls(bisection, maxRow, minCol, maxCol);
//         }
//     }
// }

// function Passage(max, min) {
//   return Math.floor(Math.random() * (max - min)) + min;
// }

// function Bisect(a, b) {
//   return Math.ceil((a + b) / 2);
// }