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

        this.contestant1 = React.createRef();
        this.contestant2 = React.createRef();
        this.contestant3 = React.createRef();
        this.contestant4 = React.createRef();
        this.contestant5 = React.createRef();
        this.contestant6 = React.createRef();
        this.contestant7 = React.createRef();
    }

    testReferences() {
        console.log('testing referneces');
        this.contestant1.current.doSort();
        this.contestant2.current.doSort();
        this.contestant3.current.doSort();
        this.contestant4.current.doSort();
        this.contestant5.current.doSort();
        this.contestant6.current.doSort();
        this.contestant7.current.doSort();
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
        // this.setState({ ...this.state, isContestStarting: true }, () => this.setState({ ...this.state, isContestStarting: false }));
        console.log('starting contest');
        let contestants = [
            this.contestant1.current,
            this.contestant2.current,
            // this.contestant3.current,
            // this.contestant4.current,
            // this.contestant5.current,
            // this.contestant6.current,
            // this.contestant7.current
        ]

        let allContestantAnimationData = [];
        for(let i = 0; i < contestants.length; ++i) {
            allContestantAnimationData[i] = contestants[i].getSortAnimations();
        }

        let contestIsOver = false;
        let stepCounter = 0;
        while(!contestIsOver) {
            for(let i = 0; i < contestants.length; ++i) {
                if(stepCounter >= allContestantAnimationData.at(i).length) {
                    contestIsOver = true;
                    break;
                }
                contestants[i].doAnimationNextStep(allContestantAnimationData.at(i).at(stepCounter), stepCounter);
            }
            stepCounter++;
        }
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

                {/* Feels too hard coded, will try to refactor later */}

                <SortVisualizer 
                    ref={this.contestant1}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="merge"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={1}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.contestant2}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={2}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                {/* <SortVisualizer
                    ref={this.contestant3}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={3}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.contestant4}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={4}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.contestant5}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={5}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.contestant6}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={6}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                />
                <SortVisualizer 
                    ref={this.contestant7}
                    array={this.state.array}
                    isContestStarting={this.state.isContestStarting}
                    algorithmType="insertion"
                    algorithmTypes={algorithmTypes}
                    contestantNumber={7}
                    algorithmNowReady={this.algorithmNowReady}
                    isAlgorithmsReady={this.isAlgorithmsReady}
                /> */}
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