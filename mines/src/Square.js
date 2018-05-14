//@flow
import React from 'react';

export default function Square(props) {
  const valToShow = props.value
  var squareClass = "square ";
  if (props.gameLost) {
    squareClass += "gameLost";
  } else {
    if (props.isMarked) {
      squareClass += "markedSquare";
    } else {
      if (props.isHidden) {
        squareClass += "hiddenSquare";
      } else {
        squareClass += "revealedSquare";
      }
    }
  }
  // const squareClass = "square " +
  //                     (props.gameLost ? "gameLost" :
  //                     (props.isMarked) ? "markedSquare" :
  //                     (props.isHidden ? "hiddenSquare" : "revealedSquare")
  //                     );
  return (
    <button className={squareClass} onClick={() => props.onClick()}
    onContextMenu={(e) => props.onContextMenu(e)}>
    {valToShow}
    </button>
  );
}
