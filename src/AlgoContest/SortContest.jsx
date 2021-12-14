import React from 'react';
import ReactDOM from 'react-dom';
import './SortContest.css';

export default class SortContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: []
        };
    }

    render() {
        return (
            <div id='sortcontest'>
                Sort Contest
            </div>
        );
    }
}