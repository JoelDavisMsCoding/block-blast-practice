import React from "react";

function GameBoard({board, hoverCell, draggedPiece, canPlacePiece, onDragOver, onDrop}) {
  console.log("GameBoard props:", board);
  return (
    <div className="board">
      {board.map((row, rIndex) => 
        row.map((cell, cIndex) => { //cell will have the rows and columns 8 by 8 when you print/display cell.
          let ghostClass = ""

          if (hoverCell && draggedPiece){
            const startR = hoverCell.row;
            const startC = hoverCell.col;
            
            const canPlace = canPlacePiece(draggedPiece, startR, startC);

            for (let r = 0; r < draggedPiece.block.length; r++){
              for (let c = 0; c < draggedPiece.block[r].length; c++){
                if (draggedPiece.block[r][c] === 1){
                  if (startR + r === rIndex && startC + c === cIndex){
                    ghostClass = canPlace ? "ghost-valid" : "ghost-invalid";
                  }
                }
              }
            }
          }
          return (
            <div
              key={`${rIndex}-${cIndex}`}
              className={`cell ${cell ? "filled" : ""} ${ghostClass}`}
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
