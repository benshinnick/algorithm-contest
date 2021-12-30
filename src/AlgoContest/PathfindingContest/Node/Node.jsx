import React, {Component} from 'react';
import './node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isFinish,
      isStart,
      isWall,
      isLastRow,
      isLastColumn,
    } = this.props;
    const extraClassName = isFinish
      ? ' node-finish'
      : isStart
      ? ' node-start'
      : isWall
      ? ' node-wall'
      : '';

    const isLastRowClassName = isLastRow
        ? ' last-row'
        : '';
    
    const isLastColumnClassName = isLastColumn
        ? ' last-column'
        : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node${extraClassName}${isLastRowClassName}${isLastColumnClassName}`}></div>
    );
  }
}