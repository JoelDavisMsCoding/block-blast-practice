import React, { use, useState } from "react";
import GameBoard from "./components/GameBoard";
import { generateThreePieces } from "./utils/pieces";


function createEmptyBoard() {
  return Array(8).fill().map(() => Array(8).fill(0)); //The two arrays functions make it 8 X 8. first 8 =row /second 8 = columns
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [availablePieces, setAvailablePieces] = useState(generateThreePieces());
  const [draggedPieceIndex, setDraggedPieceIndex] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  function handleDragOver(e, row, col){
    e.preventDefault();
    setHoverCell({row, col})
  }

  function handleDrop(e, row, col){
    e.preventDefault();

    const piece = availablePieces[draggedPieceIndex];
    if (!piece){return;} //If no piece return/do nothing

    if (!canPlacePiece(piece, row, col)){ //If you can not place the piece...
      console.log("Invalid Placement");
      return;
    }

    //Place the piece on the board
    setBoard(prev => {  //prev is a argument made by me but the first argument will always be set as a copy of previous state/board
      const newboard = prev.map(r => [...r]); //Saving a copy of the board as newBoard
      piece.block.forEach((rArr, rIndex) =>{ //piece comes from argument/block comes from pieces.js
        rArr.forEach((val, cIndex) =>{
          if (val === 1){
            newboard[row + rIndex][col + cIndex] = 1;
          }
        });
      });
      return newboard
    });

    //Remove used piece
    const updatedPieces = [...availablePieces];
    updatedPieces[draggedPieceIndex] = null;
    setAvailablePieces(updatedPieces);

    setHoverCell(null); //Clears/Stops the highlight after dropping the piece/releasing the mouse.
    setDraggedPieceIndex(null);
  }
  
  function canPlacePiece(piece, startRow, startCol){
    for (let r = 0; r < piece.block.length; r++) {
      for (let c = 0; c < piece.block[r].length; c++){
        if (piece.block[r][c] === 1){
          let boardR = startRow + r;
          let boardC = startCol + c;

          if (boardR < 0 || boardR >= 8 || boardC < 0 || boardC >= 8){ //Check to make sure piece is in bound of the board by Row/Col
            return false;
          }

          if (board[boardR][boardC] === 1){ //making sure piece is not piece is not placed over existing piece on the board.
            return false;
          }
        }
      }
    }
    return true;
  }

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      <GameBoard
        board={board}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        hoverCell={hoverCell}
        canPlacePiece={canPlacePiece}
        draggedPiece={draggedPieceIndex !== null ? availablePieces[draggedPieceIndex] : null} //if piece is selected pass in piece else pass null
      /> 
      <div className="pieces-area">
        {availablePieces.map((piece, index) =>
          piece ? (
            <div
              key={index}
              className="piece"
              style={{gridTemplateColumns: `repeat(${piece.block[0].length}, 50px)`}} //repeat() Make same # of col as rows
              draggable
              onDragStart={() => setDraggedPieceIndex(index)}
            >
              {piece.block.map((row, r) =>
                row.map((val, c) =>
                  <div
                    key={`${r}-${c}`}
                    className={`mini-cell ${val ? "filled" : ""}`}
                  >
                    {c}{r}
                  </div>
                )
              )}
            </div>
          ) : (
            <div key={index} className="piece empty" />
          )
        )}
      </div>
    </div>//End of main
  );
}

export default App;
