import React, { useState, useEffect } from "react";
import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import Trade from "./Trade";
import "../../Stylesheets/Industry.css";

const Industry = ({ name }) => {
  const [trade, setTrade] = useState(false);
  const { state, dispatch } = useGeneralContext();
  const sh = state.show;
  const industry = state.industry[name];

  const sentChange = () => {
    dispatch({ type: A.SENTIMENT, name });
  };

  const changePrice = () => {
    dispatch({ type: A.MODIFICAR.PRICE, name });
  };

  const changeQuantity = () => {
    dispatch({ type: A.MODIFICAR.QUANTITY, name });
  };

  const showTrade = (show) => {
    dispatch({ type: A.SHOW.trade, show: show, name });
    dispatch({ type: A.MODIFICAR.FOCUS, name });
  };

  return (
    <div className="ind-global-div">
      {!sh.trade && (
        <div className={`ind-main-div color-${name}`}>
          <h1 className="ind-name">{name}</h1>
          <button
            className={`ind-sentiment color-${industry.sentiment}`}
            onClick={sentChange}
          >
            {industry.sentiment}
          </button>
          <button className="detail-ind-btn" onClick={() => changePrice()}>
            ${industry.price}
          </button>
          <button className="detail-ind-btn" onClick={() => changeQuantity()}>
            Q:{industry.quantity}
          </button>
          <h3>${industry.totalCapIndividual}</h3>
          <button className="trade-button" onClick={() => showTrade(true)}>
            TRADE
          </button>
        </div>
      )}
      {sh.trade && sh.tradeName === name && (
        <Trade name={name} sentimentChange={sentChange} />
      )}
    </div>
  );
};

export default Industry;
