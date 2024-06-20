import React, { useState } from "react";
import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import "../../Stylesheets/Options.css";

const Options = ({ funHome }) => {
  const { state, dispatch } = useGeneralContext();
  const [minutosInicialPre, setMinutosInicialPre] = useState(
    state.time.Pre.minutos
  );
  const [segundosInicialPre, setSegundosInicialPre] = useState(
    state.time.Pre.segundos
  );
  const [minutosInicialOpen, setMinutosInicialOpen] = useState(
    state.time.Open.minutos
  );
  const [segundosInicialOpen, setSegundosInicialOpen] = useState(
    state.time.Open.segundos
  );
  const [isChecked, setIsChecked] = useState(state.market.auto);
  const [newsSpeed, setNewsSpeed] = useState(2);
  const [newsShow, setNewsShow] = useState(state.show.cantidadNews);
  const [marketSpeed, setMarketSpeed] = useState(state.market.intervaloMaximo);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleAccept = () => {
    const options = {
      arrayMarketTimes: [
        minutosInicialPre,
        segundosInicialPre,
        minutosInicialOpen,
        segundosInicialOpen,
      ],
      marketAuto: isChecked,
      marketSpeed,
      newsSpeed,
      newsShow,
    };
    dispatch({
      type: A.OPTIONS,
      options,
    });
    funHome();
  };

  return (
    <div className="options-container">
      <h2>Options</h2>
      <div className="input-group-main">
        <div className="input-group-sub"></div>
        <div className="input-group-sub">
          <div className="input-group-min market-auto">
            <h3>Market auto</h3>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="marketSpeed">Speed</label>
            <select
              id="speedMarket"
              value={marketSpeed}
              onChange={(e) => setMarketSpeed(Number(e.target.value))}
            >
              <option value={1}>Slow</option>
              <option value={2}>Normal</option>
              <option value={3}>Fast</option>
              <option value={4}>Crazy</option>
            </select>
          </div>
          <div className="input-group-min pre-market">
            <h3>Pre-market duration</h3>
            <label htmlFor="minutosInicialPre">Min:</label>
            <select
              id="minutosInicialPre"
              value={minutosInicialPre}
              onChange={(e) => setMinutosInicialPre(Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
            <label htmlFor="segundosInicialPre">Seg:</label>
            <select
              id="segundosInicialPre"
              value={segundosInicialPre}
              onChange={(e) => setSegundosInicialPre(Number(e.target.value))}
            >
              <option value={0}>00</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
            </select>
          </div>
          <div className="input-group-min open-market">
            <h3>Open market duration</h3>
            <label htmlFor="minutosInicialOpen">Min:</label>
            <select
              id="minutosInicialOpen"
              value={minutosInicialOpen}
              onChange={(e) => setMinutosInicialOpen(Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
            <label htmlFor="segundosInicialOpen">Seg:</label>
            <select
              id="segundosInicialOpen"
              value={segundosInicialOpen}
              onChange={(e) => setSegundosInicialOpen(Number(e.target.value))}
            >
              <option value={0}>00</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
            </select>
          </div>
        </div>
        <div className=" input-group-min news-options">
          <h3>News</h3>
          <label htmlFor="newsGenerationSpeed">Generation</label>
          <select
            id="speedNews"
            value={newsSpeed}
            onChange={(e) => setNewsSpeed(Number(e.target.value))}
          >
            <option value={1}>Slow</option>
            <option value={2}>Normal</option>
            <option value={3}>Fast</option>
            <option value={4}>Crazy</option>
          </select>
          <label htmlFor="newsShow">Show</label>
          <select
            id="cantidadNews"
            value={newsShow}
            onChange={(e) => setNewsShow(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
};

export default Options;
