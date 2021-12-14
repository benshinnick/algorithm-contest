import React from 'react';
import SortVisualizer from './SortVisualizer.jsx';
import './SortContest.css';

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
                Sort Contest:
                <button id="logconteststatebutton" onClick={() => console.log(this.state)}>Log Sort Contest State</button>
                <button id="randomizebutton" onClick={() => this.randomizeArray()}>Randomize Array</button>
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