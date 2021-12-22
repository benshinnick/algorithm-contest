import React from 'react';
import { getInsertionSortAnimations } from './sortAlgorithms/InsertionSort.js';
import { getMergeSortAnimations } from './sortAlgorithms/MergeSort.js';
import { getQuicksortAnimations } from './sortAlgorithms/Quicksort.js';
import { getBubbleSortAnimations } from './sortAlgorithms/BubbleSort.js';
import { getHeapSortAnimations } from './sortAlgorithms/HeapSort.js';
import './css/SortVisualizer.css';

// main color of the array bars: dark blue
const PRIMARY_COLOR = '#292cff'; 
// color of array bars that are being compared or swapped
const SECONDARY_COLOR = 'red';
// color of all the array bars once sorting has finished
const FINISHED_SORTING_COLOR = '#007bff';

const DEFAULT_BACKGROUND_COLOR = '#f7f7f7'; // light grey
const FINISHED_SORTING_BACKGROUND_COLOR = '#edfff2'; // light green

export default class SortVisualizer extends React.Component {

    static ANIMATION_SPEED_MS = 1;
    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            array: this.props.array,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber,
            numOfAnimationSteps: -1,
            numOfSwapsOrOverwrites: -1,
            numOfComparisons: -1
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.isContestStarting !== prevProps.isContestStarting) {
            if(this.props.isContestStarting === true) {
                this.doSort();
            }
            else {
                document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = '#f7f7f7';
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.array !== state.array){
            return{ array: props.array };
        }
        if(props.contestantNumber !== state.contestantNumber) {
            return{ contestantNumber: props.contestantNumber }
        }
        return null;
    }

    getSortAnimations() {
        let arrayCopy = this.state.array.map((value) => value);

        switch(this.state.algorithmType) {
            case 'merge':
                return getMergeSortAnimations(arrayCopy);
            case 'quick':
                return getQuicksortAnimations(arrayCopy);
            case 'shell':
                // return getShellSortAnimations(arrayCopy);
                break;
            case 'insertion':
                return getInsertionSortAnimations(arrayCopy);
            case 'heap':
                return getHeapSortAnimations(arrayCopy);
            case 'selection':
                // return getSelectionSortAnimations(arrayCopy);
                break;
            case 'bubble':
                return getBubbleSortAnimations(arrayCopy);
            default:
                console.log("Error: Unexpected Algorithm Type");
        }
    }

    doAnimationNextStep(animationStepInfo, currentStepNumber) {
        switch(this.state.algorithmType) {
            case 'merge':
                this.doNextMergeSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'quick':
                this.doNextQuicksortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'shell':
                this.doNextShellSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'insertion':
                this.doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'heap':
                this.doNextHeapSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'selection':
                this.doNextSelectionSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'bubble':
                this.doNextBubbleSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            default:
                console.log("Error: Unexpected Algorithm Type",);
        }
    }

    doNextMergeSortAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);

        const barOneIndex = animationStepInfo[1];
        const barOneStyle = arrayBars[barOneIndex].style;

        //comparison cases
        if (animationCode === 'c' || animationCode === 'cf') {
            const barTwoIndex = animationStepInfo[2];
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if(animationCode === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
                return;
            }
            else if(animationCode === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
                return;
            }
        }
        //overwrite cases
        else {
            if(animationCode === 'o') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationCode === 'of') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barOneStyle.height = `${animationStepInfo[2]}px`;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            return;
        }

    }

    doNextQuicksortAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);

        // swap cases
        if (animationCode === 's' || animationCode === 'sf') {
            const barOneIndex = animationStepInfo[1];
            const barOneStyle = arrayBars[barOneIndex].style;
            const barTwoIndex = animationStepInfo[2];
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if(animationCode === 's') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationCode === 'sf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    barOneStyle.height = `${animationStepInfo[4]}px`;
                    barTwoStyle.height = `${animationStepInfo[3]}px`;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        }
        // comparison cases
        else if(animationCode === 'c' || animationCode === 'cf'){
            if(animationStepInfo.length === 1) {
                return;
            }
            const barOneIndex = animationStepInfo[1];
            const barOneStyle = arrayBars[barOneIndex].style;

            if(animationCode === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationCode === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        }
        // pivot cases
        else {
            if(animationCode === 'p') {
                setTimeout(() => {
                    let pivotLine = document.createElement("HR");
                    let arrayContainer = document.getElementById(`array-container-${this.state.contestantNumber}`);
                    pivotLine.setAttribute("id", `pivot-line-${this.state.contestantNumber}`);
                    pivotLine.setAttribute("class", `pivot-line`);
                    pivotLine.style.width = `${((animationStepInfo[2] - animationStepInfo[1] + 1) * 4)-2}px`;
                    pivotLine.style.bottom = `${animationStepInfo[3] + 4}px`;
                    pivotLine.style.left = `${((animationStepInfo[1] + 1) * 4) + 2}px`;
                    arrayContainer.appendChild(pivotLine);
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
                return;
            }
            else if(animationCode === 'pf') {
                setTimeout(() => {
                    let pivotLine = document.getElementById(`pivot-line-${this.state.contestantNumber}`);
                    pivotLine.remove();
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        }
    }

    doNextShellSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        if(animationCode === 'sf') {
            return;
        }
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);

        const barOneIndex = animationStepInfo[1];
        const barTwoIndex = animationStepInfo[2];
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;

        // comparison cases
        if (animationCode === 'c' || animationCode === 'cf') {
            if(animationCode === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationCode === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        }
        // swap case
        else {
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo[4]}px`;
                barTwoStyle.height = `${animationStepInfo[3]}px`;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
    }

    doNextHeapSortAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);

        const barOneIndex = animationStepInfo[1];
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoIndex = animationStepInfo[2];
        const barTwoStyle = arrayBars[barTwoIndex].style;

        // comparison cases
        if(animationCode === 'c') {
            setTimeout(() => {
                barOneStyle.backgroundColor = SECONDARY_COLOR;
                barTwoStyle.backgroundColor = SECONDARY_COLOR;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
        else if(animationCode === 'cf') {
            setTimeout(() => {
                barOneStyle.backgroundColor = PRIMARY_COLOR;
                barTwoStyle.backgroundColor = PRIMARY_COLOR;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
        // swap cases
        else if(animationCode === 's') {
        setTimeout(() => {
                barOneStyle.backgroundColor = SECONDARY_COLOR;
                barTwoStyle.backgroundColor = SECONDARY_COLOR;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
        else if(animationCode === 'sf') {
            setTimeout(() => {
                barOneStyle.backgroundColor = PRIMARY_COLOR;
                barTwoStyle.backgroundColor = PRIMARY_COLOR;
                barOneStyle.height = `${animationStepInfo[4]}px`;
                barTwoStyle.height = `${animationStepInfo[3]}px`;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
    }

    doNextSelectionSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextBubbleSortAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        if(animationCode === 'sf') {
            return;
        }
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);

        const barOneIndex = animationStepInfo[1];
        const barTwoIndex = animationStepInfo[2];
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;

        // comparison cases
        if (animationCode === 'c' || animationCode === 'cf') {
            if(animationCode === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationCode === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        }
        // swap case
        else {
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo[4]}px`;
                barTwoStyle.height = `${animationStepInfo[3]}px`;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
    }

    resetVisualizationStyling() {
        document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        if(arrayBars[0].style.backgroundColor !== PRIMARY_COLOR) {
            for (var i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
            }
        }
    }

    scheduleAlgorithmIsNowFinishedCommands(lastAnimationStepNumber, algorithmPlace) {
        setTimeout(() => {
            this.handleAlgorithmIsNowFinished(algorithmPlace);
        }, lastAnimationStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
    }

    handleAlgorithmIsNowFinished(algorithmPlace) {
        this.createAlgorithmPlacelabel(algorithmPlace);
        document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = FINISHED_SORTING_BACKGROUND_COLOR;
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        for (var i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = FINISHED_SORTING_COLOR;
        }  
    }

    createAlgorithmPlacelabel(algorithmPlace) {
        let sortVisualizer = document.getElementById(`sort-visualizer-${this.state.contestantNumber}`);
        let placeLabel = document.createElement("DIV");
        placeLabel.setAttribute("id", `place-label-${this.state.contestantNumber}`);
        placeLabel.setAttribute("class", 'place-label');

        let placeLabelText;
        if(algorithmPlace === 1) {
            const GOLD = '#c7b620';
            placeLabel.style.backgroundColor = GOLD;
            placeLabelText = document.createTextNode('1st Place');
        }
        else if(algorithmPlace === 2) {
            const SILVER = '#929292';
            placeLabel.style.backgroundColor = SILVER;
            placeLabelText = document.createTextNode('2nd Place');
        }
        else if(algorithmPlace === 3) {
            const BRONZE = '#ab7627';
            placeLabel.style.backgroundColor = BRONZE;
            placeLabelText = document.createTextNode('3rd Place');
        }
        else {
            const DEFAULT = '#636363';
            placeLabel.style.backgroundColor = DEFAULT;
            placeLabelText = document.createTextNode(`${algorithmPlace}th Place`);
        }

        placeLabel.appendChild(placeLabelText);
        sortVisualizer.appendChild(placeLabel);
    }

    createAlgorithmStatsLabel() {
        let sortVisualizer = document.getElementById(`sort-visualizer-${this.state.contestantNumber}`);
        let statsLabel = document.createElement("DIV");
        statsLabel.setAttribute("id", `stats-label-${this.state.contestantNumber}`);
        statsLabel.setAttribute("class", 'stats-label');

        let placeLabelColor = document.getElementById(`place-label-${this.state.contestantNumber}`).style.backgroundColor;
        statsLabel.style.borderColor = placeLabelColor;

        let statsLabelText;
        let swapsOrOverwrites;
        if(this.state.algorithmType !== 'merge') {
            swapsOrOverwrites = 'swaps';
        }
        else {
            swapsOrOverwrites = 'overwrites';
        }
        if(window.innerWidth >= 700) {
            statsLabelText = document.createTextNode(
                `Final Stats: ${this.state.numOfComparisons} comparisons and ${this.state.numOfSwapsOrOverwrites} ${swapsOrOverwrites}`);
        }
        else {
            statsLabelText = document.createTextNode(
                `${this.state.numOfComparisons} comparisons and ${this.state.numOfSwapsOrOverwrites} ${swapsOrOverwrites}`);
        }
        
        statsLabel.appendChild(statsLabelText);
        sortVisualizer.appendChild(statsLabel);
    }

    destructAlgorithmPlaceLabel() {
        let placeLabel = document.getElementById(`place-label-${this.state.contestantNumber}`);
        if(placeLabel !== null) {
            placeLabel.remove();
        }
    }

    destructAlgorithmStatsLabel() {
        let statsLabel = document.getElementById(`stats-label-${this.state.contestantNumber}`);
        if(statsLabel !== null) {
            statsLabel.remove();
        }
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    setAllAlgorithmStatInfo(numOfAnimationSteps, numOfComparisons, numOfSwapsOrOverwrites) {
        this.setState({
            ...this.state,
            numOfAnimationSteps: numOfAnimationSteps,
            numOfComparisons: numOfComparisons,
            numOfSwapsOrOverwrites: numOfSwapsOrOverwrites
        });
    }

    getNumOfAnimationsSteps() {
        return this.state.numOfAnimationSteps;  
    }

    getNumOfComparisons() {
        return this.state.numOfComparisons;  
    }

    getNumOfSwapsOrOverwrites() {
        return this.state.numOfSwapsOrOverwrites;
    }

    resetArrayBarsToCorrectHeights() {
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        for (var i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.height = `${this.state.array[i]}px`;
        }
    }

    algorithmDropDownButtonOnClick(algorithmType) {
        this.destructAlgorithmPlaceLabel();
        this.destructAlgorithmStatsLabel();
        this.resetVisualizationStyling();
        this.updateAlgorithmType(algorithmType);
    }

    render() {
        return (
            <div className='sort-visualizer' id={`sort-visualizer-${this.state.contestantNumber}`}>

                <div className="dropdown">
                    <p id='algorithm-dropdown-label'>{this.state.algorithmType}</p>
                    <div className="dropdown-content">
                        {this.state.allAlgorithmTypes.map((algorithmType) => (
                        (algorithmType !== this.state.algorithmType) ?
                            <button
                                key={algorithmType}
                                className='algorithm-dropdown-button'
                                onClick={() => this.algorithmDropDownButtonOnClick(algorithmType)}
                            >{algorithmType}</button>
                            : null
                        ))}
                    </div>
                </div>

                <div className='array-container' id={`array-container-${this.state.contestantNumber}`}>
                    {this.state.array.map((value, index) => (
                    <div className={`array-bar-${this.state.contestantNumber}`}
                        key={`${index}-${this.contestantNumber}`}
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            height: `${value}px`,
                        }}></div>
                    ))}
                </div>

                {/* <button onClick={() => console.log(getHeapSortAnimations(this.state.array))}>Test HeapSort</button> */}
            </div>
        );
    }
}