import "./App.css";
import { useState } from "react";
import PlayerView from "./Componentes/Objetos/PlayerView";
import MarketManager from "./Componentes/Objetos/MarketManager";
import Options from "./Componentes/Objetos/Options";
import { useGeneralContext } from "./Componentes/Provider";

function App() {
  const [player, setPlayer] = useState(false);
  const [market, setMarket] = useState(false);
  const [options, setOptions] = useState(false);
  const { state, dispatch } = useGeneralContext();

  return (
    <div className="App">
      {!player && !market && (
        <>
          <div className="left-side"></div>
          <div className="right-side"></div>
          <div className="elementos-iniciales">
            <button onClick={() => setPlayer(true)}>Player</button>
            <button className="option-button" onClick={() => setOptions(true)}>
              Options
            </button>
            <button onClick={() => setMarket(true)}>Market Manager</button>
          </div>
        </>
      )}
      {player && <PlayerView funHome={() => setPlayer(false)} />}
      {market && <MarketManager funHome={() => setMarket(false)} />}
      {options && <Options funHome={() => setOptions(false)} />}
    </div>
  );
}

export default App;
