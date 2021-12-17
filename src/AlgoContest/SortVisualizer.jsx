import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import {getMergeSortAnimations} from './sortAlgorithms/MergeSort.js';
import './css/SortVisualizer.css';

const ANIMATION_SPEED_MS = 5;
const ANIMATION_DELAY_MS = 3000;
// main color of the array bars: dark blue
const PRIMARY_COLOR = '#292cff'; 
// color of array bars that are being compared
const SECONDARY_COLOR = 'red';

export default class SortVisualizer extends React.Component {

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
            return{
                array: props.array
            };
        }
        if(props.contestantNumber !== state.contestantNumber) {
            return{
                contestantNumber: props.contestantNumber
            }
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

    //next attempt: take each animation one step at a time and alternate between all algorithm's animations
    doNextMergeSortAnimationStep(animationStepInfo, currentStepNumber) {
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        const isComparison = animationStepInfo.at(0) !== 'o';

        const barOneIndex = animationStepInfo.at(1);
        const barOneStyle = arrayBars[barOneIndex].style;

        if (isComparison) {
            const barTwoIndex = animationStepInfo.at(2);
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if(animationStepInfo.at(0) === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
                return;
            }
            else if(animationStepInfo.at(0) === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
                return;
            }
        } else {
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo.at(2)}px`;
            }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
            return;
        }

    }

    quickSort() {
        // TODO
    }

    shellSort() {
        // TODO
    }

    //next attempt: take each animation one step at a time and alternate between all algorithm's animations
    doNextInsertionSortAnimationStep(animationStepInfo, currentStepNumber) {
        const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
        const isComparison = animationStepInfo.at(0) !== 's';

        const barOneIndex = animationStepInfo.at(1);
        const barTwoIndex = animationStepInfo.at(2);
        const barOneStyle = arrayBars[barOneIndex].style;
        const barTwoStyle = arrayBars[barTwoIndex].style;

        if (isComparison) {
            if(animationStepInfo.at(0) === 'c') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = SECONDARY_COLOR;
                    barTwoStyle.backgroundColor = SECONDARY_COLOR;
                }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
            }
            else if(animationStepInfo.at(0) === 'cf') {
                setTimeout(() => {
                    barOneStyle.backgroundColor = PRIMARY_COLOR;
                    barTwoStyle.backgroundColor = PRIMARY_COLOR;
                }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
            }
        } else {
            setTimeout(() => {
                barOneStyle.height = `${animationStepInfo.at(4)}px`;
                barTwoStyle.height = `${animationStepInfo.at(3)}px`;
            }, currentStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
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

    handleAlgorithmIsNowFinished(lastAnimationStepNumber) {
        setTimeout(() => {
            document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = '#c4ffe9';
        }, lastAnimationStepNumber * ANIMATION_SPEED_MS + ANIMATION_DELAY_MS);
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

                <button id="logvisualizerstatebutton" onClick={() => console.log(this.state)}>Log Sort Visualizer State</button>
                <button onClick={() => this.doSort()}>Test Sort</button>
            </div>
        );
    }
}