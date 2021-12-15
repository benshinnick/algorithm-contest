import React from 'react';
import {getInsertionSortAnimations} from './sortAlgorithms/InsertionSort.js';
import './css/SortVisualizer.css';

const ANIMATION_SPEED_MS = 0.25;
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
        let arrayCopy = this.state.array.map((x) => x);
        const animations = getInsertionSortAnimations(arrayCopy);

        for(let i = 0; i < animations.length; ++i) {
            const arrayBars = document.getElementsByClassName(`array-bar-${this.state.contestantNumber}`);
            const isComparison = animations.at(i).at(0) !== 's';

            if (isComparison) {
                if(animations.at(i).at(0) === 'c') {
                    setTimeout(() => {
                        const barOneIndex = animations.at(i).at(1);
                        const barTwoIndex = animations.at(i).at(2);
        
                        const barOneStyle = arrayBars[barOneIndex].style;
                        const barTwoStyle = arrayBars[barTwoIndex].style;

                        barOneStyle.backgroundColor = SECONDARY_COLOR;
                        barTwoStyle.backgroundColor = SECONDARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }
                else if(animations.at(i).at(0) === 'cf') {
                    setTimeout(() => {
                        const barOneIndex = animations.at(i).at(1);
                        const barTwoIndex = animations.at(i).at(2);
        
                        const barOneStyle = arrayBars[barOneIndex].style;
                        const barTwoStyle = arrayBars[barTwoIndex].style;

                        barOneStyle.backgroundColor = PRIMARY_COLOR;
                        barTwoStyle.backgroundColor = PRIMARY_COLOR;
                    }, i * ANIMATION_SPEED_MS);
                }

            } else {
                setTimeout(() => {
                    // console.log('swap time out');
                    const barOneIndex = animations.at(i).at(1);
                    const barTwoIndex = animations.at(i).at(2);

                    const barOneStyle = arrayBars[barOneIndex].style;
                    const barTwoStyle = arrayBars[barTwoIndex].style;

                    barOneStyle.height = `${animations.at(i).at(4)}px`;
                    barTwoStyle.height = `${animations.at(i).at(3)}px`;
                }, i * ANIMATION_SPEED_MS);

            }
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

                <button id="logvisualizerstatebutton" onClick={() => console.log(this.state)}>Log Sort Visualizer State</button>
                <button onClick={() => this.insertionSort()}>Test Insertion Sort</button>
            </div>
        );
    }
}