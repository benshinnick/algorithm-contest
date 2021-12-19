import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import {getMergeSortAnimations} from './sortAlgorithms/MergeSort.js';
import './css/SortVisualizer.css';

// main color of the array bars: dark blue
const PRIMARY_COLOR = '#292cff'; 
// color of array bars that are being compared
const SECONDARY_COLOR = 'red';
// color of all the array bars once sorting has finished
const FINISHED_SORTING_COLOR = '#007bff';

const DEFAULT_BACKGROUND_COLOR = '#f7f7f7'; // light grey
const FINISHED_SORTING_BACKGROUND_COLOR = '#edfff2'; // light green

export default class SortVisualizer extends React.Component {

    static ANIMATION_SPEED_MS = 2;
    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            array: this.props.array,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber
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
                // return getQuickSortAnimations(arrayCopy);
                break;
            case 'shell':
                // return getShellSortAnimations(arrayCopy);
                break;
            case 'insertion':
                return getInsertionSortAnimations(arrayCopy);
            case 'heap':
                // return getHeapSortAnimations(arrayCopy);
                break;
            case 'selection':
                // return getSelectionSortAnimations(arrayCopy);
                break;
            case 'bubble':
                // return getBubbleSortAnimations(arrayCopy);
                break;
            default:
                console.log("Error: Unexpected Algorithm Type",);
        }
    }

    doAnimationNextStep(animationStepInfo, currentStepNumber) {
        switch(this.state.algorithmType) {
            case 'merge':
                this.doNextMergeSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'quick':
                this.doNextQuickSortAnimationStep(animationStepInfo, currentStepNumber);
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
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        const isComparison = animationStepInfo[0] === 'c' || animationStepInfo[0] === 'cf';

        const barOneIndex = animationStepInfo[1];
        const barOneStyle = arrayBars[barOneIndex].style;

        if (isComparison) {
            const barTwoIndex = animationStepInfo[2];
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if(animationStepInfo[0] === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
                return;
            }
            else if(animationStepInfo[0] === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
                return;
            }
        } else {
            if(animationStepInfo[0] === 'o') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationStepInfo[0] === 'of') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barOneStyle.height = `${animationStepInfo[2]}px`;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            return;
        }

    }

    doNextQuickSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextShellSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber) {
        if(animationStepInfo[0] === 'sf') {
            return;
        }

        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        const isComparison = animationStepInfo[0] !== 's';

        const barOneIndex = animationStepInfo[1];
        const barTwoIndex = animationStepInfo[2];
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;

        if (isComparison) {
            if(animationStepInfo[0] === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
            else if(animationStepInfo[0] === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            }
        } else {
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo[4]}px`;
                barTwoStyle.height = `${animationStepInfo[3]}px`;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
        }
    }

    doNextHeapSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextSelectionSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
    }

    doNextBubbleSortAnimationStep(animationStepInfo, currentStepNumber) {
        // TODO
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

    scheduleAlgorithmIsNowFinishedCommands(lastAnimationStepNumber) {
        setTimeout(() => {
            this.handleAlgorithmIsNowFinishedStyling();
        }, lastAnimationStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
    }

    handleAlgorithmIsNowFinishedStyling() {
        document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = FINISHED_SORTING_BACKGROUND_COLOR;
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        for (var i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = FINISHED_SORTING_COLOR;
        }
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    setArrayBarsToSortedA(array) {
        this.setState({...this.state, array: array});
    }

    resetArrayBarsToCorrectHeights() {
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        for (var i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.height = `${this.state.array[i]}px`;
        }
    }

    render() {
        return (
            <div id={`sort-visualizer-${this.state.contestantNumber}`}>

                <div className="dropdown">
                    <p id='algorithm-dropdown-label'>{this.state.algorithmType}</p>
                    <div className="dropdown-content">
                        {this.state.allAlgorithmTypes.map((algorithmType) => (
                        (algorithmType !== this.state.algorithmType) ?
                            <button key={algorithmType} onClick={() => this.updateAlgorithmType(algorithmType)}>{algorithmType}</button>
                            : null
                        ))}
                    </div>
                </div>

                <div className="array-container">
                    {this.state.array.map((value, index) => (
                    <div className={`array-bar-${this.state.contestantNumber}`}
                        key={`${index}-${this.contestantNumber}`}
                        style={{
                            backgroundColor: PRIMARY_COLOR,
                            height: `${value}px`,
                        }}></div>
                    ))}
                </div>

                {/* <button id="logvisualizerstatebutton" onClick={() => console.log(this.state)}>Log Sort Visualizer State</button> */}
            </div>
        );
    }
}