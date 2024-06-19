import "../../Stylesheets/MarketManager.css";
import { useGeneralContext } from "../Provider";
import { A, industryName } from "../Organizador";
import PriceHistoryChart from "./PriceHistoryChart";
import IndustryBar from "./IndustryBar";
import NewsFilter from "./NewsFilter";

const MarketManager = ({ funHome }) => {
  const { state, dispatch } = useGeneralContext();

  const passRound = (manager, update) => {
    dispatch({ type: A.RONDA, manager: manager, update: update });
  };
  const showNews = (bool) => {
    dispatch({ type: A.SHOW.news, show: bool });
  };

  return (
    <div className="div-main-manager">
      <div className="div-over-manager">
        <button
          className="ronda"
          onClick={() => {
            passRound(true, false);
          }}
        >
          Round {state.ronda}
        </button>
        <button
          onClick={() => {
            passRound(false, true);
          }}
        >
          UpdatePrices
        </button>
        {/* <button onClick={() => showNews(true)}>News</button> */}
        <IndustryBar name={industryName.Tech} />
        <IndustryBar name={industryName.Health} />
        <IndustryBar name={industryName.Energy} />
        <button onClick={funHome} className="btn-scape">
          X
        </button>
      </div>
      <div className="chart-container">
        <PriceHistoryChart />
      </div>
      <NewsFilter />
    </div>
  );
};

export default MarketManager;
