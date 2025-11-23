import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import { generateThreePieces } from "./utils/pieces";

function createEmptyBoard() {
  return Array(8).fill().map(() => Array(8).fill(0)); //The two arrays functions make it 8 X 8. first 8 =row /second 8 = columns
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [availablePieces, setAvailablePieces] = useState(generateThreePieces());
  const [draggedPieceIndex, setDraggedPieceIndex] = useState(null);

  function handleCellClick(row, col){
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(arr => [...arr]); //Makes a copy of board(DO NOT ALTER ORIGIONAL board!!)
      newBoard[row][col] = newBoard[row][col] ? 0 : 1; //Uses copied board to make new changes to current cell.
      return newBoard;
    });
  }

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      <GameBoard
        board={board}
        onCellClick={handleCellClick}
      /> 
      <div className="pieces-area">
        {availablePieces.map((piece, index) =>
          piece ? (
            <div
              key={index}
              className="piece"
              style={{gridTemplateColumns: `repeat(${piece.block[0].length}, 50px)`}}
              draggable
              onDragStart={() => setDraggedPieceIndex(index)}
            >
              {piece.block.map((row, r) =>
                row.map((val, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`mini-cell ${val ? "filled" : ""}`}
                  />
                ))
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
