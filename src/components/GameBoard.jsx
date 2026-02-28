import React from "react";

function GameBoard({board, shake, clearingCells, hoverCell, draggedPiece, canPlacePiece, onDragOver, onDrop}) {
  let canPlace = false;
  if (hoverCell && draggedPiece){
    canPlace = canPlacePiece(
      draggedPiece,
      hoverCell.row,
      hoverCell.col,
      board
    );
  }
  return (
    <div
      className={`board ${shake ? "shake" : ""}`}
    >
      {board.map((row, rIndex) => 
        row.map((col, cIndex) => { //cell will have the rows and columns 8 by 8 when you print/display cell.
          const isClearing = clearingCells?.some(
            c => c.row === rIndex && c.col === cIndex
          );
          let ghostClass = ""

          if (hoverCell && draggedPiece){
            const startR = hoverCell.row;
            const startC = hoverCell.col;

            for (let r = 0; r < draggedPiece.block.length; r++){
              for (let c = 0; c < draggedPiece.block[r].length; c++){
                if (draggedPiece.block[r][c] === 1){
                  if (startR + r === rIndex && startC + c === cIndex){
                    ghostClass = canPlace ? `ghost-valid color-${draggedPiece.colorId}` : "ghost-invalid";
                  }
                }
              }
            }
          }
          return (
            <div
              key={`${rIndex}-${cIndex}`}
              className="boardCell"
              onDragOver={(e) => onDragOver(e, rIndex, cIndex)}
              onDrop={(e) => onDrop(e,rIndex, cIndex)}
            >
              {col !== 0 && (
                <div
                  className={`
                    block
                    filled
                    color-${col}
                    ${isClearing ? "clearing" : ""}
                  `}
                />
              )}
              {ghostClass && draggedPiece && (
                <div className={`block ${ghostClass}`} />
              )}
              {rIndex}{cIndex}
            </div>
          );
        }) //End row.map parenthesis
      )}
    </div> //End className board div
  );
}

export default GameBoard;
