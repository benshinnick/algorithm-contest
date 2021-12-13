import React from 'react';
import ReactDOM from 'react-dom';
import './AlgoContest.css';

export default class AlgoContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            algorithmType: ''
        };
    }

    componentDidMount() {
        ReactDOM.render(
            <div id='homemenu'>
                <button className='menubutton' onClick={() => this.changePageContentToSortContest()}>Sorting Contest</button>
                <button className='menubutton' onClick={() => this.changePageContentToGraphContest()}>Graph Contest</button>
                <button className='menubutton' onClick={() => this.changePageContentToProjectInfo()}>Project Info</button>
            </div>, document.getElementById('pagecontent'));
    }

    changePageContentToProjectInfo() {
        ReactDOM.render(<div>Project Where You Can Watch Algorithms Compete Against Each Other</div>, document.getElementById('pagecontent'));
    } 

    changePageContentToSortContest() {
        this.setState({ algorithmType: 'sort' });
        ReactDOM.render(<div>Sort</div>, document.getElementById('pagecontent'));
    }

    changePageContentToGraphContest() {
        this.setState({ algorithmType: 'graph' });
        ReactDOM.render(<div>Graph</div>, document.getElementById('pagecontent'));
    }

    render() {
        return (
            <div id='algocontest'>
                <div id='algocontestheader'><a href="http://localhost:3000/">AlgoContest</a></div>
                <div id='pagecontent'></div>
            </div>
        );
    }
}