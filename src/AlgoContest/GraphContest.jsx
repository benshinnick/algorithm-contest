import React from 'react';
import './css/GraphContest.css';

export default class GraphContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: []
        };
    }

    render() {
        return (
            <div id='graphcontest'>
                <p id = "placeholdertext">Graph Contest</p>
                <p id = "placeholdertext">Not Implemented Yet</p>
            </div>
        );
    }
}