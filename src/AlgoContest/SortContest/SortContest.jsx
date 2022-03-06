import React from 'react';
import SortVisualizerContestant from './SortVisualizerContestant.jsx';
import './css/SortContest.css';

const ARRAY_MIN_VALUE = 5;
const ARRAY_MAX_VALUE = 130;
const INITIAL_NUM_OF_CONTESTANTS = 7;
const MAX_NUM_OF_CONTESTANTS = 10;
const COUNTDOWN_DURATION_MS = SortVisualizerContestant.ANIMATION_DELAY_MS;

const ALGORITHM_TYPES = [
    'Merge',
    'Quick',
    'Heap',
    'Shell',
    'Insertion',
    'Bubble',
    'Selection'
]

export default class SortContest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            array: [],
            numOfContestants: INITIAL_NUM_OF_CONTESTANTS,
            isPreContest: true,
            isRandomArray: true,
        };
        this.algoContestantRefs = [];
        this.removeContestant = this.removeContestant.bind(this);
    }

    setRef = (ref) => {
        this.algoContestantRefs.push(ref);
    };

    componentDidMount() {
        document.title = "Sorting Contest";
        this.removeExtraContestants();
        this.handlePageResize();
        this.disableDuringContestControlButtons();
        this.randomizeArray();
        window.addEventListener('resize', this.handlePageResize);
        window.addEventListener('scroll', this.addOrRemoveStickyEffectOnSortContestHeader);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.handlePageResize);
        window.removeEventListener('scroll', this.addOrRemoveStickyEffectOnSortContestHeader);
    }

    addContestant() {
        const newNumOfContestants = this.state.numOfContestants + 1;
        this.algoContestantRefs[this.state.numOfContestants].addComponent();
        this.algoContestantRefs[this.state.numOfContestants].updateAlgorithmType(ALGORITHM_TYPES[randomIntFromInterval(0,4)]);
        this.setState({...this.state, numOfContestants: newNumOfContestants}, () => {
            this.resetSortContestPage();
            this.enableRemoveContestantButtons();
        });
        if(newNumOfContestants === MAX_NUM_OF_CONTESTANTS) {
            document.getElementById('sort-add-contestant-button').disabled = true;
            document.getElementById('sort-add-contestant-button').innerText = 'MAX';
        }
        else {
            document.getElementById('sort-add-contestant-button').disabled = false;
            if(window.innerWidth <= 1195) {
                document.getElementById('sort-add-contestant-button').innerText = 'Add';
            }
            else {
                document.getElementById('sort-add-contestant-button').innerText = 'Add Contestant';
            }
        }
    }

    removeContestant(contestantNum) {
        //shift all algorithm types over then removes the last one
        for(let i = contestantNum - 1; i < this.state.numOfContestants - 1; ++i) {
            this.algoContestantRefs[i].updateAlgorithmType(this.algoContestantRefs[i+1].getAlgorithmType());
        }
        const newNumOfContestants = this.state.numOfContestants - 1;
        this.algoContestantRefs[this.state.numOfContestants - 1].removeComponent();
        this.setState({...this.state, numOfContestants: newNumOfContestants}, this.resetSortContestPage());
        // do remove animation
        let animationStandIn = document.createElement("DIV");
        animationStandIn.setAttribute("class", 'sort-remove-element-animation-stand-in');
        let sortVisualizerContestants = document.getElementById('sort-visualizers');
        let nextSortVisualizerContestant = document.getElementById(`sort-visualizer-${contestantNum}`);
        sortVisualizerContestants.insertBefore(animationStandIn, nextSortVisualizerContestant);
        setTimeout(() => {
            animationStandIn.remove();
        }, 800);
        if(newNumOfContestants === 2) {
            this.disableRemoveContestantButtons();
        }
        //renable the remove contestant since we know we do not have the maximum number of contestants
        document.getElementById('sort-add-contestant-button').disabled = false;
        if(window.innerWidth <= 1195) {
            document.getElementById('sort-add-contestant-button').innerText = 'Add';
        }
        else {
            document.getElementById('sort-add-contestant-button').innerText = 'Add Contestant';
        }
        
    }

    startContest() {
        this.disablePreContestButtons();
        this.enableDuringContestControlButtons()
        this.startCountdown();
        const allContestantAnimationData = this.getAllContestantAnimationDataAndSetAlgorithmStatInfo();
        this.runContestAnimations(allContestantAnimationData);
        this.scheduleContestFinishedCommands(allContestantAnimationData);
    }

    getAllContestantAnimationDataAndSetAlgorithmStatInfo() {
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
            this.algoContestantRefs[i].setAllAlgorithmStatInfo(allContestantAnimationData[i].length / 2, numOfComparisons, numOfSwapsOrOverwrites);
        }

        return allContestantAnimationData;
    }

    runContestAnimations(allContestantAnimationData) {
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
    }

    scheduleContestFinishedCommands(allContestantAnimationData) {
        const allContestantMaxAnimationSteps = [];
        for(let i = 0; i < this.state.numOfContestants; ++i) {
            allContestantMaxAnimationSteps.push(allContestantAnimationData[i].length);
        }

        const maxNumberOfAnimationSteps = Math.max(...allContestantMaxAnimationSteps);
        setTimeout(() => {
            this.handleContestIsNowFinished();
        }, maxNumberOfAnimationSteps * this.algoContestantRefs[0].getAnimationSpeed() + SortVisualizerContestant.ANIMATION_DELAY_MS);
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
                document.getElementById("sort-start-contest-button").innerHTML = `${numOfCountdownSeconds - i}`;
            }, i * 1000);
        }

        setTimeout(() => {
            document.getElementById("sort-start-contest-button").innerHTML = 'GO!';
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
        let numOfRepeatNumbers;
        if(fullPageWidthArraySize < ARRAY_MAX_VALUE) {
            numOfRepeatNumbers = 1;
        }
        else if(fullPageWidthArraySize < ARRAY_MAX_VALUE*2) {
            numOfRepeatNumbers = 2;
        }
        else {
            numOfRepeatNumbers = 3;
        }

        for (let i = ARRAY_MIN_VALUE; i < ARRAY_MAX_VALUE; ++i) {
            for(let j = 0; j < numOfRepeatNumbers; ++j) {
                array.push(i);
                numOfElements++;
                if(numOfElements >= fullPageWidthArraySize - 1) {
                    break;
                }
            }
            if(numOfElements >= fullPageWidthArraySize - 1) {
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
        document.getElementById("sort-start-contest-button").disabled = true;
        document.getElementById("randomize-button").disabled = true;
        document.getElementById("nearly-sorted-button").disabled = true;
        document.getElementById('sort-add-contestant-button').disabled = true;

        const algorithmDropDownButtons = document.getElementsByClassName('algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = true;
        }
        const algorithmDropDownArrows = document.getElementsByClassName('dropdown-arrow');
        for(let i = 0; i < algorithmDropDownArrows.length; ++i) {
            algorithmDropDownArrows[i].style.visibility = 'hidden';
        }
        this.disableRemoveContestantButtons();
    }

    enablePreContestSetupButtons() {
        document.getElementById("sort-start-contest-button").innerHTML = 'Start';
        document.getElementById("sort-start-contest-button").disabled = false;
        document.getElementById("randomize-button").disabled = false;
        document.getElementById("nearly-sorted-button").disabled = false;
        if(this.state.numOfContestants < MAX_NUM_OF_CONTESTANTS) {
            document.getElementById('sort-add-contestant-button').disabled = false;
        }

        const algorithmDropDownButtons = document.getElementsByClassName('algorithm-dropdown-button');
        for(let i = 0; i < algorithmDropDownButtons.length; ++i) {
            algorithmDropDownButtons[i].disabled = false;
        }
        const algorithmDropDownArrows = document.getElementsByClassName('dropdown-arrow');
        for(let i = 0; i < algorithmDropDownArrows.length; ++i) {
            algorithmDropDownArrows[i].style.visibility = 'visible';
        }
    }

    disableDuringContestControlButtons() {
        document.getElementById('sort-skip-to-finish-button').disabled = true;
    }

    enableDuringContestControlButtons() {
        document.getElementById('sort-skip-to-finish-button').disabled = false
    }

    disableRemoveContestantButtons() {
        const removeAlgorithmButtons = document.getElementsByClassName('sort-remove-button');
        for(let i = 0; i < removeAlgorithmButtons.length; ++i) {
            removeAlgorithmButtons[i].disabled = true;
        }
    }

    enableRemoveContestantButtons() {
        if(this.state.numOfContestants > 2) {
            const removeAlgorithmButtons = document.getElementsByClassName('sort-remove-button');
            for(let i = 0; i < removeAlgorithmButtons.length; ++i) {
                removeAlgorithmButtons[i].disabled = false;
            }
        }
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

    removeExtraContestants() {
        for(let i = INITIAL_NUM_OF_CONTESTANTS; i < MAX_NUM_OF_CONTESTANTS; ++i) {
            this.algoContestantRefs[i].removeComponent();
        }
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
        this.setState({ ...this.state,
            isPreContest: true,
            isRandomArray: true }, () => {
            this.enablePreContestSetupButtons();
            this.resetSortContestPage();
            this.randomizeArray();
            this.enableRemoveContestantButtons();
        });
    }

    genearateNearySortedArrayButtonOnClick() {
        this.setState({ ...this.state,
            isPreContest: true,
            isRandomArray: false }, () => {
            this.enablePreContestSetupButtons();
            this.resetSortContestPage();
            this.generateNearlySortedArray();
            this.enableRemoveContestantButtons();
        });
    }

    startContestButtonOnClick() {
        this.resetSortContestPage();
        this.startContest();
        this.setState({ ...this.state, isPreContest: false });
    }

    addContestantOnClick() {
        this.addContestant();
    }

    getFullPageWidthArraySize() {
        const initialArraySize = Math.floor((window.innerWidth - 22) / 4);
        return initialArraySize;
    }

    handlePageResize = () => {
        if(this.getFullPageWidthArraySize() !== this.state.array.length) {
            if(this.state.isPreContest === true) {
                if(this.state.isRandomArray === true) {
                    this.randomizeArray();
                }
                else {
                    this.generateNearlySortedArray();
                }
            }
        }

        let windowWidthSize = window.innerWidth;
        if(windowWidthSize <= 1195) {
            document.querySelector('#randomize-button').textContent = 'Randomize';
            document.querySelector('#nearly-sorted-button').textContent = 'Nearly Sorted';
            if(this.state.numOfContestants < MAX_NUM_OF_CONTESTANTS) {
                document.querySelector('#sort-add-contestant-button').textContent = 'Add';
            }
        }
        else {
            document.querySelector('#randomize-button').textContent = 'Generate Random Array';
            document.querySelector('#nearly-sorted-button').textContent = 'Generate Nearly Sorted Array';
            if(this.state.numOfContestants < MAX_NUM_OF_CONTESTANTS) {
                document.querySelector('#sort-add-contestant-button').textContent = 'Add Contestant';
            }
        }
        
        if(windowWidthSize <= 700) {
            document.querySelector('#algo-contest-header-link').textContent = 'AlgoContest';
        }
        else {
            document.querySelector('#algo-contest-header-link').textContent = 'AlgorithmContest';
        }

        let animationSpeedMS;
        if(windowWidthSize < 420) {
            animationSpeedMS = 5;
        }
        else if(windowWidthSize < 600) {
            animationSpeedMS = 4;
        }
        else if(windowWidthSize < 800) {
            animationSpeedMS = 3;
        }
        else if(windowWidthSize < 1200) {
            animationSpeedMS = 1.5;
        }
        else {
            animationSpeedMS = 1;
        }
        for(let i = 0; i < MAX_NUM_OF_CONTESTANTS; ++i) {
            this.algoContestantRefs[i].setAnimationSpeed(animationSpeedMS);
        }
    }

    // Referenced https://www.w3schools.com/howto/howto_js_sticky_header.asp
    addOrRemoveStickyEffectOnSortContestHeader = () => {
        let header = document.getElementById("sort-contest-header");
        let sticky = 45; //initial header.offsetTop();
        if(window.innerWidth <= 480) {
            sticky = 40; //initial header.offsetTop()
        }

        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }

    render() {
        const ContestantNumbers = [];
        for(let i = 0; i < MAX_NUM_OF_CONTESTANTS; ++i) {
            ContestantNumbers.push(i+1);
        }

        return (
            <div className='sort-contest'>
                <div id="sort-contest-header">
                    <button id="randomize-button" onClick={() => this.genearateRandomArrayButtonOnClick()}>
                        Generate Random Array
                    </button>
                    <button id="nearly-sorted-button" onClick={() => this.genearateNearySortedArrayButtonOnClick()}>
                        Generate Nearly Sorted Array
                    </button>
                    <button id='sort-add-contestant-button' onClick={() => this.addContestantOnClick()}>Add Contestant</button>
                    <div id="sort-num-of-contestants-label">
                        {this.state.numOfContestants} Contestants
                    </div>
                    <button id="sort-start-contest-button" onClick={() => this.startContestButtonOnClick()}>Start</button>
                    <button id="sort-skip-to-finish-button" onClick={() => this.skipToFinishButtonOnClick()}>Skip To Finish</button>
                </div>
                <div className='sort-visualizers' id='sort-visualizers'>
                    {ContestantNumbers.map(contestantNum => (
                        <SortVisualizerContestant 
                            key={contestantNum}
                            ref={this.setRef}
                            array={this.state.array}
                            algorithmType={ALGORITHM_TYPES[(contestantNum - 1) % ALGORITHM_TYPES.length]}
                            algorithmTypes={ALGORITHM_TYPES}
                            contestantNumber={contestantNum}
                            removeMe={this.removeContestant}
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