import React from 'react';
import ReactDOM from 'react-dom';
import SortContest from './SortContest.jsx';
import GraphContest from './GraphContest.jsx';
import './css/AlgoContest.css';

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

        document.querySelector('#sortcontestbutton').style.backgroundColor = '#318fac';
        document.querySelector('#graphcontestbutton').style.backgroundColor = 'transparent';

        ReactDOM.render(<SortContest />, document.getElementById('maincontent'));
    }

    changePageContentToGraphContest() {
        this.setState({ algorithmType: 'graph' });

        document.querySelector('#sortcontestbutton').style.backgroundColor = 'transparent';
        document.querySelector('#graphcontestbutton').style.backgroundColor = '#318fac';
        
        ReactDOM.render(<GraphContest />, document.getElementById('maincontent'));
    }

    render() {
        return (
            <div id='algocontest'>
                <div id='algocontestheader'>
                    <a href="http://localhost:3000/">AlgoContest</a>
                    <button id='sortcontestbutton' onClick={() => this.changePageContentToSortContest()}>Comparison Sorting</button>
                    <button id='graphcontestbutton' onClick={() => this.changePageContentToGraphContest()}>Graph Search</button>
                </div>
                <div id='maincontent'></div>
            </div>
        );
    }
}