//@flow
import React from 'react';
import Board from './Board.js';

export default class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-footer">
          <div>{/* autoplay button */}</div>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
        </div>
      </div>
    );
  }
}
