import React from 'react';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 130;
const INITIAL_ARRAY_SIZE = 315;
const INITIAL_NUM_OF_CONTESTANTS = 7;

const COUNTDOWN_DURATION_MS = SortVisualizer.ANIMATION_DELAY_MS;

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
        this.disableDuringContestControlButtons();
        this.setInitialArraySize();
        window.addEventListener('resize', this.changeArrayWhenScreenResizes);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.changeArrayWhenScreenResizes);
    }

    startContest() {

        this.disablePreContestButtons();
        this.enableDuringContestControlButtons()
        this.startCountdown();

        const allContestantAnimationData = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantAnimationData[i] = this.algoContestantRefs[i].getSortAnimations();
        }

        let stepCounter = 0;
        let numOfFinishedContestants = 0;
        while(numOfFinishedContestants < this.state.numOfContestants) {
            for(let i = 0; i < this.state.numOfContestants; ++i) {
                if(stepCounter === allContestantAnimationData[i].length) {
                    numOfFinishedContestants++;
                    this.algoContestantRefs[i].scheduleAlgorithmIsNowFinishedCommands(stepCounter, numOfFinishedContestants);
                    continue;
                }
                else if(stepCounter > allContestantAnimationData[i].length) {
                    continue;
                }
                else {
                    this.algoContestantRefs[i].doAnimationNextStep(
                        allContestantAnimationData[i][stepCounter],
                        stepCounter
                    );
                }
            }
            stepCounter++;
        }

        this.scheduleContestFinishedCommands(allContestantAnimationData);
    }

    scheduleContestFinishedCommands(allContestantAnimationData) {
        const allContestantMaxAnimationSteps = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantMaxAnimationSteps.push(allContestantAnimationData[i].length);
        }

        const maxNumberOfAnimationSteps = Math.max(...allContestantMaxAnimationSteps);
        setTimeout(() => {
            this.handleContestIsNowFinished();
        }, maxNumberOfAnimationSteps * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
    }

    handleContestIsNowFinished() {
        this.enablePreContestSetupButtons();
        this.disableDuringContestControlButtons();
        const sortedArray = this.state.array.sort(function(a, b){return a - b});
        this.setState({ ...this.state, array: sortedArray });
    }

    startCountdown() {
        let numOfCountdownSeconds = COUNTDOWN_DURATION_MS / 1000;
        for(let i = 0; i < numOfCountdownSeconds; ++i) {
            setTimeout(() => {
                document.getElementById("startcontestbutton").innerHTML = `${numOfCountdownSeconds - i}`;
            }, i * 1000);
        }

        setTimeout(() => {
            document.getElementById("startcontestbutton").innerHTML = 'GO!';
        }, COUNTDOWN_DURATION_MS); 
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

    resetSortContestPage() {
        this.enablePreContestSetupButtons();
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].resetVisualizationStyling();
        }
    }

    disablePreContestButtons() {
        document.getElementById("startcontestbutton").disabled = true;
        document.getElementById("randomizebutton").disabled = true;
        document.getElementById("nearlysortedbutton").disabled = true;
    }

    enablePreContestSetupButtons() {
        document.getElementById("startcontestbutton").innerHTML = 'Start';
        document.getElementById("startcontestbutton").disabled = false;
        document.getElementById("randomizebutton").disabled = false;
        document.getElementById("nearlysortedbutton").disabled = false;
    }

    disableDuringContestControlButtons() {
        document.getElementById('skip-to-finish-button').disabled = true;
    }

    enableDuringContestControlButtons() {
        document.getElementById('skip-to-finish-button').disabled = false
    }

    skipToFinishButtonOnClick() {
        this.clearAllTimeouts();
        this.clearAllQuicksortPivotBars();
        this.handleContestIsNowFinished();
        this.disableDuringContestControlButtons();

        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].handleAlgorithmIsNowFinished();
            this.algoContestantRefs[i].resetArrayBarsToCorrectHeights();
        }
    }

    clearAllTimeouts() {
        // from https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
        // all timeout ids are consecutive integers, so this will clear all of the pending animation timeouts
        var id = setTimeout(function() {}, 0);
        while (id--) {
            clearTimeout(id);
        }
    }

    clearAllQuicksortPivotBars() {
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            let pivotLine = document.getElementById(`pivot-line-${i+1}`);
            if(pivotLine !== null) {
                pivotLine.remove();
            }
        }
    }

    genearateRandomArrayButtonOnClick() {
        this.enablePreContestSetupButtons();
        this.resetSortContestPage();
        this.randomizeArray();
    }

    genearateNearySortedArrayButtonOnClick() {
        this.enablePreContestSetupButtons();
        this.resetSortContestPage();
        this.generateNearlySortedArray()
    }

    startContestButtonOnClick() {
        this.enablePreContestSetupButtons();
        this.resetSortContestPage();
        this.startContest();
    }

    render() {
        const contestantNumbers = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            contestantNumbers.push(i+1);
        }

        return (
            <div className='sortcontest'>
                <div id="sortcontestheader">
                    <button id="startcontestbutton" onClick={() => this.startContestButtonOnClick()}>Start</button>
                    <button id="randomizebutton" onClick={() => this.genearateRandomArrayButtonOnClick()}>
                        Generate Random Array
                    </button>
                    <button id="nearlysortedbutton" onClick={() => this.genearateNearySortedArrayButtonOnClick()}>
                        Generate Nearly Sorted Array
                    </button>
                    {/* <button onClick={() => console.log(this.state)}>Log Sort Contest State</button> */}
                    <button id="skip-to-finish-button" onClick={() => this.skipToFinishButtonOnClick()}>Skip To Finish</button>
                </div>
                <div className='sort-visualizers'>
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


    changeArrayWhenScreenResizes = () => {
        const newArraySize = Math.floor((window.innerWidth - 30) / 4);
        this.setState({ ...this.state, arraySize: newArraySize });
        this.randomizeArray();
    }

    setInitialArraySize() {
        const newArraySize = Math.floor((window.innerWidth - 30) / 4);
        this.setState({ ...this.state, arraySize: newArraySize });
        this.randomizeArray();
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

// Referenced https://www.w3schools.com/howto/howto_js_sticky_header.asp
window.onscroll = function() {addOrRemoveStickyEffectOnSortContestHeader()};
function addOrRemoveStickyEffectOnSortContestHeader() {
    const SORT_CONTEST_HEADER_HEIGHT = 45;

    var header = document.getElementById("sortcontestheader");
    var sticky = SORT_CONTEST_HEADER_HEIGHT;

    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}