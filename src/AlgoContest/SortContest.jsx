import React from 'react';
import ReactDOM from 'react-dom';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 130;
const INITIAL_ARRAY_SIZE = 250;

export default class SortContest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            arraySize: INITIAL_ARRAY_SIZE,
            numOfContestants: 7,
            isContestStarting: false,
            numOfReadyContestants: 0,
            countdown: null,
        };
        this.algorithmNowReady = this.algorithmNowReady.bind(this);
        this.isAlgorithmsReady = this.isAlgorithmsReady.bind(this);
        this.child1 = React.createRef();
        this.child2 = React.createRef();
        this.child3 = React.createRef();
        this.child4 = React.createRef();
        this.child5 = React.createRef();
        this.child6 = React.createRef();
        this.child7 = React.createRef();
    }

    testReferences() {
        console.log('testing referneces');
        this.child1.current.doSort();
        this.child2.current.doSort();
        this.child3.current.doSort();
        this.child4.current.doSort();
        this.child5.current.doSort();
        this.child6.current.doSort();
        this.child7.current.doSort();
    }

    componentDidMount() {
        this.randomizeArray();
        ReactDOM.render(
            <>
                <button id="randomizebutton" onClick={() => this.randomizeArray()}>Generate Random Array</button>
                <button id="nearlysortedbutton" onClick={() => this.generateNearlySortedArray()}>Generate Nearly Sorted Array</button>
                <button id="logconteststatebutton" onClick={() => console.log(this.state)}>Log Sort Contest State</button>
                {/* <button>{this.state.countdown}</button> */}
                <button onClick={() => this.testReferences()}>Test References</button>
                <button id="startcontestbutton" onClick={() => this.startContest()}>Start</button>
            </>, document.getElementById('sortcontestheader'));
    }

    startContest() {
        this.setState({ ...this.state, isContestStarting: true }, () => this.setState({ ...this.state, isContestStarting: false }));
    }

    algorithmNowReady() {
        let newNumOfReadyContestants = this.state.numOfReadyContestants + 1;
        this.setState({ ...this.state, numOfReadyContestants: newNumOfReadyContestants });
        console.log(`Contestant ${newNumOfReadyContestants} is ready`);
    }

    isAlgorithmsReady() {
        return (this.state.numOfReadyContestants === this.state.numOfContestants);
    }

    randomizeArray() {
        let array = [];
        for (let i = 0; i < this.state.arraySize; ++i) {
            array.push(randomIntFromInterval(ARRAY_MIN_VALUE, ARRAY_MAX_VALUE));
        }
        this.setState({ ...this.state, array: array });
    }

    generateNearlySortedArray() {
        let numOfElements = 0;
        let array = [];

        //Simplify This Later
        for (let i = ARRAY_MIN_VALUE; i < ARRAY_MAX_VALUE; ++i) {
            array.push(i);
            if(numOfElements >= this.state.arraySize) {
                break;
            }
            array.push(i);
            numOfElements += 2;
            if(numOfElements >= this.state.arraySize) {
                break;
            }
        }
        for (let i = numOfElements; i < this.state.arraySize; ++i) {
            array.push(ARRAY_MAX_VALUE);
        }
        for(let i = 0; i < 5; ++i) {
            let randomIndex1 = Math.ceil(Math.random() * array.length - 1);
            let randomIndex2 = Math.ceil(Math.random() * array.length - 1);
            swap(array, randomIndex1, randomIndex2);
        }

        this.setState({ ...this.state, array: array });
    }

    render() {
        const algorithmTypes = ['merge', 'quick', 'shell', 'insertion',
                                'heap', 'selection', 'bubble']
        return (
            <div id='sortcontest'>
                <div id="sortcontestheader"></div>
                {/* <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="merge" algorithmTypes={algorithmTypes} contestantNumber={1} />
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="quick" algorithmTypes={algorithmTypes} contestantNumber={2}/>
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="insertion" algorithmTypes={algorithmTypes} contestantNumber={3}/>
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="shell" algorithmTypes={algorithmTypes} contestantNumber={4} />
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="heap" algorithmTypes={algorithmTypes} contestantNumber={5} />
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="selection" algorithmTypes={algorithmTypes} contestantNumber={6} />
                <SortVisualizer array={this.state.array} isContestStarting={this.state.isContestStarting} algorithmType="bubble" algorithmTypes={algorithmTypes} contestantNumber={7} /> */}

                <SortVisualizer 
                    ref={this.child1}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="merge"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={1}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.child2}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={2}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer
                    ref={this.child3}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={3}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.child4}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={4}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.child5}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={5}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.child6}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={6}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.child7}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={7}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
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
    array[index2] = temp;
}