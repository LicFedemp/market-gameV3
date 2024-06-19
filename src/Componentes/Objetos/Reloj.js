import { useGeneralContext } from "../Provider";
import { A } from "../Organizador";
import "../../Stylesheets/Reloj.css";
import { useState, useEffect, useCallback } from "react";

const Reloj = ({ nombre }) => {
  const { state, dispatch } = useGeneralContext();
  const fase = state.time[nombre];
  const minutosInicial = fase.minutos;
  const segundosInicial = fase.segundos;
  const flag = fase.flag;
  const [minutes, setMinutes] = useState(minutosInicial);
  const [seconds, setSeconds] = useState(segundosInicial);

  useEffect(() => {
    let countdown;
    if (flag) {
      countdown = setInterval(() => {
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
    }
    return () => clearInterval(countdown);
  }, [minutes, seconds, flag]);

  useEffect(() => {
    if (flag) {
      setMinutes(minutosInicial);
      setSeconds(segundosInicial);
    }
  }, [flag, minutosInicial, segundosInicial]);

  useEffect(() => {
    if (seconds === 0 && minutes === 0) {
      if (nombre === "Pre") {
        dispatch({ type: A.TIME.pausePlay, nombre: "Open", flag: true });
        dispatch({ type: A.TIME.pausePlay, nombre: "Pre", flag: false });
        setMinutes(minutosInicial);
        setSeconds(segundosInicial);
      } else if (nombre === "Open") {
        dispatch({ type: A.RONDA, manager: true, update: false });
        dispatch({ type: A.TIME.pausePlay, nombre: "Open", flag: false });
        setMinutes(minutosInicial);
        setSeconds(segundosInicial);
      }
    }
  }, [seconds, minutes, nombre, dispatch, minutosInicial, segundosInicial]);

  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  const handleClock = useCallback(() => {
    dispatch({ type: A.TIME.pausePlay, nombre, flag: !flag });
  }, [dispatch, flag, nombre]);

  return (
    <div className="main-div-clock">
      <h1>{nombre}-market</h1>
      <button onClick={handleClock} className="digital-clock">
        <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
      </button>
    </div>
  );
};

export default Reloj;
