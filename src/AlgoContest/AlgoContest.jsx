import React from 'react';
import './AlgoContest.css';

export default class AlgoContest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            algorithmType: 'sorting'
        };
    }

    render() {
        return (
            <div>AlgoContest</div>
        );
    }
}