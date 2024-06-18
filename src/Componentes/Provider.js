import { useGeneralReducer } from "./MainReducer";
import React, { useContext, useEffect } from "react";
import { A } from "./Organizador";
import { type } from "@testing-library/user-event/dist/type";

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
  //useEffect que se active solo una vez al comienzo
  useEffect(() => {
    dispatch({ type: A.INIT });
  }, []);
  useEffect(() => {
    if (stech.historial.length < 6) {
    } else {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Tech" });
    }
  }, [stech.price]);
  useEffect(() => {
    if (stech.historial.length < 6) {
    } else {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Health" });
    }
  }, [shealth.price]);
  useEffect(() => {
    if (stech.historial.length < 6) {
    } else {
      dispatch({ type: A.HISTORIALDINAMICO, ind: "Energy" });
    }
  }, [senergy.price]);
  useEffect(() => {
    console.log(`Show trade = ${st}`);
  }, [st]);

  // crea 3 useEffect, uno por cada industria, que se ejecuten cuando su quantity o precio se modifiquen y que ejecuten el dispatch con type A.TOTALCAPINDIVIDUAL con name: nombre de la industria
  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Tech" });
  }, [stech.price, stech.quantity]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Health" });
  }, [shealth.price, shealth.quantity]);

  useEffect(() => {
    dispatch({ type: A.TOTALCAPINDIVIDUAL, name: "Energy" });
  }, [senergy.price, senergy.quantity]);

  // calculo del total cap desde cada totalcapindividual
  useEffect(() => {
    dispatch({ type: A.TOTALCAP });
  }, [stech, shealth, senergy, state.cash]);

  // calculo de liquidez sentiment
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

  //costo de transaccion
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

  return (
    <div>
      <generalContext.Provider value={{ state, dispatch }}>
        {children}
      </generalContext.Provider>
    </div>
  );
};
