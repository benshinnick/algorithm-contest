import React from 'react';
import './css/PathfindingContest.css';

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
            grid: []
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

    render() {
        return (
            <div id='pathfinding-contest'>
                <p className="placeholder-text">Pathfinding Contest (Placeholder)</p>
                <p className="placeholder-text">Future Project</p>
                <p className="placeholder-text">Now In Development</p>
            </div>
        );
    }
}