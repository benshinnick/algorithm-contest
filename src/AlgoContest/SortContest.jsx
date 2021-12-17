import React from 'react';
import ReactDOM from 'react-dom';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 130;
const INITIAL_ARRAY_SIZE = 250;
const INITIAL_NUM_OF_CONTESTANTS = 3;

const ALGORITHM_TYPES = [
    'merge',
    'insertion',
    'quick',
    'shell',
    'heap',
    'selection',
    'bubble'
]

export default class SortContest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            arraySize: INITIAL_ARRAY_SIZE,
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS
        };
        this.algoContestantRefs = [];
    }

    setRef = (ref) => {
        this.algoContestantRefs.push(ref);
    };

    componentDidMount() {
        this.randomizeArray();
    }

    startContest() {
        console.log('starting contest');

        //console countdown timer
        let numOfCountdownSeconds = 3;
        for(let i = 0; i < numOfCountdownSeconds; ++i) {
            setTimeout(() => {
                console.log(numOfCountdownSeconds - i);
            }, i * 1000);
        }

        const allContestantAnimationData = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantAnimationData[i] = this.algoContestantRefs[i].getSortAnimations();
        }

        console.log('got all animation data');

        let stepCounter = 0;
        let numOfFinishedContestants = 0;
        while(numOfFinishedContestants < this.state.numOfContestants) {
            for(let i = 0; i < this.state.numOfContestants; ++i) {
                if(stepCounter === allContestantAnimationData.at(i).length) {
                    numOfFinishedContestants++;
                    this.algoContestantRefs[i].handleAlgorithmIsNowFinished(stepCounter);
                    continue;
                }
                else if(stepCounter > allContestantAnimationData.at(i).length) {
                    continue;
                }
                else {
                    this.algoContestantRefs[i].doAnimationNextStep(allContestantAnimationData.at(i).at(stepCounter), stepCounter);
                }
            }
            stepCounter++;
        }

        console.log('finishing contest');
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

    resetAlgorithmVisualizationStyling() {
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].resetVisualizationStyling();
        }
    }

    genearateRandomArrayButtonOnClick() {
        this.resetAlgorithmVisualizationStyling();
        this.randomizeArray();
    }

    genearateNearySortedArrayButtonOnClick() {
        this.resetAlgorithmVisualizationStyling();
        this.generateNearlySortedArray()
    }

    startContestButtonOnClick() {
        this.resetAlgorithmVisualizationStyling();
        this.startContest();
    }

    render() {
        const contestantNumbers = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            contestantNumbers.push(i+1);
        }

        return (
            <div id='sortcontest'>
                <div id="sortcontestheader">
                    <button id="randomizebutton" onClick={() => this.genearateRandomArrayButtonOnClick()}>Generate Random Array</button>
                    <button id="nearlysortedbutton" onClick={() => this.genearateNearySortedArrayButtonOnClick()}>Generate Nearly Sorted Array</button>
                    {/* <button id="logconteststatebutton" onClick={() => console.log(this.state)}>Log Sort Contest State</button> */}
                    {/* some sort of countdown marker */}
                    <button id="startcontestbutton" onClick={() => this.startContestButtonOnClick()}>Start</button>
                </div>

                <div id='sort-visualizers'>
                    {contestantNumbers.map(contestantNum => (
                        <SortVisualizer 
                            key={contestantNum}
                            ref={this.setRef}
                            array={this.state.array}
                            algorithmType={ALGORITHM_TYPES[contestantNum - 1]}
                            algorithmTypes={ALGORITHM_TYPES}
                            contestantNumber={contestantNum}
                        />
                    ))}
                </div>

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