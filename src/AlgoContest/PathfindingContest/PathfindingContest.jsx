import React from 'react';
import PathfindingVisualizerContestant from './PathfindingVisualizerContestant';
import './css/PathfindingContest.css';

const GRID_NUM_ROWS = 13;

const INITIAL_NUM_OF_CONTESTANTS = 5;
const MAX_NUM_OF_CONTESTANTS = 5;

const EMPTY_GRID_START_NODE_ROW = 3;
const EMPTY_GRID_START_NODE_COL = 3;

const ALGORITHM_TYPES = [
    'Dijkstra',
    'A* Search',
    'Greedy Best-first Search',
    'Breath-first Search',
    'Depth-first Search',
]

export default class PathfindingContest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            gridNumRows: GRID_NUM_ROWS,
            gridNumCols: -1,
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS,
            isPreContest: true,
            isEmptyGrid: true,
            startNodeRow: -1,
            startNodeColumn: -1,
            finishNodeRow: -1,
            finishNodeColumn: -1
        };
        this.setNewGridWithNodeWeightUpdated = this.setNewGridWithNodeWeightUpdated.bind(this);
        this.setNewGridWithStartNodeUpdated = this.setNewGridWithStartNodeUpdated.bind(this);
        this.setNewGridWithFinishNodeUpdated = this.setNewGridWithFinishNodeUpdated.bind(this);
        this.algoContestantRefs = [];
    }

    setRef = (ref) => {
        this.algoContestantRefs.push(ref);
    };

    componentDidMount() {
        this.setEmptyGrid();
        window.addEventListener('resize', this.handlePageResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlePageResize);
    }

    setEmptyGrid() {
        const emptyGrid = getEmptyGrid();
        const totCols = getFullPageWidthGridNumCols();
        const totRows = this.state.gridNumRows;
        const startRow = EMPTY_GRID_START_NODE_ROW;
        const startCol = EMPTY_GRID_START_NODE_COL;
        const finRow = totRows - 4;
        const finCol = totCols - 4;
        this.setState({
            ...this.state,
            grid: emptyGrid,
            gridNumCols: totCols,
            startNodeRow: startRow,
            startNodeColumn: startCol,
            finishNodeRow: finRow,
            finishNodeColumn: finCol,
            isEmptyGrid: true
        });
    }

    setResizedGridWithUpdatedNodesCopied() {
        const grid = this.state.grid;
        const startRow = this.state.startNodeRow;
        const startCol = this.state.startNodeColumn;
        const finRow = this.state.finishNodeRow;
        const finCol = this.state.finishNodeColumn;
        const totCols = getFullPageWidthGridNumCols();
        let resizedGrid = getResizedGridWithUpdatedNodesCopied(grid);

        //move start and end nodes to be in grid if necessary
        const lastResizedGridIndex = resizedGrid[0].length - 1;
        if(startCol > lastResizedGridIndex) {
            resizedGrid = this.moveStartNodeToBeInGrid(resizedGrid, startRow);
        }
        
        if(finCol > lastResizedGridIndex) {
            resizedGrid = this.moveFinishNodeToBeInGrid(resizedGrid, finRow);
        }

        this.setState({
            ...this.state,
            grid: resizedGrid,
            gridNumCols: totCols,
            isEmptyGrid: false
        });
    }

    moveStartNodeToBeInGrid(resizedGrid, startRow) {
        let grid = resizedGrid.slice();
        let lastResizedGridCol = resizedGrid[0].length - 1;
        const node = grid[startRow][lastResizedGridCol];
        const newStartNode = {
            ...node,
            weight: 1,
            isStart: true
        };
        grid[startRow][lastResizedGridCol] = newStartNode;

        this.setState({
            ...this.state,
            startNodeRow: startRow,
            startNodeColumn: lastResizedGridCol
        });

        return grid;
    }

    moveFinishNodeToBeInGrid(resizedGrid, finRow) {
        let grid = resizedGrid.slice();
        let lastResizedGridCol = resizedGrid[0].length - 1;
        const node = grid[finRow][lastResizedGridCol];
        const newFinishNode = {
            ...node,
            weight: 1,
            isFinish: true
        };
        grid[finRow][lastResizedGridCol] = newFinishNode;

        this.setState({
            ...this.state,
            finishNodeRow: finRow,
            finishNodeColumn: lastResizedGridCol
        });

        return grid;
    }

    setNewGridWithNodeWeightUpdated(row, col, newWeight) {
        const newGrid = getNewGridWithNodeWeightUpdated(this.state.grid, row, col, newWeight);
        this.setState({
            ...this.state,
            grid: newGrid,
            isEmptyGrid: false
        });
    }

    setNewGridWithStartNodeUpdated(row, col) {
        const prevStartNodeRow = this.state.startNodeRow;
        const prevStartNodeCol = this.state.startNodeColumn;
        const newGrid = getNewGridWithStartNodeUpdated(this.state.grid, row, col, prevStartNodeRow, prevStartNodeCol);
        this.setState({
            ...this.state,
            grid: newGrid,
            isEmptyGrid: false,
            startNodeRow: row,
            startNodeColumn: col    
        });
    }

    setNewGridWithFinishNodeUpdated(row, col) {
        console.log(`${row}-${col}`)
        const prevFinishNodeRow = this.state.finishNodeRow;
        const prevFinishNodeCol = this.state.finishNodeColumn;
        const newGrid = getNewGridWithFinishNodeUpdated(this.state.grid, row, col, prevFinishNodeRow, prevFinishNodeCol);
        this.setState({
            ...this.state,
            grid: newGrid,
            isEmptyGrid: false,
            finishNodeRow: row,
            finishNodeColumn: col 
        });
    }

    handlePageResize = () => {
        if(getFullPageWidthGridNumCols() !== this.state.numCols) {
            if(this.state.isEmptyGrid) {
                this.setEmptyGrid();
            }
            else {
                this.setResizedGridWithUpdatedNodesCopied();
            }
        }

        let windowWidthSize = window.innerWidth;
        if(windowWidthSize <= 700) {
            document.querySelector('#algo-contest-header-link').textContent = 'AlgoContest';
        }
        else {
            document.querySelector('#algo-contest-header-link').textContent = 'AlgorithmContest';
        }
    }

    startContestButtonOnClick() {
        console.log("Contest Starting");
    }

    resetGridButtonOnClick() {
        console.log("Grid Reseting");
        this.setEmptyGrid();
    }

    skipToFinishButtonOnClick() {
        console.log("Contest Being Skipped");
    }

    render() {
        const ContestantNumbers = [];
        for(let i = 0; i < MAX_NUM_OF_CONTESTANTS; ++i) {
            ContestantNumbers.push(i+1);
        }

        return (
            <div className='pathfinding-contest'>
                <div id="pathfinding-contest-header">
                    <button id="path-start-contest-button" onClick={() => this.startContestButtonOnClick()}>Start</button>
                    <button id="reset-grid-button" onClick={() => this.resetGridButtonOnClick()}>Reset Grid</button>
                    <div id="path-num-of-contestants-label">
                        {this.state.numOfContestants} Contestants
                    </div>
                    <button onClick={() => console.log(this.state)}>Log State</button>
                    <button id="path-skip-to-finish-button" onClick={() => this.skipToFinishButtonOnClick()}>Skip To Finish</button>
                </div>
                <div className='pathfinding-visualizers'>
                    {ContestantNumbers.map(contestantNum => (
                        <PathfindingVisualizerContestant
                            key={contestantNum}
                            ref={this.setRef}
                            grid={this.state.grid}
                            algorithmType={ALGORITHM_TYPES[(contestantNum - 1) % ALGORITHM_TYPES.length]}
                            algorithmTypes={ALGORITHM_TYPES}
                            contestantNumber={contestantNum}
                            updateGridNodeWeight={this.setNewGridWithNodeWeightUpdated}
                            updateStartNode={this.setNewGridWithStartNodeUpdated}
                            updateFinishNode={this.setNewGridWithFinishNodeUpdated}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

const getFullPageWidthGridNumCols = () => {
    return Math.ceil((window.innerWidth - 16) / 16);
}

const getEmptyGrid = () => {
    const grid = [];
    const totCols = getFullPageWidthGridNumCols();
    const totRows = GRID_NUM_ROWS;
    const startRow = EMPTY_GRID_START_NODE_ROW;
    const startCol = EMPTY_GRID_START_NODE_COL;
    const finRow = totRows - 4;
    const finCol = totCols - 4;

    //empty, start, and finish nodes all have weight of one
    const initialNodeWeight = 1;

    for (let row = 0; row < totRows; row++) {
        const currentRow = [];
        for (let col = 0; col < totCols; col++) {
            currentRow.push(createInitialNode(row, col, totRows, totCols, startRow, startCol, finRow, finCol, initialNodeWeight));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createInitialNode = (row, col, totRows, totCols, startRow, startCol, finRow, finCol, weight) => {
    return {
        row,
        col,
        weight,
        isStart: row === startRow && col === startCol,
        isFinish: row === finRow && col === finCol,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
};

const createNode = (row, col, totRows, totCols, weight) => {
    return {
        row,
        col,
        weight,
        isStart: false,
        isFinish: false,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
}

const getNewGridWithNodeWeightUpdated = (grid, row, col, newWeight) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      weight: newWeight,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStartNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const startNodeWeight = 1;
    const emptyNodeWeight = 1;
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      weight: startNodeWeight,
      isStart: true
    };
    const prevNode = {
        ...node,
        weight: emptyNodeWeight,
        isStart: false
    }
    newGrid[row][col] = newNode;
    newGrid[prevRow][prevCol] = prevNode;
    return newGrid;
}

const getNewGridWithFinishNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const finishNodeWeight = 1;
    const emptyNodeWeight = 1;
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      weight: finishNodeWeight,
      isFinish: true
    };
    const prevNode = {
        ...node,
        weight: emptyNodeWeight,
        isFinish: false
    }
    newGrid[row][col] = newNode;
    newGrid[prevRow][prevCol] = prevNode;
    return newGrid;
}



const getResizedGridWithUpdatedNodesCopied = (grid) => {
    const resizedGrid = [];
    const totCols = getFullPageWidthGridNumCols();
    const totRows = GRID_NUM_ROWS;
    const prevLastColIndex = grid[0].length - 1;
    const initialNodeWeight = 1;

    for (let row = 0; row < totRows; row++) {
        const currentRow = [];
        for (let col = 0; col < totCols; col++) {
            if(col < grid[row].length) {
                if(col === prevLastColIndex) {
                    const node = grid[row][col];
                    const updatedNode = {
                      ...node,
                      isLastColumn: false,
                    };
                    currentRow.push(updatedNode);
                }
                else {
                    currentRow.push(grid[row][col]);
                }
            }
            else {
                currentRow.push(createNode(row, col, totRows, totCols, initialNodeWeight));
            }
        }
        resizedGrid.push(currentRow);
    }

    return resizedGrid;
}