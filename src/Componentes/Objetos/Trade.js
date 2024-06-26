import { React, useState, useRef, useEffect } from "react";
import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import Stops from "./Stops";
import "../../Stylesheets/Trade.css";
import { clear } from "@testing-library/user-event/dist/clear";

const Trade = ({ name, sentimentChange }) => {
  const { state, dispatch } = useGeneralContext();
  const [isTrading, setIsTrading] = useState(false);
  const industry = state.industry[name];
  const strade = state.trade;
  const intervalIdRef = useRef(null);
  const duracionIntervaloRef = useRef(1000);

  const stateRef = useRef(state);
  const stradeRef = useRef(strade);
  const industryRef = useRef(industry);

  useEffect(() => {
    stateRef.current = state;
    stradeRef.current = strade;
    industryRef.current = industry;
  }, [state, strade, industry]);

  const handleCompraventa = (event) => {
    const rect = event.target.getBoundingClientRect();
    const clickY = event.clientY - rect.top;
    const buttonHeight = rect.height;

    if (clickY < buttonHeight / 2) {
      dispatch({ type: A.TRADE.cantidad, valor: strade.cantidad > 0 ? 5 : 1 });
    } else {
      dispatch({
        type: A.TRADE.cantidad,
        valor: strade.cantidad < 0 ? -5 : -1,
      });
    }
    console.log(state.focus);
  };

  const changeLiquidity = () => {
    dispatch({ type: A.MODIFICAR.LIQUIDITY });
  };

  const tradeAccept = () => {
    const cantidad =
      strade.cantidad < 0 ? strade.cantidad * -1 : strade.cantidad;
    duracionIntervaloRef.current = Math.min(100 + cantidad * 3, 2000);
    setIsTrading(!isTrading);
  };

  useEffect(() => {
    if (isTrading) {
      intervalIdRef.current = setInterval(() => {
        const { cash } = stateRef.current;
        const { costoTransaccion, cashFlow, stockFlow, cantidad } =
          stradeRef.current;
        const { price, quantity } = industryRef.current;

        const limiteCompra = cash + (costoTransaccion + cashFlow) < 0;
        const totalCantidadTrade = costoTransaccion / price + stockFlow * -1;
        const limiteVenta = cantidad < 0 && totalCantidadTrade > quantity;
        const stopsArray = [
          ...stateRef.current.industry[stateRef.current.focus].stops,
        ];
        const stopActual = stopsArray.includes(price);

        if (limiteCompra) {
          window.alert(`You don't have enough money, go get a job!`);
          setIsTrading(false);
          clearInterval(intervalIdRef.current);
        } else if (limiteVenta) {
          window.alert(
            `You're trying to sell more than you have! There aren't loans in the game...yet`
          );
          setIsTrading(false);
          clearInterval(intervalIdRef.current);
        } else if (cantidad === 0) {
          setIsTrading(false);
          clearInterval(intervalIdRef.current);
        } else if (stopActual) {
          dispatch({ type: A.MODIFICAR.LIQUIDITY });
          dispatch({ type: A.TRADE.clearStops, objetivo: price });
          setIsTrading(false);
          clearInterval(intervalIdRef.current);
        } else {
          dispatch({ type: A.TRADE.accept });
        }
      }, duracionIntervaloRef.current);
    } else {
      clearInterval(intervalIdRef.current);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isTrading, dispatch]);

  const finishTrade = () => {
    setIsTrading(false);
    dispatch({ type: A.TRADE.finish });
    dispatch({ type: A.TRADE.clearStops, objetivo: "all" });
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

        <Stops />
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
