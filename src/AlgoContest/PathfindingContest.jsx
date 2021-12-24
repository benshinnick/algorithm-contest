import React from 'react';
import './css/PathfindingContest.css';

export default class PathfindingContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: []
        };
    }

    render() {
        return (
            <div id='pathfinding-contest'>
                <p className="placeholder-text">Pathfinding Contest (Placeholder)</p>
                <p className="placeholder-text">Future Project</p>
                <p className="placeholder-text">Not Implemented Yet</p>
            </div>
        );
    }
}