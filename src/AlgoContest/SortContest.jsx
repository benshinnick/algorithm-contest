import React from 'react';
import SortVisualizer from './SortVisualizer.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 130;
const INITIAL_NUM_OF_CONTESTANTS = 4;

const COUNTDOWN_DURATION_MS = SortVisualizer.ANIMATION_DELAY_MS;

const ALGORITHM_TYPES = [
    'merge',
    'quick',
    'insertion',
    'bubble',
    'shell',
    'heap',
    'selection'
]

export default class SortContest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS,
            isPreContest: true
        };
        this.algoContestantRefs = [];
    }

    setRef = (ref) => {
        this.algoContestantRefs.push(ref);
    };

    componentDidMount() {
        this.disableDuringContestControlButtons();
        this.randomizeArray();
        window.addEventListener('resize', this.updateArrayWhenPageResizes);
        window.addEventListener('scroll', this.addOrRemoveStickyEffectOnSortContestHeader);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateArrayWhenPageResizes);
        window.addEventListener('scroll', this.addOrRemoveStickyEffectOnSortContestHeader);
    }

    startContest() {
        this.disablePreContestButtons();
        this.enableDuringContestControlButtons()
        this.startCountdown();

        const allContestantAnimationData = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantAnimationData[i] = this.algoContestantRefs[i].getSortAnimations();
            let numOfComparisons = 0;
            let numOfSwapsOrOverwrites = 0;
            for(let j = 0; j < allContestantAnimationData[i].length; ++j){
                let animationCode = allContestantAnimationData[i][j][0];
                if(animationCode === 'c') {
                    numOfComparisons++;
                }
                else if(animationCode === 's' || animationCode === 'o') {
                    numOfSwapsOrOverwrites++;
                }
            }
            // console.log(`contestant ${i+1} number of comparisons is ${numOfComparisons}`);
            // console.log(`contestant ${i+1} number of swaps or overwrites is ${numOfSwapsOrOverwrites}`);
            // this.algoContestantRefs[i].setNumOfAnimationsSteps(allContestantAnimationData[i].length / 2);
            this.algoContestantRefs[i].setAllAlgorithmStatInfo(allContestantAnimationData[i].length / 2, numOfComparisons, numOfSwapsOrOverwrites);
            // this.algoContestantRefs[i].setNumOfComparisons(numOfComparisons);
            // this.algoContestantRefs[i].setNumOfSwapsOrOverwrites(numOfSwapsOrOverwrites);
        }

        let stepCounter = 0;
        let numOfFinishedContestants = 0;
        let placeNumber = 0;
        while(numOfFinishedContestants < this.state.numOfContestants) {
            let hasContestantFinishedThisStep = false;
            for(let i = 0; i < this.state.numOfContestants; ++i) {
                if(stepCounter > allContestantAnimationData[i].length) {
                    continue;
                }
                else if(stepCounter === allContestantAnimationData[i].length) {
                    numOfFinishedContestants++;
                    if(hasContestantFinishedThisStep === false) {
                        placeNumber++;
                        hasContestantFinishedThisStep = true;
                        this.algoContestantRefs[i].scheduleAlgorithmIsNowFinishedCommands(stepCounter, placeNumber);
                    }
                    else {
                        this.algoContestantRefs[i].scheduleAlgorithmIsNowFinishedCommands(stepCounter, placeNumber);
                    }
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

        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].createAlgorithmStatsLabel();
            this.algoContestantRefs[i].setAllAlgorithmStatInfo(-1, -1, -1);
        }
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
        let fullPageWidthArraySize = this.getFullPageWidthArraySize();
        for (let i = 0; i < fullPageWidthArraySize; ++i) {
            array.push(randomIntFromInterval(ARRAY_MIN_VALUE, ARRAY_MAX_VALUE));
        }
        this.setState({ ...this.state, array: array });
    }

    generateNearlySortedArray() {
        let numOfElements = 0;
        let array = [];
        let fullPageWidthArraySize = this.getFullPageWidthArraySize();

        for (let i = ARRAY_MIN_VALUE; i < ARRAY_MAX_VALUE; ++i) {
            array.push(i);
            if(numOfElements >= fullPageWidthArraySize) {
                break;
            }
            array.push(i);
            numOfElements += 2;
            if(numOfElements >= fullPageWidthArraySize) {
                break;
            }
        }
        for (let i = numOfElements; i < fullPageWidthArraySize; ++i) {
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
        this.clearAllAlgorithmStatsAndPlaceLabels();
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].resetVisualizationStyling();
        }
    }

    disablePreContestButtons() {
        document.getElementById("startcontestbutton").disabled = true;
        document.getElementById("randomizebutton").disabled = true;
        document.getElementById("nearlysortedbutton").disabled = true;

        const algorithmDropDownButtons = document.getElementsByClassName('algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = true;
        }
    }

    enablePreContestSetupButtons() {
        document.getElementById("startcontestbutton").innerHTML = 'Start';
        document.getElementById("startcontestbutton").disabled = false;
        document.getElementById("randomizebutton").disabled = false;
        document.getElementById("nearlysortedbutton").disabled = false;

        const algorithmDropDownButtons = document.getElementsByClassName('algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = false;
        }
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
        this.disableDuringContestControlButtons();
        this.clearAllAlgorithmStatsAndPlaceLabels();

        let allContestantPlaceInfo = this.findAllPlaceInformation();

        for(let i = 0; i < this.state.numOfContestants; ++i) {
            const algorithmPlace = allContestantPlaceInfo[i][2];
            this.algoContestantRefs[i].handleAlgorithmIsNowFinished(algorithmPlace);
            this.algoContestantRefs[i].resetArrayBarsToCorrectHeights();
        }
        this.handleContestIsNowFinished();
    }

    findAllPlaceInformation() {

        const allContestantPlaceInfo = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            const contestantNum = i+1;
            const numOfSteps = this.algoContestantRefs[i].getNumOfAnimationsSteps();
            allContestantPlaceInfo.push([contestantNum, numOfSteps]);
        }

        //sort by number of animation steps to get the list in order of place
        allContestantPlaceInfo.sort(function(a,b) {
            return a[1]-b[1]
        });

        for(let i = 0; i < this.state.numOfContestants; ++i) {
            if(i > 0) {
                if(allContestantPlaceInfo[i][1] === allContestantPlaceInfo[i-1][1]) {
                    let placeNumber = allContestantPlaceInfo[i-1][2];
                    allContestantPlaceInfo[i][2] = placeNumber;
                }
                else {
                    let placeNumber = allContestantPlaceInfo[i-1][2] + 1;
                    allContestantPlaceInfo[i][2] = placeNumber;
                }
            }
            else {
                let placeNumber = 1;
                allContestantPlaceInfo[i][2] = placeNumber;
            }
        }

        //sort by contestant number to get the list in the correct order
        allContestantPlaceInfo.sort(function(a,b) {
            return a[0]-b[0]
        });
        
        //final format [contestant number, number of animation steps, place achieved]
        return allContestantPlaceInfo;
    }

    clearAllAlgorithmStatsAndPlaceLabels() {
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            this.algoContestantRefs[i].destructAlgorithmPlaceLabel();
            this.algoContestantRefs[i].destructAlgorithmStatsLabel();
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
        this.setState({ ...this.state, isPreContest: true }, () => {
            this.enablePreContestSetupButtons();
            this.resetSortContestPage();
            this.randomizeArray();
        });
    }

    genearateNearySortedArrayButtonOnClick() {
        this.setState({ ...this.state, isPreContest: true }, () => {
            this.enablePreContestSetupButtons();
            this.resetSortContestPage();
            this.generateNearlySortedArray();
        });
    }

    startContestButtonOnClick() {
        this.enablePreContestSetupButtons();
        this.resetSortContestPage();
        this.startContest();
        this.setState({ ...this.state, isPreContest: false });
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

    updateArrayWhenPageResizes = () => {
        if(this.state.isPreContest === true) {
            this.randomizeArray();
        }
    }

    getFullPageWidthArraySize() {
        const initialArraySize = Math.floor((window.innerWidth - 14) / 4);
        return initialArraySize;
    }

    // Referenced https://www.w3schools.com/howto/howto_js_sticky_header.asp
    addOrRemoveStickyEffectOnSortContestHeader = () => {
        let header = document.getElementById("sortcontestheader");
        let sticky = header.offsetHeight;

        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
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