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

const NODE_TYPES = [
    ['Empty','Weight-1'],
    ['Path','Weight-2'],
    ['Grass','Weight-5'],
    ['Sand','Weight-10'],
    ['Water','Weight-15'],
    ['Wall','Weight-Inf']
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
            selectedNodeType: 'Weight-Inf',
            selectedNodeWeight: Infinity,
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
        document.getElementById('node-selection-dropdown-content').style.display = 'none';
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

    selectNodeTypeDropdownOnClick() {
        console.log("Select Node Type Dropdown On Click");
        toggleSelectNodeTypeDropdownButtons();
    }

    nodeSelectionDropdownButtonOnClick(nodeType) {
        const nodeTypeInfo = nodeType.split('-');
        let nodeTypeWeight = nodeTypeInfo[1];
        if(nodeTypeWeight === 'Inf') {
            nodeTypeWeight = 'Infinity';
        }
        this.setState({...this.state, selectedNodeType: nodeType, selectedNodeWeight: nodeTypeWeight});
        toggleSelectNodeTypeDropdownButtons();
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
                    <div id="select-node-type-dropdown">
                        <button id="select-node-type-dropdown-button" onClick={() => this.selectNodeTypeDropdownOnClick()}>
                            <div id="selected-node-display-container">
                                <div id="selected-node-display" className={`display-node-${this.state.selectedNodeType}`}></div>
                            </div>
                            <div id="select-node-type-button-text">Select Node Type</div>
                            <div id='node-selection-dropdown-arrow'>▼</div>
                        </button>
                            {/* node selection dropdown content */}
                            <div id="node-selection-dropdown-content">
                                {NODE_TYPES.map((nodeType) => (
                                (nodeType[1] !== this.state.selectedNodeType) ?
                                    <button
                                        key={nodeType[1]}
                                        id='node-selection-dropdown-button'
                                        onClick={() => this.nodeSelectionDropdownButtonOnClick(nodeType[1])}
                                    ><div id="selected-node-display" className={`display-node-${nodeType[1]}`}></div>
                                    <div id='node-selection-dropdown-button-node-type-name'>{nodeType[0]}</div>
                                    <div id='node-selection-dropdown-button-node-type-weight'>{nodeType[1]}</div>
                                    </button>
                                    : null
                                    
                                ))}
                            </div>
                    </div>
                    <div id="path-num-of-contestants-label">{this.state.numOfContestants} Contestants</div>
                    {/* <button onClick={() => console.log(this.state)}>Log State</button> */}
                    <button id="path-skip-to-finish-button" onClick={() => this.skipToFinishButtonOnClick()}>Skip To Finish</button>
                </div>
                <div className='pathfinding-visualizers'>
                    {ContestantNumbers.map(contestantNum => (
                        <PathfindingVisualizerContestant
                            key={contestantNum}
                            ref={this.setRef}
                            grid={this.state.grid}
                            selectedNodeWeight={this.state.selectedNodeWeight}
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

const toggleSelectNodeTypeDropdownButtons = () => {
    const selectNodeTypeDropdownButtonContainer = document.getElementById('node-selection-dropdown-content');
    if(selectNodeTypeDropdownButtonContainer.style.display === 'none') {
        selectNodeTypeDropdownButtonContainer.style.display = 'block';
    }
    else {
        selectNodeTypeDropdownButtonContainer.style.display = 'none';
    }
}

const getFullPageWidthGridNumCols = () => {
    return Math.floor((window.innerWidth - 16) / 16);
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
      row: row,
      col: col,
      isStart: false,
      isFinish: false,
      weight: newWeight,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStartNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const totRows = grid.length;
    const totCols = grid[0].length;
    const startNodeWeight = 1;
    const emptyNodeWeight = 1;
    const node = newGrid[row][col];
    const prevNode = {
        ...node,
        row: prevRow,
        col: prevCol,
        weight: emptyNodeWeight,
        isStart: false,
        isLastRow: prevRow === totRows - 1,
        isLastColumn: prevCol === totCols - 1
    }
    const newNode = {
        ...node,
        row: row,
        col: col,
        weight: startNodeWeight,
        isStart: true,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
    newGrid[prevRow][prevCol] = prevNode;
    newGrid[row][col] = newNode;
    return newGrid;
}

const getNewGridWithFinishNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const totRows = grid.length;
    const totCols = grid[0].length;
    const finishNodeWeight = 1;
    const emptyNodeWeight = 1;
    const node = newGrid[row][col];
    const prevNode = {
        ...node,
        row: prevRow,
        col: prevCol,
        weight: emptyNodeWeight,
        isFinish: false,
        isLastRow: prevRow === totRows - 1,
        isLastColumn: prevCol === totCols - 1
    }
    const newNode = {
        ...node,
        row: row,
        col: col,
        weight: finishNodeWeight,
        isFinish: true,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
    newGrid[prevRow][prevCol] = prevNode;
    newGrid[row][col] = newNode;
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