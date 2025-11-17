import React, { useState } from "react";
import GameBoard from "./components/GameBoard";

function createEmptyBoard() {
  return Array(8).fill().map(() => Array(8).fill(0)); //The two arrays functions make it 8 X 8. first 8 =row /second 8 = columns
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard());

  function handleCellClick(row, col){
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(arr => [...arr]);
      newBoard[row][col] = newBoard[row][col] ? 0 : 1;
      return newBoard;
    });
  }

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      <GameBoard board={board} onCellClick={handleCellClick}/>
      
    </div>
  );
}

export default App;
