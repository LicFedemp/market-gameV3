import React from "react";
import Industry from "./Industry";
import "../../Stylesheets/PlayerView.css";
import { useGeneralContext } from "../Provider";
import { A, industryName } from "../Organizador";

const PlayerView = ({ funHome }) => {
  const { state, dispatch } = useGeneralContext();
  const passRound = () => {
    dispatch({ type: A.RONDA });
  };

  return (
    <div className="main-industry-div">
      <div className="div-over-industry">
        <button
          className="ronda"
          onClick={() => {
            passRound();
          }}
        >
          Round {state.ronda}
        </button>
        <button className="btn-over-industry">
          Available Cash: ${state.cash}
        </button>
        <button className="btn-over-industry">
          Total Capital: ${state.totalCap}
        </button>
        <button className="btn-over-industry">Orders</button>
        <button className="btn-scape" onClick={funHome}>
          X
        </button>
      </div>

      <div className="div-industries">
        <Industry name={industryName.Tech} />
        <Industry name={industryName.Health} />
        <Industry name={industryName.Energy} />
      </div>
    </div>
  );
};

export default PlayerView;
