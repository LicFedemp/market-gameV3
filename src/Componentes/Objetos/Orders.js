import CreateOrder from "./CreateOrder";
import OrderBar from "./OrderBar";
import { useState } from "react";
import "../../Stylesheets/Orders.css";
import { useGeneralContext } from "../Provider";

const Orders = ({ funHome }) => {
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  const { state, dispatch } = useGeneralContext();

  const ordenList = () => {
    const listaMarket = state.ordenes.market;
    const lista = listaMarket.map((orden, index) => {
      const { nombre, posicion, cantidad } = orden;
      return (
        <OrderBar
          key={index}
          id={index}
          industria={nombre}
          posicion={posicion}
          cantidad={cantidad}
        />
      );
    });
    return lista;
  };
  return (
    <div className="orders-main-div">
      <div className="orders-heading">
        <button
          className="orders-add-button"
          onClick={() => setOpenCreateOrder(!openCreateOrder)}
        >
          {openCreateOrder ? "X" : "+"}
        </button>
        <h1>ORDERS</h1>
        <button className="btn-scape" onClick={funHome}>
          X
        </button>
      </div>
      {openCreateOrder && <CreateOrder />}

      <div className="orders-list">{ordenList()}</div>
    </div>
  );
};

export default Orders;
