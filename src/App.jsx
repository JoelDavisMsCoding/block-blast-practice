import React, { useEffect, useState } from "react";
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
  const [clearingCells, setClearingCells] = useState([]);

  useEffect(() => {
    function handleGlobalDragend(){
      setHoverCell(null);
      setDraggedPieceIndex(null);
    }

    window.addEventListener("dragend", handleGlobalDragend);
    return () =>{window.removeEventListener("dragend", handleGlobalDragend)}
  }, [])

  function handleDragLeaveBoard(){
    setHoverCell(null);
  }

  function handleDragEnd() {
  setHoverCell(null);
  setDraggedPieceIndex(null);
  }

  function handleDragOver(e, row, col){
    e.preventDefault();
    if (draggedPieceIndex === null) return;
    setHoverCell({row, col});
  }

  function handleDrop(e, row, col){
    e.preventDefault();
    setHoverCell(null);
    setDraggedPieceIndex(null);

    const piece = availablePieces[draggedPieceIndex];
    if (!piece)return; //If no piece return/do nothing

    if (!canPlacePiece(piece, row, col)){ //If you can not place the piece...
      console.log("Invalid Placement");
      return;
    }

    //Place the piece on the board
    setBoard(prev => {  //prev is a argument made by me but the first argument will always be set as a copy of previous state/board
      const newBoard = prev.map(r => [...r]); //Saving a copy of the board as newBoard
      piece.block.forEach((rArr, rIndex) => { //piece comes from argument/block comes from pieces.js
        rArr.forEach((val, cIndex) => {
          if (val === 1){
            newBoard[row + rIndex][col + cIndex] = piece.colorId
          }
        });
      });
      clearLinesAnimated(newBoard);
      return newBoard;
    });

    //Remove used piece
    const updatedPieces = [...availablePieces];
    updatedPieces[draggedPieceIndex] = null;
    setAvailablePieces(updatedPieces);

    //Replace available pieces after all three are used.
    for (let piecesIndex = 0; piecesIndex < 3; piecesIndex++){
      if (updatedPieces.every(index => index === null)){
        setAvailablePieces(generateThreePieces());
      }
    };
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

          if (board[boardR][boardC] !== 0){ //making sure piece is not piece is not placed over existing piece on the board.
            return false;
          }
        }
      }
    }
    return true;
  }

  function getFullRows(board){
    const fullRows = [];
    for (let r = 0; r < 8; r++){
      if (board[r].every(cell => cell !== 0)){
        fullRows.push(r);
      }
    }
    return fullRows;
  }
  
  function getFullCols(board){
    const fullCols = [];
    for (let c = 0; c < 8; c++){
      let isFull = true;
      for (let r = 0; r < 8; r++){
        if (board[r][c] === 0){
          isFull = false;
          break;
        }
      }
      if (isFull){
        fullCols.push(c);
      }
    }
    return fullCols;
  }
  
  function clearLinesAnimated(board){
    const rows = getFullRows(board);
    const cols = getFullCols(board);
    if (rows.length === 0 && cols.length === 0){
      return board;
    }

    const cellsToClear = [];

    rows.forEach(r => {
      for (let c = 0; c < 8; c++){
        cellsToClear.push({row: r, col: c});
      }
    });

    cols.forEach(c => {
      for (let r = 0; r < 8; r++){
        cellsToClear.push({row: r, col: c})
      }
    })

    setClearingCells(cellsToClear);
    
    setTimeout(() =>{
      setBoard((prev) =>{
        const newBoard = prev.map(row => [...row])
        cellsToClear.forEach(({row, col}) =>{
          newBoard[row][col] = 0;
        });
        return newBoard;
      });
      setClearingCells([]);
    }, 300);
    return board;
  };

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      <GameBoard
        board={board}
        clearingCells={clearingCells}
        onDragOver={handleDragOver}
        onDragLeaveBoard={handleDragLeaveBoard}
        onDragEnd={handleDragEnd}
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
              onDragEnd={handleDragEnd}
            >
              {piece.block.map((row, r) =>
                row.map((col, c) =>
                  <div
                    key={`${r}-${c}`}
                    className={`block ${col === 1 ? `filled color-${piece.colorId}` : ""}`}
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
