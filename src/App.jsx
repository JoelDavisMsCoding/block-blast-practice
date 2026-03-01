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
  const [shake, setShake] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    function handleGlobalDragend(){
      setHoverCell(null);
      setDraggedPieceIndex(null);
    }

    window.addEventListener("dragend", handleGlobalDragend);
    return () =>{window.removeEventListener("dragend", handleGlobalDragend)}
  }, []);

  function hasAnyValidMove(currentBoard, pieces) {
    for (let p = 0; p < pieces.length; p++) {
      const piece = pieces[p];
      if (!piece) continue;

      for (let row = 0; row < 8; row++){
        for (let col = 0; col < 8; col++){
          if (canPlacePiece(piece, row, col, currentBoard)){
            return true; //Found atleast one valid move.
          }
        }
      }
    }
    return false; //No valid moves anywhere
  }

  function handleDragEnd() {
  setHoverCell(null);
  setDraggedPieceIndex(null);
  }

  function handleDragOver(e, row, col){
    e.preventDefault();
    if (draggedPieceIndex === null) return;
    
    setHoverCell(prev => {
      if (prev?.row === row && prev?.col === col){
        return prev;
      }
      return {row, col}
    });
  }

  function handleDrop(e, row, col){
    e.preventDefault();
    if (draggedPieceIndex === null) return;
    const piece = availablePieces[draggedPieceIndex];
    if (!piece)return; //If no piece return/do nothing
    if (!canPlacePiece(piece, row, col, board)){ //If you can not place the piece...
      console.log("Invalid Placement");
      return;
    }

    // 1️⃣ Create updated board FIRST
    const newBoard = board.map(r => [...r]);

    //Place the piece on the board
    piece.block.forEach((rArr, rIndex) => { //piece comes from argument/block comes from pieces.js
      rArr.forEach((val, cIndex) => {
        if (val === 1){
          newBoard[row + rIndex][col + cIndex] = piece.colorId
        }
      });
    });

    // 2️⃣ Set board ONCE
    setBoard(newBoard);

    // 3️⃣ Then run animation
    clearLinesAnimated(newBoard);

    //Remove used piece
    let updatedPieces = [...availablePieces];
    updatedPieces[draggedPieceIndex] = null;
    
    if (updatedPieces.every(p => p === null)){
      updatedPieces = generateThreePieces();
    }
    setAvailablePieces(updatedPieces);
    setHoverCell(null);
    setDraggedPieceIndex(null);

    setTimeout(() =>{
      if (!hasAnyValidMove(newBoard, updatedPieces)){
        setGameOver(true);
      }
    }, 200);
  }
  
  function canPlacePiece(piece, startRow, startCol, currentBoard = board){
    for (let r = 0; r < piece.block.length; r++) {
      for (let c = 0; c < piece.block[r].length; c++){
        if (piece.block[r][c] === 1){
          let boardR = startRow + r;
          let boardC = startCol + c;

          if (boardR < 0 || boardR >= 8 || boardC < 0 || boardC >= 8){ //Check to make sure piece is in bound of the board by Row/Col
            return false;
          }

          if (currentBoard[boardR][boardC] !== 0){ //making sure piece is not piece is not placed over existing piece on the board.
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
  
  function explodeSequential(cells){
    let i = 0;
    function clearNext(){
      if (i >= cells.length){
        setClearingCells([]);
        return;
      }

      const cell = cells[i];

      setClearingCells(prev => [...prev, cell]);
      
      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[cell.row][cell.col] = 0;
        return newBoard;
      });
      i++;
      setTimeout(clearNext, 130);
    }
    setShake(true);
    setTimeout(() => setShake(false), 150);
    clearNext();
  }

  function clearLinesAnimated(board){
    const rows = getFullRows(board);
    const cols = getFullCols(board);

    if (rows.length === 0 && cols.length === 0){
      return;
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
    });
    explodeSequential(cellsToClear);
  };

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      {gameOver && (
        <div className="game-over">
          💀 Game Over
        </div>
      )}
      <GameBoard
        board={board}
        clearingCells={clearingCells}
        shake={shake}
        onDragOver={handleDragOver}
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
