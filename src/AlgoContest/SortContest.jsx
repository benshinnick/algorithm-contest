import React from 'react';
import ReactDOM from 'react-dom';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

export default class SortContest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: [],
            arraySize: 100
        };

    }

    componentDidMount() {
        this.randomizeArray();
        ReactDOM.render(
            <>
                <button id="randomizebutton" onClick={() => this.randomizeArray()}>Randomize Array</button>
                <button id="logconteststatebutton" onClick={() => console.log(this.state)}>Log Sort Contest State</button>
            </>, document.getElementById('sortcontestheader'));
    }

    randomizeArray() {
        let array = [];
        for (let i = 0; i < this.state.arraySize; ++i) {
            array.push(randomIntFromInterval(5, 100));
        }
        this.setState({ ...this.state, array: array });
    }

    render() {
        return (
            <div id='sortcontest'>
                <div id="sortcontestheader"></div>
                <SortVisualizer array={this.state.array} />
                <SortVisualizer array={this.state.array} />
                <SortVisualizer array={this.state.array} />
            </div>
        );
    }

}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}