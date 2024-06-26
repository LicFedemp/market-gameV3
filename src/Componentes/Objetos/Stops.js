import { A } from "../Organizador";
import { useGeneralContext } from "../Provider";
import "../../Stylesheets/Stops.css";

const Stops = () => {
  const { state, dispatch } = useGeneralContext();

  const handleStops = (accion) => {
    if (accion === `add`) {
      let newStop;
      while (true) {
        const input = prompt("Ingrese el stop");
        newStop = parseInt(input, 10);
        if (isNaN(newStop)) {
          break; // Sal del bucle si la entrada no es un número válido
        }
        dispatch({ type: A.TRADE.stops, stop: newStop });
      }
    } else if (accion === `clearAll`) {
      dispatch({ type: A.TRADE.clearStops, objetivo: "all" });
    }
  };

  const showStops = () => {
    const listaStops = [...state.industry[state.focus].stops];
    const renderStops = (
      <ul>
        {listaStops.map((stop, index) => (
          <li key={index}>{stop}</li>
        ))}
      </ul>
    );
    return renderStops;
  };
  return (
    <div className="div-main-stops">
      <h1>Stops</h1>
      <button onClick={() => handleStops(`add`)}>+</button>
      <button onClick={() => handleStops(`clearAll`)}>Clear</button>
      {showStops()}
    </div>
  );
};

export default Stops;
