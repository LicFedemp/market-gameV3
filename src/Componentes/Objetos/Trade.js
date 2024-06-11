const Trade = ({ name, sentimentChange, close }) => {
  return (
    <div className="trade-main-div">
      <div className="trade-superior-div">
        <h1>{name}</h1>
        <button onClick={sentimentChange}>Sentiment</button>
        <p>Price= $xxx</p>
        <button className="btn-scape" onClick={close}>
          X
        </button>
      </div>
      <div className="trade-central-div">
        <button className="compraventa-btn">compraventa</button>
        <div className="liquidity-div">
          <h2>Liquidity</h2>
          <p className="cantidad-liq">N</p>
          <button className="add-liq">add+</button>
        </div>
        <div className="trade-right-div">
          <h3>Cash:{}</h3>
          <button className=""></button>
          <h3>Cashflow:{}</h3>
          <h3>Stockflow:{}</h3>
        </div>
      </div>
    </div>
  );
};

export default Trade;
