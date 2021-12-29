import React from 'react';
import './css/PathfindingVisualizerContestant.css';

export default class PathfindingVisualizerContestant extends React.Component {

    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.grid !== state.grid){
            return{ grid: props.grid };
        }
        return null;
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    algorithmDropDownButtonOnClick(algorithmType) {
        this.updateAlgorithmType(algorithmType);
    }

    render() {
        return (
            <div>
            <div className='pathfinding-visualizer-contestant' id={`pathfinding-visualizer-${this.state.contestantNumber}`}>
                <div className="path-dropdown">
                    <div id='path-algorithm-dropdown-label'>{this.state.algorithmType}<div className='dropdown-arrow'>▼</div></div>
                    <div className="path-dropdown-content">
                        {this.state.allAlgorithmTypes.map((algorithmType) => (
                        (algorithmType !== this.state.algorithmType) ?
                            <button
                                key={algorithmType}
                                className='path-algorithm-dropdown-button'
                                onClick={() => this.algorithmDropDownButtonOnClick(algorithmType)}
                            >{algorithmType}</button>
                            : null
                        ))}
                    </div>
                </div>
                    <div className='grid-container' id={`grid-container-${this.state.contestantNumber}`}>
                        {/* {this.state.array.map((value, index) => (
                        <div className={`array-bar-${this.state.contestantNumber}`}
                            key={`${index}-${this.contestantNumber}`}
                            style={{
                                backgroundColor: PRIMARY_COLOR,
                                height: `${value}px`,
                            }}></div>
                        ))} */}
                    </div>
                    {/* <button id='remove-button' className='remove' onClick={() => this.props.removeMe(this.state.contestantNumber)}>-</button> */}
                </div>
            </div>
        );
    }
}