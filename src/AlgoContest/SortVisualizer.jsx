import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import {getMergeSortAnimations} from './sortAlgorithms/MergeSort.js';
import './css/SortVisualizer.css';

const ANIMATION_SPEED_MS = 5;
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

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    doSort() {
        let arrayCopy = this.state.array.map((x) => x);
        let animations = [];

        switch(this.state.algorithmType) {
            case 'merge':
                animations = Promise.resolve(getMergeSortAnimations(arrayCopy));
                animations.then(animationData => {
                    console.log("Starting merge sort");
                    this.animateMergeSort(animationData);
                });
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
                    this.animateInsertionSort(animationData);
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

    async animateMergeSort(animations) {

        for(let i = 0; i < animations.length; ++i) {
            const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
            const isComparison = animations.at(i).at(0) !== 'o';

            const barOneIndex = animations.at(i).at(1);
            const barOneStyle = arrayBars[barOneIndex].style;

            if (isComparison) {
                const barTwoIndex = animations.at(i).at(2);
                const barTwoStyle = arrayBars[barTwoIndex].style;

                if(animations.at(i).at(0) === 'c') {
                    await setTimeout(() => {
                        barOneStyle.backgroundColor = SECONDARY_COLOR;
                        barTwoStyle.backgroundColor = SECONDARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
                else if(animations.at(i).at(0) === 'cf') {
                    await setTimeout(() => {
                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
            } else {
                await setTimeout(() => {
                    barOneStyle.height = `${animations.at(i).at(2)}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }  

        console.log("Finished Proccessing Merge Sort");
        setTimeout(() => {
            document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = '#c4ffe9';
        }, animations.length * ANIMATION_SPEED_MS);

        this.props.algorithmNowReady();
    }

    quickSort() {
        // TODO
    }

    shellSort() {
        // TODO
    }

    async animateInsertionSort(animations) {
        for(let i = 0; i < animations.length; ++i) {
            const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
            const isComparison = animations.at(i).at(0) !== 's';

            const barOneIndex = animations.at(i).at(1);
            const barTwoIndex = animations.at(i).at(2);
            const barOneStyle = arrayBars[barOneIndex].style;
            const barTwoStyle = arrayBars[barTwoIndex].style;

            if (isComparison) {
                if(animations.at(i).at(0) === 'c') {
                    await setTimeout(() => {
                        // await this.props.algorithmsReady();
                        barOneStyle.backgroundColor = SECONDARY_COLOR;
                        barTwoStyle.backgroundColor = SECONDARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
                else if(animations.at(i).at(0) === 'cf') {
                    await setTimeout(() => {
                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
            } else {
                await setTimeout(() => {
                    barOneStyle.height = `${animations.at(i).at(4)}px`;
                    barTwoStyle.height = `${animations.at(i).at(3)}px`;
                }, i * ANIMATION_SPEED_MS);
            }
        }
        console.log("Finished Proccessing Insertion Sort");
        setTimeout(() => {
            document.getElementById(`sort-visualizer-${this.state.contestantNumber}`).style.backgroundColor = '#c4ffe9';
        }, animations.length * ANIMATION_SPEED_MS);

        this.props.algorithmNowReady();
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