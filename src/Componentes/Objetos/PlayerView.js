import React from "react";
import Industry from "./Industry";
import "../../Stylesheets/PlayerView.css";
//Renderizar industrias solo si trade no esta activo. Dejar over-industry

const PlayerView = ({ funHome }) => {
  return (
    <div className="main-industry-div">
      <div className="div-over-industry">
        <button className="ronda">Round</button>
        <button className="btn-over-industry">Available Cash: $xxxx</button>
        <button className="btn-over-industry">Total Capital: $xxxx</button>
        <button className="btn-over-industry">Orders</button>
        <button className="btn-scape" onClick={funHome}>
          X
        </button>
      </div>
      <div className="div-industries">
        <Industry name="Tech" />
        <Industry name="Health" />
        <Industry name="Energy" />
      </div>
    </div>
  );
};
export default PlayerView;
