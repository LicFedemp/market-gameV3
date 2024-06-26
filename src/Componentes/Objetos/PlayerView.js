import React, { useState } from "react";
import Industry from "./Industry";
import "../../Stylesheets/PlayerView.css";
import { useGeneralContext } from "../Provider";
import { A, industryName } from "../Organizador";
import Orders from "./Orders";

const PlayerView = ({ funHome }) => {
  const { state, dispatch } = useGeneralContext();
  const [showOrders, setShowOrders] = useState(false);

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
        <button
          className="btn-over-industry"
          onClick={() => dispatch({ type: A.SHOW.ordenes, show: true })}
        >
          Orders
        </button>
        <button className="btn-scape" onClick={funHome}>
          X
        </button>
      </div>

      <div className="div-industries">
        <Industry name={industryName.Tech} />
        <Industry name={industryName.Health} />
        <Industry name={industryName.Energy} />
      </div>
      {state.show.ordenes && (
        <Orders
          funHome={() => dispatch({ type: A.SHOW.ordenes, show: false })}
        />
      )}
    </div>
  );
};

export default PlayerView;
