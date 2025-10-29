import React, { useState } from "react";
import GameBoard from "./components/GameBoard";

function createEmptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(0));
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard());

  return (
    <div>
      <h1>🧱 Block Blast Practice</h1>
      <GameBoard board={board} />
    </div>
  );
}

export default App;
