import React from "react";
import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import "../../Stylesheets/Trade.css";

const Trade = ({ name, sentimentChange }) => {
  const { state, dispatch } = useGeneralContext();
  const industry = state.industry[name];

  const handleCompraventa = (event) => {
    const rect = event.target.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const buttonHeight = rect.height;

    if (clickY < buttonHeight / 2) {
      dispatch({ type: A.TRADE.cantidad, valor: 1 });
    } else {
      dispatch({ type: A.TRADE.cantidad, valor: -1 });
    }
    console.log(state.focus);
  };
  const changeLiquidity = () => {
    dispatch({ type: A.MODIFICAR.LIQUIDITY });
  };

  const tradeAccept = () => {
    dispatch({ type: A.TRADE.accept });
  };

  const finishTrade = () => {
    dispatch({ type: A.TRADE.finish });
    dispatch({ type: A.SHOW.trade, show: false });
  };

  return (
    <div className={`trade-main-div color-${name}`}>
      <h1 className="titulo-trade">{name} Trade</h1>
      <button
        className={`trade-sentiment-btn color-${industry.sentiment}`}
        onClick={sentimentChange}
      >
        {industry.sentiment}
      </button>
      <p className="trade-price-p">Price= ${industry.price}</p>
      <h3 className="trade-cash-h3">${state.trade.costoTransaccion}</h3>

      <button
        className="trade-escape-btn btn-scape"
        onClick={() => finishTrade()}
      >
        X
      </button>
      <button
        className={`compraventa-btn color-${state.trade.posicion}`}
        onClick={(e) => handleCompraventa(e)}
      >
        <p>{state.trade.posicion}</p>
        <p>
          {state.trade.cantidad > 0
            ? state.trade.cantidad
            : state.trade.cantidad * -1}
        </p>
      </button>
      <div className="liquidity-div">
        <h2>Liquidity</h2>
        <p className="cantidad-liq">{state.liq.total}</p>
        <button className="add-liq-btn" onClick={() => changeLiquidity()}>
          ADD
        </button>
      </div>
      <button
        className={`trade-accept-btn ${
          state.trade.cantidad !== 0 ? `button-aura` : ``
        }`}
        onClick={() => tradeAccept()}
      >
        Accept
      </button>
      <div className="trade-flow">
        <div>
          <h3>Cashflow:</h3>
          <h3 className="flow-value">{state.trade.cashFlow}</h3>
        </div>
        <div>
          <h3>Stockflow:</h3>
          <h3 className="flow-value">{state.trade.stockFlow}</h3>
        </div>
      </div>
    </div>
  );
};

export default Trade;
