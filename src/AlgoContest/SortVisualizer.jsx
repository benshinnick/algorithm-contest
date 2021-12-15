import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import './css/SortVisualizer.css';

const ANIMATION_SPEED_MS = 1000;
// This is the main color of the array bars
const PRIMARY_COLOR = '#292cff';
// This is the color of array bars that are being compared throughout the animations
const SECONDARY_COLOR = 'red';

export default class SortVisualizer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            array: this.props.array,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber
        };
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

    insertionSort() {
        // const animations = getInsertionSortAnimations(this.state.array);
        // // console.log(animations.length);

        // for(let i = 0; i < animations.length; ++i) {
        //     const arrayBars = document.getElementsByClassName('array-bar');
        //     const isComparison = animations.at(i).at(0) === 'comparison';

        //     if (isComparison) {
        //         const barOneIndex = animations.at(i).at(1);
        //         const barTwoIndex = animations.at(i).at(2);

        //         const barOneStyle = arrayBars[barOneIndex].style;
        //         const barTwoStyle = arrayBars[barTwoIndex].style;

        //         setTimeout(() => {
        //             barOneStyle.backgroundColor = SECONDARY_COLOR;
        //             barTwoStyle.backgroundColor = SECONDARY_COLOR;
        //         }, ANIMATION_SPEED_MS);

        //         barOneStyle.backgroundColor = PRIMARY_COLOR;
        //         barTwoStyle.backgroundColor = PRIMARY_COLOR;
        //     } else {
        //         setTimeout(() => {
        //             const barOneIndex = animations.at(i).at(1);
        //             const barTwoIndex = animations.at(i).at(2);

        //             const barOneStyle = arrayBars[barOneIndex].style;
        //             const barTwoStyle = arrayBars[barTwoIndex].style;

        //             barOneStyle.height = `${animations.at(i).at(4)}px`;
        //             barTwoStyle.height = `${animations.at(i).at(5)}px`;
        //         }, ANIMATION_SPEED_MS);
        //     }
        // }
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
                <button onClick={() => this.insertionSort()}>Test Insertion Sort</button>
            </div>
        );
    }
}