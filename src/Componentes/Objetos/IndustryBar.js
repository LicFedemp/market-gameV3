import { useGeneralContext } from "../Provider";
import { A, arrayVolatility } from "../Organizador";
import "../../Stylesheets/IndustryBar.css";

const IndustryBar = ({ name }) => {
  const { state, dispatch } = useGeneralContext();
  const industria = state.industry[name];

  const sentChange = () => {
    dispatch({ type: A.SENTIMENT, name });
  };

  const changePrice = () => {
    dispatch({ type: A.MODIFICAR.PRICE, name });
  };

  return (
    <div className={`div-main-industrybar color-${name}`}>
      <h1 className="title-industrybar">{name}</h1>
      <button onClick={() => changePrice()}>{industria.price}</button>
      <button
        onClick={() => sentChange()}
        className={`ind-sentiment color-${industria.sentiment}`}
      >
        {industria.sentiment}
      </button>
      <div>
        <p>Volatility: {arrayVolatility[industria.volatility]}</p>
        <p>Direction: {industria.direction}</p>
      </div>
    </div>
  );
};

export default IndustryBar;
