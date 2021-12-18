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

    static ANIMATION_SPEED_MS = 5;
    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            array: this.props.array,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber,
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
                // doNextQuickSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'shell':
                // doNextShellSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'insertion':
                this.doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'heap':
                // doNextHeapSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'selection':
                // doNextSelectionSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'bubble':
                // doNextBubbleSortAnimationStep(animationStepInfo, currentStepNumber);
                break;
            default:
                console.log("Error: Unexpected Algorithm Type",);
        }
    }

    doNextMergeSortAnimationStep(animationStepInfo, currentStepNumber) {
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        const isComparison = animationStepInfo[0] !== 'o';

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
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo[2]}px`;
            }, currentStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
            return;
        }

    }

    quickSort() {
        // TODO
    }

    shellSort() {
        // TODO
    }

    async doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber) {
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

    heapSort() {
        // TODO
    }

    selectionSort() {
        // TODO
    }

    bubbleSort() {
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

    handleAlgorithmIsNowFinished(lastAnimationStepNumber) {
        setTimeout(() => {
            document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = FINISHED_SORTING_BACKGROUND_COLOR;
            const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
            for (var i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.backgroundColor = FINISHED_SORTING_COLOR;
            }
        }, lastAnimationStepNumber * SortVisualizer.ANIMATION_SPEED_MS + SortVisualizer.ANIMATION_DELAY_MS);
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
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