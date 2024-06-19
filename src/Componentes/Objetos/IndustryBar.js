import { useGeneralContext } from "../Provider";
import { A, arrayVolatility } from "../Organizador";
import "../../Stylesheets/IndustryBar.css";
import { useEffect, useState } from "react";

const IndustryBar = ({ name }) => {
  const { state, dispatch } = useGeneralContext();
  const [variacion, setVariacion] = useState(0);

  const industria = state.industry[name];

  const sentChange = () => {
    dispatch({ type: A.SENTIMENT, name });
  };

  const changePrice = () => {
    dispatch({ type: A.MODIFICAR.PRICE, name });
  };

  const setColorPrice = () => {
    const historial = industria.historial;
    const lastIndex = historial.length - 1;
    const secondLastIndex = historial.length - 2;
    if (historial[lastIndex] > historial[secondLastIndex]) {
      return "green";
    } else if (historial[lastIndex] < historial[secondLastIndex]) {
      return "red";
    } else {
      return "black";
    }
  };

  const definirVariacion = () => {
    const historial = industria.historial;
    const actualPrice = industria.price;
    const secondLastIndex = historial.length - 2;
    const variacion = Math.floor(
      ((actualPrice - historial[secondLastIndex]) /
        historial[secondLastIndex]) *
        100
    );

    setVariacion(variacion);
  };
  useEffect(() => {
    definirVariacion();
  }, [industria.price]);

  return (
    <div className={`div-main-industrybar color-${name}`}>
      <h1 className="title-industrybar">{name}</h1>
      <button
        className="price-industrybar"
        style={{ color: setColorPrice() }}
        onClick={() => changePrice()}
      >
        <p className="price-actual-industryBar">{industria.price}</p>
        <p className="variacion-industryBar">{`${
          variacion > 0 ? "+" : ""
        }${variacion}%`}</p>
      </button>
      <button
        onClick={() => sentChange()}
        className={`ind-sentiment-industryBar color-${industria.sentiment}`}
      >
        {industria.sentiment.charAt(0)}
      </button>
      <div className="vol-dir-industryBar">
        <p>Volatility: {arrayVolatility[industria.volatility]}</p>
        <p>Direction: {industria.direction}</p>
      </div>
    </div>
  );
};

export default IndustryBar;
