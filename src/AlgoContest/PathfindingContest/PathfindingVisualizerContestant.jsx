import React from 'react';
import './css/PathfindingVisualizerContestant.css';

// main color of the array bars: dark blue
const PRIMARY_COLOR = '#292cff';
// color of array bars that are being compared or swapped
const SECONDARY_COLOR = 'red';
// color of all the array bars once sorting has finished
const FINISHED_PATHFINDING_COLOR = '#007bff';

const DEFAULT_BACKGROUND_COLOR = '#f7f7f7'; // light grey
const FINISHED_PATHFINDING_BACKGROUND_COLOR = '#edfff2'; // light green

export default class PathfindingVisualizerContestant extends React.Component {

    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static getDerivedStateFromProps(props, state) {
        // if(props.array !== state.array){
        //     return{ array: props.array };
        // }
        // return null;
    }

    render() {
        return (
            <div>Pathfinding Visualizer</div>
            // <div className='sort-visualizer' id={`sort-visualizer-${this.state.contestantNumber}`}>
            //     <div className="dropdown">
            //         <div id='algorithm-dropdown-label'>{this.state.algorithmType}<div className='dropdown-arrow'>▼</div></div>
            //         <div className="dropdown-content">
            //             {this.state.allAlgorithmTypes.map((algorithmType) => (
            //             (algorithmType !== this.state.algorithmType) ?
            //                 <button
            //                     key={algorithmType}
            //                     className='algorithm-dropdown-button'
            //                     onClick={() => this.algorithmDropDownButtonOnClick(algorithmType)}
            //                 >{algorithmType}</button>
            //                 : null
            //             ))}
            //         </div>
            //     </div>
            //         <div className='array-container' id={`array-container-${this.state.contestantNumber}`}>
            //             {this.state.array.map((value, index) => (
            //             <div className={`array-bar-${this.state.contestantNumber}`}
            //                 key={`${index}-${this.contestantNumber}`}
            //                 style={{
            //                     backgroundColor: PRIMARY_COLOR,
            //                     height: `${value}px`,
            //                 }}></div>
            //             ))}
            //         </div>
            //         <button id='remove-button' className='remove' onClick={() => this.props.removeMe(this.state.contestantNumber)}>-</button>
            // </div>
        );
    }
}