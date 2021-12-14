import React from 'react';
import ReactDOM from 'react-dom';
import SortContest from './SortContest.jsx';
import GraphContest from './GraphContest.jsx';
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

        document.querySelector('#sortcontestbutton').style.backgroundColor = '#318fac';
        document.querySelector('#graphcontestbutton').style.backgroundColor = 'transparent';

        ReactDOM.render(<SortContest />, document.getElementById('pagecontent'));
    }

    changePageContentToGraphContest() {
        this.setState({ algorithmType: 'graph' });

        document.querySelector('#sortcontestbutton').style.backgroundColor = 'transparent';
        document.querySelector('#graphcontestbutton').style.backgroundColor = '#318fac';
        
        ReactDOM.render(<GraphContest />, document.getElementById('pagecontent'));
    }

    render() {
        return (
            <div id='algocontest'>
                <div id='algocontestheader'>
                    <a href="http://localhost:3000/">AlgoContest</a>
                    <button id='sortcontestbutton' onClick={() => this.changePageContentToSortContest()}>Sorting Contest</button>
                    <button id='graphcontestbutton' onClick={() => this.changePageContentToGraphContest()}>Graph Contest</button>
                </div>
                <div id='pagecontent'></div>
            </div>
        );
    }
}