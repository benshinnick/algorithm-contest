import React from 'react';
import PathfindingVisualizerContestant from './PathfindingVisualizerContestant';
import './css/PathfindingContest.css';

const NUM_ROWS = 13;

const START_NODE_ROW = 4;
const START_NODE_COL = 4;

//temporary
const FINISH_NODE_ROW = 4;
const FINISH_NODE_COL = 8;

const INITIAL_NUM_OF_CONTESTANTS = 3;
const MAX_NUM_OF_CONTESTANTS = 3;
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
            gridRows: NUM_ROWS,
            gridCols: -1,
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS,
            isPreContest: true
        };
    }

    componentDidMount() {
        const initialGrid = getInitialGrid();
        this.setState({...this.state, grid: initialGrid, gridCols: initialGrid[0].length});
        window.addEventListener('resize', this.handlePageResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlePageResize);
    }

    handlePageResize = () => {
        if(getFullPageWidthGridNumCols() != this.state.numCols) {
            const initialGrid = getInitialGrid();
            this.setState({...this.state, grid: initialGrid, gridCols: initialGrid[0].length});
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
                        />
                    ))}
                </div>
            </div>
        );
    }
}

const getFullPageWidthGridNumCols = () => {
    return Math.ceil((window.innerWidth) / 16);
}

const getInitialGrid = () => {
    const grid = [];
    const numCols = getFullPageWidthGridNumCols();
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow = [];
        for (let col = 0; col < numCols; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      isWall: false,
      row
    };
  };