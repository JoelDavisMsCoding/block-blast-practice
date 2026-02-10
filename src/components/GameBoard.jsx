import React from "react";

function GameBoard({board, clearingCells, hoverCell, draggedPiece, canPlacePiece, onDragOver, onDrop, onDragLeaveBoard}) {
  return (
    <div
      className="board"
      onDragLeave={onDragLeaveBoard}
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
            
            const canPlace = canPlacePiece(draggedPiece, startR, startC);

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
              className={`boardCell 
                ${col ? `filled color-${col}` : ""}
                ${ghostClass}
                ${isClearing ? "clearing" : ""}
              `}
              onDragOver={(e) => onDragOver(e, rIndex, cIndex)}
              onDrop={(e) => onDrop(e,rIndex, cIndex)}
            >
              {rIndex}{cIndex}
            </div>
          );
        }) //End row.map parenthesis
      )}
    </div> //End className board div
  );
}

export default GameBoard;
