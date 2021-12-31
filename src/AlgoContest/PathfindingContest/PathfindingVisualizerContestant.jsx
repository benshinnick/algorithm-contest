import React from 'react';
import Node from './Node/Node.jsx';
import { getLinePixelCoordinates } from './gridDrawingAlgorithms/BresenhamLineDrawAlgo.js';
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
            isMousePressed: false,
            lastUpdatedNode: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.grid !== state.grid){
            return{ grid: props.grid };
        }
        return null;
    }

    handleMouseDown(row, col) {
        this.setState({...this.state, isMousePressed: true, lastUpdatedNode: [row, col]});
        this.props.updateGridNodeWeight(row, col, Infinity);
        // console.log(`Mouse is down on row=${row} col=${col}`);
    }

    handleMouseEnter(row, col) {
        if(this.state.isMousePressed === true) {
            this.props.updateGridNodeWeight(row, col, Infinity);
            if(!this.isLastUpdatedNodeAdjacentToCurrentNode(row, col)) {
                this.fillInSkippedNodes(row, col);
            }
            this.setState({...this.state, lastUpdatedNode: [row, col]});
            // console.log(`Mouse is entering on row=${row} col=${col}`);
        }
    }

    isLastUpdatedNodeAdjacentToCurrentNode(currentRow, currentCol) {
        return (Math.abs(currentRow - this.state.lastUpdatedNode[0]) <= 1)
                    && (Math.abs(currentCol - this.state.lastUpdatedNode[1]) <= 1);
    }

    fillInSkippedNodes(currRow, currCol) {

        const x1 = this.state.lastUpdatedNode[1];
        const y1 = this.state.lastUpdatedNode[0];
        const x2 = currCol;
        const y2 = currRow;

        //draw a line between the skipped nodes in our grid
        const lineCoordinates = getLinePixelCoordinates(x1, y1, x2, y2);
        for(let i = 0; i < lineCoordinates.length; ++i) {
            const row = lineCoordinates[i][1];
            const col = lineCoordinates[i][0];
            this.props.updateGridNodeWeight(row, col, Infinity);
        }
    }

    handleMouseUp(row, col) {
        // this.setState({...this.state, isMousePressed: false});
        // console.log(`Mouse is up on row=${row} col=${col}`);
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    algorithmDropDownButtonOnClick(algorithmType) {
        this.updateAlgorithmType(algorithmType);
    }

    resetIsMousedPressed() {
        this.setState({...this.state, isMousePressed: false});
    }

    render() {
        return (
            <>
            <div className='pathfinding-visualizer-contestant' id={`pathfinding-visualizer-${this.state.contestantNumber}`}
                onMouseEnter={() => this.resetIsMousedPressed()} onMouseUp={() => this.resetIsMousedPressed()}>
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
                <button onClick={() => console.log(this.state)}>Log State</button>
                <div className='grid-container' id={`grid-container-${this.state.contestantNumber}`}>
                    {this.state.grid.map((row, rowIdx) => {
                        return (
                        <div className='grid-row' key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const {row, col, weight, isFinish, isStart, isWall, isLastRow, isLastColumn} = node;
                                return (
                                    <Node
                                    key={nodeIdx}
                                    contestantNumber={this.state.contestantNumber}
                                    row={row}
                                    col={col}
                                    weight={weight}
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