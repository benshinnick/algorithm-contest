import React from 'react';
import Node from './Node/Node.jsx';
import { getDijkstraAnimations } from './pathfindingAlgorithms/Dijkstra.js';
import { getLinePixelCoordinates } from './gridDrawingAlgorithms/BresenhamLineDrawAlgo.js';
import './css/PathfindingVisualizerContestant.css';

const INITIAL_ANIMATION_SPEED = 4;

export default class PathfindingVisualizerContestant extends React.Component {

    static ANIMATION_DELAY_MS = 3000;

    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            animationSpeedMS: INITIAL_ANIMATION_SPEED,
            algorithmType: this.props.algorithmType,
            allAlgorithmTypes: this.props.algorithmTypes,
            contestantNumber: this.props.contestantNumber,
            selectedNodeWeight: this.props.selectedNodeWeight,
            isMousePressed: false,
            isStartNodeSelected: false,
            isFinishNodeSelected: false,
            lastUpdatedNode: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(props.grid !== state.grid){
            return{ grid: props.grid };
        }
        if(props.selectedNodeWeight !== state.selectedNodeWeight) {
            return{ selectedNodeWeight: props.selectedNodeWeight }
        }
        return null;
    }

    getPathfindingAnimations(startNode, endNode) {
        let gridCopy = this.state.grid.map((value) => value);

        switch(this.state.algorithmType) {
            case 'Dijkstra':
                return getDijkstraAnimations(gridCopy, startNode, endNode);
            case 'A* Search':
                // return getAStarAnimations(gridCopy);
                return;
            case 'Greedy Best-first Search':
                // return getGreedyBestFirstAnimations(gridCopy);
                return;
            case 'Breadth-first Search':
                // return getBreadthFirstAnimations(gridCopy);
                return;
            case 'Depth-first Search':
                // return getDepthFirstAnimations(gridCopy);
                return;
            default:
                console.log("Error: Unexpected Algorithm Type");
                return null;
        }
    }

    doAnimationNextStep(animationStepInfo, currentStepNumber) {
        switch(this.state.algorithmType) {
            case 'Dijkstra':
                this.doNextDijkstraAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'A* Search':
                // this.doNextAStarAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'Greedy Best-first Search':
                // this.doNextGreedyBestFirstAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'Breadth-first Search':
                // this.doNextBreadthFirstAnimationStep(animationStepInfo, currentStepNumber);
                break;
            case 'Depth-first Search':
                // this.doNextDepthFirstAnimationStep(animationStepInfo, currentStepNumber);
                break;
            default:
                console.log("Error: Unexpected Algorithm Type");
        }
    }

    addVisitedMarkerToNode(node) {
        let visitedMarker = document.createElement("DIV");
        visitedMarker.setAttribute("class", 'visited');
        node.appendChild(visitedMarker);
    }

    addShortestPathLineToNode(node, row, col, adjacentPathRow, adjacentPathCol) {
        let visitedMarker = document.createElement("DIV");

        if(row === adjacentPathRow) {
            if(col < adjacentPathCol) {
                visitedMarker.setAttribute("class", 'shortestPathRight');
            }
            else {
                visitedMarker.setAttribute("class", 'shortestPathLeft');
            }
        }
        else if(col === adjacentPathCol) {
            if(row < adjacentPathRow) {
                visitedMarker.setAttribute("class", 'shortestPathBottom');
            }
            else {
                visitedMarker.setAttribute("class", 'shortestPathTop');
            }
        }

        node.prepend(visitedMarker);
    }

    doNextDijkstraAnimationStep(animationStepInfo, currentStepNumber) {
        const animationCode = animationStepInfo[0];
        const row = animationStepInfo[1];
        const col = animationStepInfo[2];

        const currentNode = document.getElementById(
            `${this.state.contestantNumber}-node-${row}-${col}`
        );

        //visited node cases
        if (animationCode === 'v') {
            setTimeout(() => {
                currentNode.classList.add('visiting');
            }, currentStepNumber * this.state.animationSpeedMS + PathfindingVisualizerContestant.ANIMATION_DELAY_MS);
            return;
        }
        else if(animationCode === 'vf') {
            setTimeout(() => {
                currentNode.classList.remove('visiting');
                this.addVisitedMarkerToNode(currentNode);
            }, currentStepNumber * this.state.animationSpeedMS + PathfindingVisualizerContestant.ANIMATION_DELAY_MS);
            return;
        }
        //shortest path case
        else if(animationCode === 'sp') {
            const nextRow = animationStepInfo[3];
            const nextCol = animationStepInfo[4];
            setTimeout(() => {
                this.addShortestPathLineToNode(currentNode, row, col, nextRow, nextCol);
            }, currentStepNumber * this.state.animationSpeedMS + PathfindingVisualizerContestant.ANIMATION_DELAY_MS);
            return;
        }
        else if(animationCode === 'spf') {
            setTimeout(() => {
                const prevRow = animationStepInfo[3];
                const prevCol = animationStepInfo[4];
                this.addShortestPathLineToNode(currentNode, row, col, prevRow, prevCol);
            }, currentStepNumber * this.state.animationSpeedMS + PathfindingVisualizerContestant.ANIMATION_DELAY_MS);
            return;
        }
    }

    handleMouseDown(row, col) {
        if(!this.isStartOrFinishNode(row, col)) {
            this.updateGridNodeWithSelectedWeight(row, col);
        }
        else {
            if(this.state.grid[row][col].isStart) {
                this.selectStartNode(row, col);
            }
            else {
                this.selectFinishNode(row, col);
            }
        }
    }

    handleMouseEnter(row, col) {
        if(this.state.isMousePressed === true) {
            if(this.state.isStartNodeSelected) {
                this.addHoverStylingToAllGridNodes(row, col, 'selected-start');
            }
            else if(this.state.isFinishNodeSelected) {
                this.addHoverStylingToAllGridNodes(row, col, 'selected-finish');
            }
            else {
                if(!this.isStartOrFinishNode(row, col)) {
                    this.updateGridNodeWithSelectedWeight(row, col);
                    if(!this.isLastUpdatedNodeAdjacentToCurrentNode(row, col)) {
                        this.fillInSkippedNodes(row, col);
                    }
                }
            }
            this.setState({...this.state, lastUpdatedNode: [row, col]});
        }
    }

    handleMouseUp(row, col) {
        if(this.state.isStartNodeSelected) {
            this.placeStartNode(row, col);
        }
        else if(this.state.isFinishNodeSelected) {
            this.placeFinishNode(row, col);
        }
        this.setState({...this.state, lastUpdatedNode: [row, col]});
    }

    placeStartNode(row, col) {
        if(!this.isStartOrFinishNode(row, col)) {
            this.props.updateStartNode(row, col);
            const allStartNodes = document.getElementsByClassName(`node-${row}-${col}`);
            for(let i = 0; i < allStartNodes.length; ++i) {
                allStartNodes[i].classList.add('node-start');
            }
            this.removeHoverStylingFromLastUpdatedNode('selected-start'); 
        }
        else {
            let finNodeCol = col;
            if(col > 1) { finNodeCol-- }
            else { finNodeCol++ }
            setTimeout(() => {
                this.props.updateFinishNode(row, finNodeCol)
            }, 100);
            setTimeout( () => {
                this.props.updateStartNode(row, col);
            }, 200);
        }
    }

    placeFinishNode(row, col) {
        if(!this.isStartOrFinishNode(row, col)) {
            this.props.updateFinishNode(row, col);
            const allFinishNodes = document.getElementsByClassName(`node-${row}-${col}`);
            for(let i = 0; i < allFinishNodes.length; ++i) {
                allFinishNodes[i].classList.add('node-finish');
            }
            this.removeHoverStylingFromLastUpdatedNode('selected-finish');
        }
        else {
            let startNodeCol = col;
            if(col > 0) { startNodeCol-- }
            else { startNodeCol++ }
            setTimeout(() => {
                this.props.updateStartNode(row, startNodeCol);
            }, 100);
            setTimeout(() => {
                this.props.updateFinishNode(row, col);
            }, 200);
        }
    }

    isStartOrFinishNode(row, col) {
        const node = this.state.grid[row][col];
        return (node.isStart || node.isFinish);
    }

    isLastUpdatedNodeAdjacentToCurrentNode(currentRow, currentCol) {
        return (Math.abs(currentRow - this.state.lastUpdatedNode[0]) <= 1)
                    && (Math.abs(currentCol - this.state.lastUpdatedNode[1]) <= 1);
    }

    updateGridNodeWithSelectedWeight(row, col) {
        this.props.updateGridNodeWeight(row, col, this.state.selectedNodeWeight);
        this.setState({
            ...this.state,
            isMousePressed: true,
            lastUpdatedNode: [row, col]
        });
    }

    selectStartNode(row, col) {
        this.setState({
            ...this.state,
            isStartNodeSelected: true,
            isMousePressed: true,
            lastUpdatedNode: [row, col]
        });
        const allStartNodes = document.getElementsByClassName(`node-${row}-${col}`);
        for(let i = 0; i < allStartNodes.length; ++i) {
            allStartNodes[i].classList.remove('node-start');
        }
        this.addHoverStylingToAllGridNodes(row, col, 'selected-start');
    }

    selectFinishNode(row, col) {
        this.setState({
            ...this.state,
            isFinishNodeSelected: true,
            isMousePressed: true,
            lastUpdatedNode: [row, col]
        });
        const allFinishNodes = document.getElementsByClassName(`node-${row}-${col}`);
        for(let i = 0; i < allFinishNodes.length; ++i) {
            allFinishNodes[i].classList.remove('node-finish');
        }
        this.addHoverStylingToAllGridNodes(row, col, 'selected-finish');
    }

    fillInSkippedNodes(currRow, currCol) {

        const updatedNodesCoordinates = [];

        const x1 = this.state.lastUpdatedNode[1];
        const y1 = this.state.lastUpdatedNode[0];
        const x2 = currCol;
        const y2 = currRow;

        //draw a line between the skipped nodes in our grid
        const lineCoordinates = getLinePixelCoordinates(x1, y1, x2, y2);
        for(let i = 0; i < lineCoordinates.length; ++i) {
            const row = lineCoordinates[i][1];
            const col = lineCoordinates[i][0];
            if(!this.isStartOrFinishNode(row, col)) {
                updatedNodesCoordinates.push([row, col]);
            }
        }

        this.props.updateMultipleNodeWeights(updatedNodesCoordinates, this.state.selectedNodeWeight);
    }

    updateAlgorithmType(algorithmType) {
        this.setState({...this.state, algorithmType: algorithmType});
    }

    algorithmDropDownButtonOnClick(algorithmType) {
        this.updateAlgorithmType(algorithmType);
    }

    resetMouseEvents() {
        if(this.state.isStartNodeSelected) {
            this.removeHoverStylingFromLastUpdatedNode('selected-start');
            this.setStartNodeAtLastUpdatedNode();
        }
        if(this.state.isFinishNodeSelected) {
            this.removeHoverStylingFromLastUpdatedNode('selected-finish');
            this.setFinishNodeAtLastUpdatedNode();
        }
        this.setState({
            ...this.state,
            isMousePressed: false,
            isStartNodeSelected: false,
            isFinishNodeSelected: false
        });
    }

    render() {
        return (
            <>
            <div className='pathfinding-visualizer-contestant' id={`pathfinding-visualizer-${this.state.contestantNumber}`}
                onMouseEnter={() => this.resetMouseEvents()} onMouseUp={() => this.resetMouseEvents()}>
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

    addHoverStylingToAllGridNodes(row, col, hoverType) {
        this.removeHoverStylingFromLastUpdatedNode(hoverType);
        const allStartSelectedNodes = document.getElementsByClassName(`node-${row}-${col}`);
        for(let i = 0; i < allStartSelectedNodes.length; ++i) {
            allStartSelectedNodes[i].classList.add(`${hoverType}-hover`);
        }
    }

    removeHoverStylingFromLastUpdatedNode(hoverType) {
        const prevNodeRow = this.state.lastUpdatedNode[0];
        const prevNodeCol = this.state.lastUpdatedNode[1];
        const allPrevStartSelectedNodes = document.getElementsByClassName(`node-${prevNodeRow}-${prevNodeCol}`);
        for(let i = 0; i < allPrevStartSelectedNodes.length; ++i) {
            allPrevStartSelectedNodes[i].classList.remove(`${hoverType}-hover`);
        }
    }

    setStartNodeAtLastUpdatedNode() {
        const prevNodeRow = this.state.lastUpdatedNode[0];
        const prevNodeCol = this.state.lastUpdatedNode[1];
        this.props.updateStartNode(prevNodeRow, prevNodeCol);
    }

    setFinishNodeAtLastUpdatedNode() {
        const prevNodeRow = this.state.lastUpdatedNode[0];
        const prevNodeCol = this.state.lastUpdatedNode[1];
        this.props.updateFinishNode(prevNodeRow, prevNodeCol);
    }
}