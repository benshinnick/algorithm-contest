var mazeWallPoints = [];

export function getRecursiveDivisionMazeWallPoints(numRows, numCols) {
    addInnerWalls(false, 0, numRows - 1, 0, numCols - 1);
    return mazeWallPoints;
}

function addInnerWalls(isHorizontalWall, minRow, maxRow, minCol, maxCol) {
    if(isHorizontalWall) {
        if (maxCol - minCol < 1) {
            return;
        }

        //horizontal walls are added on even rows
        var row = Math.floor(randomNumber(minRow, maxRow) / 2) * 2;
        // console.log(`HORIZONTAL LINE FROM minCol: ${minCol} to maxCol: ${maxCol} on row: ${row}`);
        addHorizontalWall(minCol, maxCol, row);

        addInnerWalls(!isHorizontalWall, minRow, row - 1, minCol, maxCol);
        addInnerWalls(!isHorizontalWall, row + 1, maxRow, minCol, maxCol);
    } else {
        if (maxRow - minRow < 1) {
            return;
        }

        //vertical walls are added on even columns
        var col = Math.floor(randomNumber(minCol, maxCol) / 2 ) * 2;
        // console.log(`VETICAL LINE FROM minRow: ${minRow} to maxRow: ${maxRow} on col: ${col}`);
        addVerticalWall(minRow, maxRow, col);

        addInnerWalls(!isHorizontalWall, minRow, maxRow, minCol, col - 1);
        addInnerWalls(!isHorizontalWall, minRow, maxRow, col + 1, maxCol);
    }
}

function addHorizontalWall(minCol, maxCol, row) {
    //holes are added on odd cols
    let hole = Math.floor(randomNumber(minCol, maxCol) / 2) * 2 + 1;

    for (let col = minCol; col <= maxCol; ++col) {
        if (col === hole) continue;
        else mazeWallPoints.push([row, col]);
    }
}

function addVerticalWall(minRow, maxRow, col) {
    //holes are added on odd rows
    let hole = Math.floor(randomNumber(minRow, maxRow) / 2) * 2 + 1;

    for (let row = minRow; row <= maxRow; ++row) {
        if (row === hole) continue;
        else mazeWallPoints.push([row, col]);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}