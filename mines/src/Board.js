//@flow
import React from 'react';
import Square from './Square';

// =======================
// utility functions
// =======================

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function mapIndexToRowCol(inArr) {
  //assert inArr.length is perfect square
  const size = Math.sqrt(inArr.length);
  const returnMap = {};
  for (var i=0; i<inArr.length; i++) {
    const row = Math.floor(i/size);
    const col = i % size;
    returnMap[i] = {row: row, col: col};
  }
  return returnMap;
}

function isNeighbor(i, j) {
  if (Math.abs(i.row-j.row)<2 && Math.abs(i.col-j.col)<2) {
    return true;
  }
  return false;
}

function populateNeighborsMap(inputArray) {
  const size = Math.sqrt(inputArray.length);
  var neighbors = {};
  const indexToRowCol = mapIndexToRowCol(inputArray);
  for (var square=0; square<inputArray.length; square++) {
    neighbors[square] = [];
    var possibleNeighbors = [square-size-1, square-size, square-size+1,
      square-1, square+1,
      square+size-1, square+size, square+size+1];
      for (var i=0; i<possibleNeighbors.length; i++) {
        if (indexToRowCol[possibleNeighbors[i]] && isNeighbor(indexToRowCol[square], indexToRowCol[possibleNeighbors[i]])) {
          neighbors[square].push(possibleNeighbors[i]);
        }
      }
    }
    return neighbors;
  }


  export default class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        //either the number of neighbor squares that are bombs
        //or 'B' if this square is a bomb
        squares: Array(64).fill(0),
        hidden: Array(64).fill(true),
        marked: Array(64).fill(false),
        gameLost: false,
        gameWon: false,
      };
      this.neighbors = populateNeighborsMap(this.state.squares);
      //set bombs
      var currIndex = 0;
      var numBombs = 12;
      while (true) {
        currIndex = getRandomInt(64)
        if (this.state.squares[currIndex] === 'B') continue;
        this.state.squares[currIndex] = 'B';
        console.log("set bomb");
        numBombs--;
        if (numBombs < 1) break;
      }
      //set values to num of bombs in neighbor squares
      for (let [square, neighborArr] of Object.entries(this.neighbors)) {
        if (this.state.squares[square] === 'B') continue;
        var bombs = 0;
        for (var j=0; j<neighborArr.length; j++) {
          if (this.state.squares[neighborArr[j]] === 'B') bombs++;
        }
        this.state.squares[square] = bombs;
      }
    }
    numNeighborsMarkedBombs(square) {
      var markedBombs = 0;
      if (this.state.squares[square] === 'B') return 0;
      const neighborArr = this.neighbors[square];
      for (var j=0; j<neighborArr.length; j++) {
        if (this.state.marked[neighborArr[j]] === true) markedBombs++;
      }
      return markedBombs;
    }
    renderSquare(i) {
      return (
        <Square
        key={i}
        value={this.state.squares[i]}
        isHidden={this.state.hidden[i]}
        isMarked={this.state.marked[i]}
        gameLost={this.state.gameLost}
        onClick={() => this.handleClick(i)}
        onContextMenu={(e) => this.handleRightClick(i, e)}
        />
      );
    }
    reveal(square) {
      if ((this.state.hidden[square] === false)
      || (this.state.squares[square] === 'B'))
      return;
      this.state.hidden[square] = false;
      const hidden = this.state.hidden.slice();
      this.setState({hidden: hidden});
      //reveal neighbors
      if (this.state.squares[square] === 0) {
        const neighbors = this.neighbors[square];
        for (var j=0; j<neighbors.length; j++) {
          if (this.state.hidden[neighbors[j]]) {
            this.reveal(neighbors[j]);
          }
        }
      }
    }
    isGameWon() {
      for (var i=0; i<this.state.squares.length; i++) {
        if (this.state.hidden[i] === false) continue;
        if (this.state.squares[i] !== 'B') return;
        if (this.state.marked[i] === false) return;
      }
      this.setState({gameWon: true});
    }
    handleClick(square) {
      if ((this.state.gameLost) || (this.state.marked[square] === true)) {
        return;
      }
      if (this.state.squares[square] === 'B') {
        this.setState({gameLost: true});
      } else {
        this.reveal(square);
      }
      this.isGameWon();
    }
    handleRightClick(square, event) {
      event.preventDefault();
      const marked = this.state.marked.slice();
      if (this.state.squares[square] === 'B') {
        if (this.state.marked[square]) {
          marked[square] = false;
        } else {
          marked[square] = true;
        }
      } else {
        if (this.state.squares[square] === this.numNeighborsMarkedBombs(square)) {
          this.reveal(square);
          const n = this.neighbors[square];
          for (var j=0; j<n.length; j++) {
            this.reveal(n[j]);
          }
        }
      }
      this.setState({marked: marked}, this.isGameWon);
    }
    render() {
      var status = this.state.gameWon ? 'Congratulations!' : 'under construction';
      const size = Math.sqrt(this.state.squares.length);
      const board = [];
      for (var j=0; j<size; j++) {
        const row = [];
        for (var i=0; i<size; i++) {
          row.push(this.renderSquare(j*size + i));
        }
        board.push(row);
      }
      return (
        <div>
        <div className="status">{status}</div>
        {board.map((row, index) => <div className="board-row" key={index}> {row} </div>)}
        </div>
      );
    }
  }
