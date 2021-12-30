import React, {Component} from 'react';
import './node.css';

export default class Node extends Component {
  render() {
    const {
      contestantNumber,
      col,
      row,
      isFinish,
      isStart,
      isWall,
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
        id={`${contestantNumber}-node-${row}-${col}`}
        className={`node${extraClassName}${isLastRowClassName}${isLastColumnClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}