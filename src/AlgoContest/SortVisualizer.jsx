import React from 'react';
// import ReactDOM from 'react-dom';
import './css/SortVisualizer.css';

// This is the main color of the array bars.
const PRIMARY_COLOR = '#292cff';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

export default class SortVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: this.props.array,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.array !== state.array){
            return{
                array: props.array
            };
        }
        return null;
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    render() {
        return (
            <div id='sortvisualizer'>

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
                    <div className="array-bar"
                        key={index}
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