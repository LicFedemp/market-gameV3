import { useGeneralReducer } from "./MainReducer";
import React, { useContext, useEffect } from "react";
import { A } from "./Organizador";

const generalContext = React.createContext();

export const useGeneralContext = () => {
  return useContext(generalContext);
};

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useGeneralReducer();

  const st = state.show.trade;
  const stech = state.industry.Tech;
  const shealth = state.industry.Health;
  const senergy = state.industry.Energy;

  useEffect(() => {
    dispatch({ type: A.INIT });
  }, []);

  useEffect(() => {
    if (stech.historial.length >= 6) {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Tech" });
    }
  }, [stech.price]);

  useEffect(() => {
    if (shealth.historial.length >= 6) {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Health" });
    }
  }, [shealth.price]);

  useEffect(() => {
    if (senergy.historial.length >= 6) {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Energy" });
    }
  }, [senergy.price]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Tech" });
  }, [stech.price, stech.quantity]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Health" });
  }, [shealth.price, shealth.quantity]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Energy" });
  }, [senergy.price, senergy.quantity]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAP });
  }, [stech, shealth, senergy, state.cash]);

  useEffect(() => {
    dispatch({ type: A.LIQ.SENTIMENT });
  }, [
    state.focus,
    state.trade.posicion,
    senergy.sentiment,
    shealth.sentiment,
    stech.sentiment,
  ]);

  useEffect(() => {
    dispatch({ type: A.LIQ.TOTAL });
  }, [state.liq.sentimiento, state.liq.adicional]);

  useEffect(() => {
    dispatch({ type: A.TRADE.costo });
  }, [
    state.liq.total,
    state.industry[state.focus].price,
    state.trade.cantidad,
  ]);

  useEffect(() => {
    dispatch({ type: A.IMPACTONEWS, listaNews: state.news });
  }, [
    stech.historial,
    stech.price,
    stech.sentiment,
    shealth.historial,
    shealth.price,
    shealth.sentiment,
    senergy.historial,
    senergy.sentiment,
  ]);

  useEffect(() => {
    dispatch({ type: A.TRADE.finish });
  }, []);

  const marketIntervaloMin = state.market.intervaloMinimo;
  const marketIntervaloMax = Math.floor(
    (state.time.Open.minutos * 60 * 1000 + state.time.Open.segundos * 1000) /
      state.market.intervaloMaximo
  );

  useEffect(() => {
    if (state.market.auto) {
      let interval;
      const executeAction = () => {
        if (state.time.Open.flag) {
          dispatch({ type: A.MARKET.ejecucion });
          const randomInterval =
            Math.random() * (marketIntervaloMax - marketIntervaloMin) +
            marketIntervaloMin;
          interval = setTimeout(executeAction, randomInterval);
        }
      };

      if (state.time.Open.flag) {
        executeAction();
      }

      return () => clearTimeout(interval);
    }
  }, [state.time.Open.flag, dispatch]);

  return (
    <generalContext.Provider value={{ state, dispatch }}>
      {children}
    </generalContext.Provider>
  );
};
