import { useState, React } from "react";
import Trade from "./Trade";

const Industry = ({ name }) => {
  const [trade, setTrade] = useState(false);

  const sentChange = () => {
    console.log("El sentimiento ha cambiado");
  };
  return (
    <div className="ind-global-div">
      {!trade && (
        <div className="ind-main-div">
          <div className="ind-superior-div">
            <h1 className="ind-name">{name}</h1>
            <button className="ind-sentiment">Sentiment</button>
          </div>
          <div className="ind-sec-div">
            <button className="detail-ind-btn">Price:{}</button>
            <button className="detail-ind-btn">Quatity:{}</button>
            <h3>$xxxx</h3>
          </div>
          <button className="trade-button" onClick={() => setTrade(true)}>
            TRADE
          </button>
        </div>
      )}

      {trade && (
        <Trade
          name={name}
          sentimentChange={() => sentChange()}
          close={() => setTrade(false)}
        />
      )}
    </div>
  );
};

export default Industry;
