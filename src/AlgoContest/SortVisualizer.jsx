import React from 'react';
import './css/SortVisualizer.css';

export default class SortVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: this.props.array
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

    render() {
        return (
            <div id='sortvisualizer'>
                Sort Visualizer: 
                <button id="logvisualizerstatebutton" onClick={() => console.log(this.state)}>Log Sort Visualizer State</button>
            </div>
        );
    }
}