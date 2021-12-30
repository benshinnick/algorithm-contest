import React from 'react';
import Node from './Node/Node.jsx';
import './css/PathfindingVisualizerContestant.css';

export default class PathfindingVisualizerContestant extends React.Component {

    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber,
            isMousePressed: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.grid !== state.grid){
            return{ grid: props.grid };
        }
        return null;
    }

    handleMouseDown(row, col) {
        this.setState({...this.state, isMousePressed: true});
        console.log(`Mouse is down on row=${row} col=${col}`);
    }

    handleMouseEnter(row, col) {
        if(this.state.isMousePressed === true) {
            console.log(`Mouse is entering on row=${row} col=${col}`);
        }
    }

    handleMouseUp(row, col) {
        this.setState({...this.state, isMousePressed: false});
        console.log(`Mouse is up on row=${row} col=${col}`);
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    algorithmDropDownButtonOnClick(algorithmType) {
        this.updateAlgorithmType(algorithmType);
    }

    render() {
        return (
            <>
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
                    {this.state.grid.map((row, rowIdx) => {
                        return (
                        <div className='grid-row' key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row, col, isFinish, isStart, isWall, isLastRow, isLastColumn} = node;
                                return (
                                    <Node
                                    key={nodeIdx}
                                    contestantNumber={this.state.contestantNumber}
                                    row={row}
                                    col={col}
                                    isFinish={isFinish}
                                    isStart={isStart}
                                    isWall={isWall}
                                    isLastRow={isLastRow}
                                    isLastColumn={isLastColumn}
                                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                    onMouseEnter={(row, col) =>
                                        this.handleMouseEnter(row, col)
                                    }
                                    onMouseUp={(row, col) => this.handleMouseUp(row, col)}></Node>
                                );
                            })}
                        </div>
                        );
                    })}
                </div>
                {/* <button id='remove-button' className='remove' onClick={() => this.props.removeMe(this.state.contestantNumber)}>-</button> */}
                </div>
            </>
        );
    }
}