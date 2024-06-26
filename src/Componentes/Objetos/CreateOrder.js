import { A, industryName, POSICION } from "../Organizador";
import { useState } from "react";
import "../../Stylesheets/CreateOrder.css";
import { useGeneralContext } from "../Provider";
const orderPrice = { market: "market", limit: "limit" };
const CreateOrder = () => {
  const { state, dispatch } = useGeneralContext();
  const [order, setOrder] = useState({
    id: 0,
    industryOrden: industryName.Tech,
    posicionOrden: POSICION.BUY,
    quantity: 0,
    type: orderPrice.market,
  });

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: A.ORDENES.nueva, orden: order });
    console.log(state.ordenes);
  };

  return (
    <form className={`create-order-form`} onSubmit={handleSubmit}>
      {/* <h3>New order</h3> */}
      <label>
        Industry:
        <select name="industryOrden" onChange={handleChange}>
          <option value={industryName.Tech}>{industryName.Tech}</option>
          <option value={industryName.Health}>{industryName.Health}</option>
          <option value={industryName.Energy}>{industryName.Energy}</option>
        </select>
      </label>
      <label>
        Position:
        <select name="posicionOrden" onChange={handleChange}>
          <option value={POSICION.BUY}>{POSICION.BUY}</option>
          <option value={POSICION.SELL}>{POSICION.SELL}</option>
        </select>
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={order.quantity}
          onChange={handleChange}
        />
      </label>
      <label>
        Price Type:
        <select name="type" onChange={handleChange}>
          <option value={orderPrice.market}>{orderPrice.market}</option>
          <option value={orderPrice.limit}>{orderPrice.limit}</option>
        </select>
      </label>

      <button type="submit">Crear</button>
    </form>
  );
};
export default CreateOrder;
