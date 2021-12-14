import React from 'react';
import ReactDOM from 'react-dom';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 100;

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
                <button id="randomizebutton" onClick={() => this.randomizeArray()}>Generate Random Array</button>
                <button id="randomizebutton" onClick={() => this.generateNearlySortedArray()}>Generate Nearly Sorted Array</button>
                <button id="logconteststatebutton" onClick={() => console.log(this.state)}>Log Sort Contest State</button>
                <button id="startcontestbutton" onClick={() => this.startContest()}>Start</button>
            </>, document.getElementById('sortcontestheader'));
    }

    startContest() {
        console.log("Starting the contest");
    }

    generateNearlySortedArray() {
        let array = [];
        for (let i = ARRAY_MIN_VALUE; i < this.state.arraySize; ++i) {
            array.push(i);
        }
        for (let i = 0; i < ARRAY_MIN_VALUE; ++i) {
            array.push(ARRAY_MAX_VALUE);
            let randomIndex1 = Math.ceil(Math.random() * array.length);
            let randomIndex2 = Math.ceil(Math.random() * array.length);
            swap(array, randomIndex1, randomIndex2);
        }
        this.setState({ ...this.state, array: array });
    }

    randomizeArray() {
        let array = [];
        for (let i = 0; i < this.state.arraySize; ++i) {
            array.push(randomIntFromInterval(ARRAY_MIN_VALUE, ARRAY_MAX_VALUE));
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

function swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp
}