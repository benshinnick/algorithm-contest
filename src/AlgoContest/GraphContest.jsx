import React from 'react';
import ReactDOM from 'react-dom';
import './GraphContest.css';

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
                Graph Contest
            </div>
        );
    }
}