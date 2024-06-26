import "../../Stylesheets/OrderBar.css";
import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import { useEffect } from "react";
const OrderBar = ({ id, industria, posicion, cantidad }) => {
  const { state, dispatch } = useGeneralContext();
  const ejecutarOrden = () => {
    dispatch({ type: A.SHOW.trade, show: true, name: industria });
    dispatch({ type: A.MODIFICAR.FOCUS, name: industria });
    dispatch({
      type: A.ORDENES.ejecutar,
      indice: id,
      ind: industria,
      position: posicion,
      cant: cantidad,
    });
    dispatch({ type: A.SHOW.ordenes, show: false });
  };
  useEffect(() => {
    console.log(`id = ${id}`);
  }, []);
  return (
    <div key={id} className="orderbar-main-div">
      <p>{industria}</p>
      <p>{posicion}</p>
      <p>{cantidad}</p>
      <button>View</button>
      <button onClick={() => ejecutarOrden()}>GO</button>
    </div>
  );
};

export default OrderBar;
