import React from 'react';
import ReactDOM from 'react-dom';
import SortContest from './SortContest/SortContest.jsx';
import PathfindingContest from './PathfindingContest/PathfindingContest.jsx';
import './AlgoContest.css';

export default class AlgoContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            algorithmType: ''
        };
    }

    componentDidMount() {
        this.changePageContentToSortContest();
    }

    changePageContentToSortContest() {
        this.setState({ algorithmType: 'sort' });

        document.querySelector('#sort-contest-button').style.backgroundColor = '#6c757d';
        document.querySelector('#pathfinding-contest-button').style.backgroundColor = 'transparent';

        ReactDOM.render(<SortContest />, document.getElementById('main-content'));
    }

    changePageContentToPathfindingContest() {
        this.setState({ algorithmType: 'pathfinding' });

        document.querySelector('#sort-contest-button').style.backgroundColor = 'transparent';
        document.querySelector('#pathfinding-contest-button').style.backgroundColor = '#6c757d';
        
        ReactDOM.render(<PathfindingContest />, document.getElementById('main-content'));

        //Github pages early deploy message
        setTimeout(() => {
            alert("Pathfinding page is still very incomplete. Selecting and drawing nodes on the graph is supported. Moving start and end nodes is supported. Reset Buttons Work. And only Dijkstra's algorithm is supported.");
        }, 200);
    }

    render() {
        return (
            <div id='algo-contest'>
                <div id='algo-contest-header'>
                    <a href="http://benshinnick.github.io/algorithm-contest" id='algo-contest-header-link'>AlgorithmContest</a>
                    <button id='sort-contest-button' onClick={() => this.changePageContentToSortContest()}>Sorting</button>
                    <button id='pathfinding-contest-button' onClick={() => this.changePageContentToPathfindingContest()}>Pathfinding</button>
                </div>
                <div id='main-content'></div>
            </div>
        );
    }
}