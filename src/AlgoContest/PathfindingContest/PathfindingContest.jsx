import React from 'react';
import PathfindingVisualizerContestant from './PathfindingVisualizerContestant';
import { getRecursiveDivisionMazeWallCoordinates } from './gridAlgorithms/RecursiveDivisionMaze';
import { getRandomWallsCoordinates } from './gridAlgorithms/RandomWallsGeneration';
import { getPremadeMap } from './gridAlgorithms/PremadeMaps';
import { getShortestPathLength } from './pathfindingAlgorithms/AStar';
import './css/PathfindingContest.css';

const GRID_NUM_ROWS = 15;
const COUNTDOWN_DURATION_MS = PathfindingVisualizerContestant.ANIMATION_DELAY_MS;

const INITIAL_NUM_OF_CONTESTANTS = 4;
const MAX_NUM_OF_CONTESTANTS = 4;

const EMPTY_GRID_START_NODE_ROW = 5;
const EMPTY_GRID_START_NODE_COL = 5;

const ALGORITHM_TYPES = [
    'Dijkstra',
    'A* Search',
    'Greedy Best-first Search',
    'Depth-first Search',
    'Breadth-first Search'
]

const NODE_TYPES = [
    ['Empty','Weight-1'],
    ['Path','Weight-2'],
    ['Grass','Weight-5'],
    ['Sand','Weight-10'],
    ['Water','Weight-25'],
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
        this.setNewGridWithMultipleWeightNodesUpdated = this.setNewGridWithMultipleWeightNodesUpdated.bind(this);
        this.algoContestantRefs = [];
    }

    setRef = (ref) => {
        this.algoContestantRefs.push(ref);
    };

    componentDidMount() {
        this.setEmptyGrid();
        this.resetPathfindingContestPage();
        window.addEventListener('resize', this.handlePageResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlePageResize);
    }

    startContest() {
        this.setState({...this.state, isPreContest: false});
        this.disablePreContestButtons();
        this.disableGrids();
        this.enableDuringContestControlButtons();
        this.clearPathAndVisitedNodes();
        this.startCountdown();
        const allContestantAnimationData = this.getAllContestantAnimationDataAndSetAlgorithmStatInfo();
        this.runContestAnimations(allContestantAnimationData);
        this.scheduleContestFinishedCommands(allContestantAnimationData);
    }

    scheduleContestFinishedCommands(allContestantAnimationData) {

        const allContestantMaxAnimationSteps = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantMaxAnimationSteps.push(allContestantAnimationData[i].length);
        }

        const maxNumberOfAnimationSteps = Math.max(...allContestantMaxAnimationSteps);
        setTimeout(() => {
            this.handleContestIsNowFinished();
        }, maxNumberOfAnimationSteps * this.algoContestantRefs[0].getAnimationSpeed() + PathfindingVisualizerContestant.ANIMATION_DELAY_MS);
    }

    handleContestIsNowFinished() {
        this.enablePreContestSetupButtons();
        this.disableDuringContestControlButtons();
        this.enableGrids();
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].createAlgorithmStatsLabel();
            this.algoContestantRefs[i].setAllAlgorithmStatInfo(-1, -1, -1);
        }
    }

    startCountdown() {
        let numOfCountdownSeconds = COUNTDOWN_DURATION_MS / 1000;
        for(let i = 0; i < numOfCountdownSeconds; ++i) {
            setTimeout(() => {
                document.getElementById("path-start-contest-button").innerHTML = `${numOfCountdownSeconds - i}`;
            }, i * 1000);
        }

        setTimeout(() => {
            document.getElementById("path-start-contest-button").innerHTML = 'GO!';
        }, COUNTDOWN_DURATION_MS); 
    }

    getAllContestantAnimationDataAndSetAlgorithmStatInfo() {
        const allContestantAnimationData = [];
        const shortestPathLength = getShortestPathLength(
            this.state.grid,
            this.state.grid[this.state.startNodeRow][this.state.startNodeColumn],
            this.state.grid[this.state.finishNodeRow][this.state.finishNodeColumn]
        );

        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantAnimationData[i] = this.algoContestantRefs[i].getPathfindingAnimations(
                this.state.grid[this.state.startNodeRow][this.state.startNodeColumn],
                this.state.grid[this.state.finishNodeRow][this.state.finishNodeColumn]
            );

            let numOfNodesVisisted = 0;
            let lengthOfPath = 0;
            for(let j = 0; j < allContestantAnimationData[i].length; ++j){
                const animationCode = allContestantAnimationData[i][j][0];
                if(animationCode === 'v') {
                    numOfNodesVisisted++;
                }
                else if(animationCode === 'spf') {
                    const row = allContestantAnimationData[i][j][1];
                    const col = allContestantAnimationData[i][j][2];
                    lengthOfPath += parseInt(this.state.grid[row][col].weight);
                }
            }
            this.algoContestantRefs[i].setAllAlgorithmStatInfo(numOfNodesVisisted, lengthOfPath, shortestPathLength);
        }

        return allContestantAnimationData;
    }

    runContestAnimations(allContestantAnimationData) {
        let stepCounter = 0;
        let numOfFinishedContestants = 0;
        let placeNumber = 0;
        while(numOfFinishedContestants < this.state.numOfContestants) {
            let hasContestantFinishedThisStep = false;
            for(let i = 0; i < this.state.numOfContestants; ++i) {
                if(stepCounter > allContestantAnimationData[i].length) {
                    continue;
                }
                else if(stepCounter === allContestantAnimationData[i].length) {
                    numOfFinishedContestants++;
                    if(hasContestantFinishedThisStep === false) {
                        placeNumber++;
                        hasContestantFinishedThisStep = true;
                        this.algoContestantRefs[i].scheduleAlgorithmIsNowFinishedCommands(stepCounter, placeNumber);
                    }
                    else {
                        this.algoContestantRefs[i].scheduleAlgorithmIsNowFinishedCommands(stepCounter, placeNumber);
                    }
                    console.log('contestant finished');
                    continue;
                }
                else {
                    this.algoContestantRefs[i].doAnimationNextStep(
                        allContestantAnimationData[i][stepCounter], stepCounter
                    );
                }
            }
            stepCounter++;
        }
    }

    setEmptyGrid() {
        const emptyGrid = getEmptyGrid();
        const totCols = getFullPageWidthGridNumCols();
        const totRows = GRID_NUM_ROWS;
        const startRow = EMPTY_GRID_START_NODE_ROW;
        const startCol = EMPTY_GRID_START_NODE_COL;
        const finRow = totRows - 6;
        const finCol = totCols - 6;
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

    setNewGridWithMultipleWeightNodesUpdated(updatedNodesCoordinates, newWeight) {
        const newGrid = getNewGridWithMultipleNodeWeightsUpdated(this.state.grid, updatedNodesCoordinates, newWeight);
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
            if(this.state.isPreContest) {
                if(this.state.isEmptyGrid) {
                    this.resetPathfindingContestPage();
                    this.setEmptyGrid();
                }
                else {
                    this.resetPathfindingContestPage();
                    this.setResizedGridWithUpdatedNodesCopied();
                }
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

    clearPathAndVisitedNodes() {
        const visitedNodes = document.querySelectorAll('.visited');
        for(let i = 0; i < visitedNodes.length; ++i) {
            visitedNodes[i].classList.remove('visited');
        }
        const shortestPathLines = document.querySelectorAll('.shortest-path');
        for(let i = 0; i < shortestPathLines.length; ++i) {
            shortestPathLines[i].remove();
        }
    }

    startContestButtonOnClick() {
        this.resetPathfindingContestPage();
        this.startContest();
    }

    resetButtonOnClick() {
        if(document.getElementById('reset-grid-button').disabled !== true) {
            toggleResetGridDropdownButtons();
        }
    }

    clearPathButtonOnClick() {
        toggleResetGridDropdownButtons();
        this.resetPathfindingContestPage();
    }

    resetGridButtonOnClick() {
        toggleResetGridDropdownButtons();
        this.resetPathfindingContestPage();
        this.setEmptyGrid();

    }

    skipToFinishButtonOnClick() {
        console.log("Contest Being Skipped");
    }

    selectNodeTypeDropdownOnClick() {
        if(document.getElementById('select-node-type-dropdown-button').disabled !== true) {
            toggleSelectNodeTypeDropdownButtons();
        }
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

    mazesAndMapsButtonOnClick() {
        if(document.getElementById("mazes-and-maps-button").disabled !== true) {
            toggleSelectMazesAndMapsDropdownButtons();
        }
    }

    recursiveMazeButtonOnClick() {
        toggleSelectMazesAndMapsDropdownButtons();
        this.resetPathfindingContestPage();
        const emptyGrid = getEmptyGrid();
        const totCols = getFullPageWidthGridNumCols();
        const recursiveMazeWallCoordinates = getRecursiveDivisionMazeWallCoordinates(
            this.state.gridNumRows,
            this.state.gridNumCols,
            this.state.grid[EMPTY_GRID_START_NODE_ROW][EMPTY_GRID_START_NODE_COL],
            this.state.grid[GRID_NUM_ROWS - 6][totCols - 6]
        );
        const mazeGrid = getNewGridWithMultipleNodeWeightsUpdated(emptyGrid, recursiveMazeWallCoordinates, Infinity);
        this.setState({
            ...this.state,
            grid: mazeGrid,
            startNodeRow: EMPTY_GRID_START_NODE_ROW,
            startNodeColumn: EMPTY_GRID_START_NODE_COL,
            finishNodeRow: GRID_NUM_ROWS - 6,
            finishNodeColumn: totCols - 6
        });
    }

    setGridToPremadeMap(mapType) {
        toggleSelectMazesAndMapsDropdownButtons();
        const prmadeMapGridWeights = getPremadeMap(this.state.gridNumRows, this.state.gridNumCols, mapType);
        this.resetPathfindingContestPage();
        const emptyGrid = getEmptyGrid();
        const totCols = getFullPageWidthGridNumCols();
        const prmadeMapGrid = getNewGridWithAllNodeWeightsUpdated(
            emptyGrid,
            prmadeMapGridWeights,
            this.state.grid[EMPTY_GRID_START_NODE_ROW][EMPTY_GRID_START_NODE_COL],
            this.state.grid[GRID_NUM_ROWS - 6][totCols - 6],
        );
        this.setState({
            ...this.state,
            grid: prmadeMapGrid,
            startNodeRow: EMPTY_GRID_START_NODE_ROW,
            startNodeColumn: EMPTY_GRID_START_NODE_COL,
            finishNodeRow: GRID_NUM_ROWS - 6,
            finishNodeColumn: totCols - 6
        });
    }

    randomWallsButtonOnClick() {
        toggleSelectMazesAndMapsDropdownButtons();
        this.resetPathfindingContestPage();
        const emptyGrid = getEmptyGrid();
        const totCols = getFullPageWidthGridNumCols();
        const randomWallsCoordinates = getRandomWallsCoordinates(
            this.state.gridNumRows,
            this.state.gridNumCols,
            this.state.grid[EMPTY_GRID_START_NODE_ROW][EMPTY_GRID_START_NODE_COL],
            this.state.grid[GRID_NUM_ROWS - 6][totCols - 6]
        );
        const randomWallGrid = getNewGridWithMultipleNodeWeightsUpdated(emptyGrid, randomWallsCoordinates, Infinity);
        this.setState({
            ...this.state,
            grid: randomWallGrid,
            startNodeRow: EMPTY_GRID_START_NODE_ROW,
            startNodeColumn: EMPTY_GRID_START_NODE_COL,
            finishNodeRow: GRID_NUM_ROWS - 6,
            finishNodeColumn: totCols - 6
        });
    }

    addContestantOnClick() {
        console.log('add contestant button has been clicked');
        this.resetPathfindingContestPage();
    }

    // Function used to print all grid node weights in a 2D array format.
    //  Used to save custom maps for later retreival.
    printGridWeights() {
        let gridWeightString = "[";

        for(let r = 0; r < this.state.gridNumRows; ++r) {
            for(let c = 0; c < this.state.gridNumCols; ++c) {
                if(c === 0) {
                    gridWeightString += `[${parseFloat(this.state.grid[r][c].weight)}, `
                }
                else if(c !== this.state.gridNumCols - 1) {
                    gridWeightString += `${parseFloat(this.state.grid[r][c].weight)}, `
                }
                else gridWeightString += `${parseFloat(this.state.grid[r][c].weight)}],\n`
            }
        }

        gridWeightString += "]";
        console.log(gridWeightString);
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
                    <div id="reset-grid-dropdown">
                        <button id="reset-grid-button" onClick={() => this.resetButtonOnClick()}>
                            <div id='reset-grid-button-text'>Reset</div>
                            <div id='reset-grid-dropdown-arrow'>▼</div>
                        </button>
                        <div id="reset-grid-dropdown-content">
                            <button className='reset-grid-dropdown-button' onClick={() => this.resetGridButtonOnClick()}>Reset Grid</button>
                            <button className='reset-grid-dropdown-button' onClick={() => this.clearPathButtonOnClick()}>Clear Path</button>
                        </div>
                    </div>
                    <div id="mazes-and-maps-dropdown">
                        <button id="mazes-and-maps-button" onClick={() => this.mazesAndMapsButtonOnClick()}>
                            <div id='mazes-and-maps-button-text'>Mazes & Maps</div>
                            <div id='mazes-and-maps-dropdown-arrow'>▼</div>
                        </button>
                        <div id="mazes-and-maps-dropdown-content">
                            <button className='mazes-and-maps-dropdown-button' onClick={() => this.recursiveMazeButtonOnClick()}>Recursive Maze</button>
                            <button className='mazes-and-maps-dropdown-button' onClick={() => this.randomWallsButtonOnClick()}>Random Walls</button>
                            <button className='mazes-and-maps-dropdown-button' onClick={() => this.setGridToPremadeMap(1)}>Islands Custom Map</button>
                            <button className='mazes-and-maps-dropdown-button' onClick={() => this.setGridToPremadeMap(2)}>Fields Custom Map</button>
                            <button className='mazes-and-maps-dropdown-button' onClick={() => this.setGridToPremadeMap(3)}>Mazes Custom Map</button>
                            {/* <button className='mazes-and-maps-dropdown-button' onClick={() => this.printGridWeights()}>Print Grid</button> */}
                        </div>
                    </div>
                    <div id="select-node-type-dropdown">
                        <button id="select-node-type-dropdown-button" onClick={() => this.selectNodeTypeDropdownOnClick()}>
                            <div id="selected-node-display-container">
                                <div id="selected-node-display" className={`display-node-${this.state.selectedNodeType}`}></div>
                            </div>
                            <div id="select-node-type-button-text">Select Node Type</div>
                            <div id="node-selection-dropdown-arrow">▼</div>
                        </button>
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
                    <button id='path-add-contestant-button' onClick={() => this.addContestantOnClick()}>Add Contestant</button>
                    <div id="path-num-of-contestants-label">{this.state.numOfContestants}</div>
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
                            updateMultipleNodeWeights={this.setNewGridWithMultipleWeightNodesUpdated}
                            updateStartNode={this.setNewGridWithStartNodeUpdated}
                            updateFinishNode={this.setNewGridWithFinishNodeUpdated}
                        />
                    ))}
                </div>
            </div>
        );
    }

    resetPathfindingContestPage() {
        this.enablePreContestSetupButtons();
        this.disableDuringContestControlButtons();
        this.clearAllAlgorithmStatsAndPlaceLabels();
        this.clearPathAndVisitedNodes();
        document.getElementById('node-selection-dropdown-content').style.display = 'none';
        document.getElementById('mazes-and-maps-dropdown-content').style.display = 'none';
        document.getElementById('reset-grid-dropdown-content').style.display = 'none';
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].resetVisualizationStyling();
        }
    }

    clearAllAlgorithmStatsAndPlaceLabels() {
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].destructAlgorithmPlaceLabel();
            this.algoContestantRefs[i].destructAlgorithmStatsLabel();
        }
        let shortestPathLabels = document.querySelectorAll('.shortest-path-found-label');
        for(let i = 0; i < shortestPathLabels.length; ++i) {
            shortestPathLabels[i].remove();
        }
        let notShortestPathLabels = document.querySelectorAll(        '.shortest-path-not-found-label');
        for(let i = 0; i < notShortestPathLabels.length; ++i) {
            notShortestPathLabels[i].remove();
        }
    }

    disableGrids() {
        const gridContainers = document.getElementsByClassName('grid-container');
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            gridContainers[i].style.pointerEvents = 'none';
        }
    }

    enableGrids() {
        const gridContainers = document.getElementsByClassName('grid-container');
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            gridContainers[i].style.pointerEvents = 'all';
        }
    }

    disablePreContestButtons() {
        document.getElementById("path-start-contest-button").disabled = true;
        document.getElementById("reset-grid-button").disabled = true;
        document.getElementById("mazes-and-maps-button").disabled = true;
        document.getElementById('select-node-type-dropdown-button').disabled = true;
        document.getElementById('path-add-contestant-button').disabled = true;

        const algorithmDropDownButtons = document.getElementsByClassName('path-algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = true;
        }
        const algorithmDropDownArrows = document.getElementsByClassName('dropdown-arrow');
        for(let i = 0; i < algorithmDropDownArrows.length; ++i) {
            algorithmDropDownArrows[i].style.visibility = 'hidden';
        }
    }

    enablePreContestSetupButtons() {
        document.getElementById("path-start-contest-button").innerHTML = 'Start';
        document.getElementById("path-start-contest-button").disabled = false;
        document.getElementById("reset-grid-button").disabled = false;
        document.getElementById("mazes-and-maps-button").disabled = false;
        document.getElementById('select-node-type-dropdown-button').disabled = false;
        document.getElementById('path-add-contestant-button').disabled = false;

        const algorithmDropDownButtons = document.getElementsByClassName('path-algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = false;
        }
        const algorithmDropDownArrows = document.getElementsByClassName('dropdown-arrow');
        for(let i = 0; i < algorithmDropDownArrows.length; ++i) {
            algorithmDropDownArrows[i].style.visibility = 'visible';
        }
    }

    disableDuringContestControlButtons() {
        document.getElementById('path-skip-to-finish-button').disabled = true;
    }

    enableDuringContestControlButtons() {
        document.getElementById('path-skip-to-finish-button').disabled = false
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

const toggleSelectMazesAndMapsDropdownButtons = () => {
    const mazesAndMapsDropdownButtonContainer = document.getElementById('mazes-and-maps-dropdown-content');
    if(mazesAndMapsDropdownButtonContainer.style.display === 'none') {
        mazesAndMapsDropdownButtonContainer.style.display = 'block';
    }
    else {
        mazesAndMapsDropdownButtonContainer.style.display = 'none';
    }
}

const toggleResetGridDropdownButtons = () => {
    const mazesAndMapsDropdownButtonContainer = document.getElementById('reset-grid-dropdown-content');
    if(mazesAndMapsDropdownButtonContainer.style.display === 'none') {
        mazesAndMapsDropdownButtonContainer.style.display = 'block';
    }
    else {
        mazesAndMapsDropdownButtonContainer.style.display = 'none';
    }
}

const getFullPageWidthGridNumCols = () => {
    return Math.floor((window.innerWidth - 15) / 11);
}

const getEmptyGrid = () => {
    const grid = [];
    const totCols = getFullPageWidthGridNumCols();
    const totRows = GRID_NUM_ROWS;
    const startRow = EMPTY_GRID_START_NODE_ROW;
    const startCol = EMPTY_GRID_START_NODE_COL;
    const finRow = totRows - 6;
    const finCol = totCols - 6;

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

const getNewGridWithMultipleNodeWeightsUpdated = (grid, updatedNodesCoordinates, newWeight) => {
    const newGrid = grid.slice();
    for(let i = 0; i < updatedNodesCoordinates.length; ++i) {
        const row = parseInt(updatedNodesCoordinates[i][0]);
        const col = parseInt(updatedNodesCoordinates[i][1]);
        const weight = parseFloat(newWeight);
        const node = newGrid[row][col];
        const newNode = {
          ...node,
          row: row,
          col: col,
          isStart: false,
          isFinish: false,
          weight: weight,
        };
        newGrid[row][col] = newNode;
    }
    return newGrid;
};

const getNewGridWithAllNodeWeightsUpdated = (grid, gridWeights, startNode, finishNode) => {
    const newGrid = grid.slice();
    for(let r = 0; r < grid.length; ++r) {
        for(let c = 0; c < grid[0].length; ++c) {
            let weight = gridWeights[r][c];
            if(r === startNode.row && c === startNode.col) weight = 1;
            else if(r === finishNode.row && c === finishNode.col) weight = 1;
            const node = newGrid[r][c];
            const newNode = {
                ...node,
                row: r,
                col: c,
                weight: weight,
            };
            newGrid[r][c] = newNode;
        }
    }
    return newGrid;
};

const getNewGridWithStartNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const totRows = grid.length;
    const totCols = grid[0].length;
    const startNodeWeight = 1;
    const emptyNodeWeight = 1;
    const prevNode = newGrid[prevRow][prevCol];
    const node = newGrid[row][col];
    const prevStartNode = {
        ...prevNode,
        row: prevRow,
        col: prevCol,
        weight: emptyNodeWeight,
        isStart: false,
        isFinish: false,
        isLastRow: prevRow === totRows - 1,
        isLastColumn: prevCol === totCols - 1
    }
    const newStartNode = {
        ...node,
        row: row,
        col: col,
        weight: startNodeWeight,
        isStart: true,
        isFinish: false,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
    newGrid[prevRow][prevCol] = prevStartNode;
    newGrid[row][col] = newStartNode;
    return newGrid;
}

const getNewGridWithFinishNodeUpdated = (grid, row, col, prevRow, prevCol) => {
    const newGrid = grid.slice();
    const totRows = grid.length;
    const totCols = grid[0].length;
    const finishNodeWeight = 1;
    const emptyNodeWeight = 1;
    const prevNode = newGrid[prevRow][prevCol];
    const node = newGrid[row][col];
    const prevFinishNode = {
        ...prevNode,
        row: prevRow,
        col: prevCol,
        weight: emptyNodeWeight,
        isStart: false,
        isFinish: false,
        isLastRow: prevRow === totRows - 1,
        isLastColumn: prevCol === totCols - 1
    }
    const newFinishNode = {
        ...node,
        row: row,
        col: col,
        weight: finishNodeWeight,
        isStart: false,
        isFinish: true,
        isLastRow: row === totRows - 1,
        isLastColumn: col === totCols - 1
    };
    newGrid[prevRow][prevCol] = prevFinishNode;
    newGrid[row][col] = newFinishNode;
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