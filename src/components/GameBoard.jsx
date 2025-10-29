import React from "react";

function GameBoard({ board }) {
  return (
    <div className="board">
      {board.map((row, rIndex) =>
        row.map((cell, cIndex) => (
          <div
            key={`${rIndex}-${cIndex}`}
            className={`cell ${cell ? "filled" : ""}`}
            data-row={rIndex}
            data-col={cIndex}
          />
        ))
      )}
    </div>
  );
}

export default GameBoard;
