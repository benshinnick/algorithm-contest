import React, {Component} from 'react';
import './node.css';

export default class Node extends Component {
  render() {
    const {
      contestantNumber,
      col,
      row,
      weight,
      isFinish,
      isStart,
      isLastRow,
      isLastColumn,
      onMouseDown,
      onMouseEnter,
      onMouseUp
    } = this.props;

    const extraClassName = isFinish
      ? ' node-finish'
      : isStart
      ? ' node-start'
      : parseFloat(weight) === Infinity
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
        id={`${contestantNumber}-node-${row}-${col}`}
        className={`node node-${row}-${col}${extraClassName}${isLastRowClassName}${isLastColumnClassName} weight-${weight}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}></div>
    );
  }
}