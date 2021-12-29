import React from 'react';
import PathfindingVisualizerContestant from './PathfindingVisualizerContestant';
import './css/PathfindingContest.css';

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
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS,
            isPreContest: true
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handlePageResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlePageResize);
    }

    handlePageResize = () => {
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
                            array={this.state.array}
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