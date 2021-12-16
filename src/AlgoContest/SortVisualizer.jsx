import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import './css/SortVisualizer.css';

const ANIMATION_SPEED_MS = 1;
// main color of the array bars
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
            isContestStarted: this.props.isContestStarted
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.isContestStarted !== prevProps.isContestStarted) {
            if(this.props.isContestStarted === true) {
                // console.log('starting sort')
                this.doSort();
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
        if(props.isContestStarted !== state.isContestStarted) {
            return {
                isContestStarted: props.isContestStarted
            }
        }
        return null;
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    doSort() {
        let arrayCopy = this.state.array.map((x) => x);
        let animations;

        switch(this.state.algorithmType) {
            case 'merge':
                this.mergeSort();
                break;
            case 'quick':
                this.quickSort();
                break;
            case 'shell':
                this.shellSort();
                break;
            case 'insertion':
                animations = Promise.resolve(getInsertionSortAnimations(arrayCopy));
                animations.then(animationData => {
                    console.log("Starting insertion sort");
                    this.insertionSort(animationData);
                });
                break;
            case 'heap':
                this.heapSort();
                break;
            case 'selection':
                this.selectionSort();
                break;
            case 'bubble':
                this.bubbleSort();
                break;
            default:
                console.log("Error: Unexpected Algorithm Type",);
        }
    }

    //Sort Algorithm Animation Rendering Functions

    mergeSort() {
        // TODO
    }

    quickSort() {
        // TODO
    }

    shellSort() {
        // TODO
    }

    insertionSort(animations) {

        for(let i = 0; i < animations.length; ++i) {
            const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
            const isComparison = animations.at(i).at(0) !== 's';

            const barOneIndex = animations.at(i).at(1);
            const barTwoIndex = animations.at(i).at(2);
            const barOneStyle = arrayBars[barOneIndex].style;
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if (isComparison) {
                if(animations.at(i).at(0) === 'c') {
                    setTimeout(() => {
                        barOneStyle.backgroundColor = SECONDARY_COLOR;
                        barTwoStyle.backgroundColor = SECONDARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
                else if(animations.at(i).at(0) === 'cf') {
                    setTimeout(() => {
                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
            } else {
                setTimeout(() => {
                    barOneStyle.height = `${animations.at(i).at(4)}px`;
                    barTwoStyle.height = `${animations.at(i).at(3)}px`;
                }, i * ANIMATION_SPEED_MS);

            }
        }
        console.log("Finished Proccessing Insertion Sort");
        setTimeout(() => {
            document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = '#c4ffe9';
        }, animations.length * ANIMATION_SPEED_MS);
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