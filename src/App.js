import "./App.css";
import { useState } from "react";
import PlayerView from "./Componentes/Objetos/PlayerView";

function App() {
  const [player, setPlayer] = useState(false);
  const [market, setMarket] = useState(false);

  return (
    <div className="App">
      {!player && !market && (
        <div className="elementos-iniciales">
          <button onClick={() => setPlayer(true)}>Player</button>
          <p>/</p>
          <button onClick={() => setPlayer(true)}>Market Manager</button>
        </div>
      )}
      {player && <PlayerView funHome={() => setPlayer(false)} />}
    </div>
  );
}

export default App;
