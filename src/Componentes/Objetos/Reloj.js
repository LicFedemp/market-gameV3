import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import "../../Stylesheets/Reloj.css";
import { useState, useEffect } from "react";
const Reloj = ({ nombre }) => {
  const { state, dispatch } = useGeneralContext();
  const fase = state.time[nombre];
  const minutosInicial = fase.minutos;
  const segundosInicial = fase.segundos;
  const flag = fase.flag;
  const [minutes, setMinutes] = useState(minutosInicial);
  const [seconds, setSeconds] = useState(segundosInicial);

  useEffect(() => {
    if (flag) {
      const countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(countdown);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [minutes, seconds, flag]);

  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  const handleClock = () => {
    dispatch({ type: A.TIME.pausePlay, nombre });
  };

  return (
    <div className="main-div-clock">
      <h1>{nombre}-market</h1>
      <button
        onClick={() => {
          handleClock();
        }}
        className="digital-clock"
      >
        <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
      </button>
    </div>
  );
};
export default Reloj;
