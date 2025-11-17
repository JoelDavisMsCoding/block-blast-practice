import React from "react";

function GameBoard({board, onCellClick}) {
  return (
    <div className="board">
      {board.map((row, rIndex) =>
        row.map((cell, cIndex) => (
          <div
            key={`${rIndex}-${cIndex}`}
            className={`cell ${cell ? "filled" : ""}`}
            onClick={() => onCellClick(rIndex, cIndex)}
          />
        )) //End row.map parenthesis
      )}
    </div> //End className board div
  );
}

export default GameBoard;
