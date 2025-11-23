import React from "react";

function GameBoard({board, onCellClick,}) {
  return (
    <div className="board">
      {board.map((row, rIndex) => 
        row.map((cell, cIndex) => ( //cell will have the rows and columns 8 by 8 when you print/display cell.

          <div
            key={`${rIndex}-${cIndex}`}
            className={`cell ${cell ? "filled" : ""}`} //Adds the class name filled or leaves it cell(empty)
            onClick={() => onCellClick(rIndex, cIndex)}
          />
        )) //End row.map parenthesis
      )}
    </div> //End className board div
  );
}

export default GameBoard;
