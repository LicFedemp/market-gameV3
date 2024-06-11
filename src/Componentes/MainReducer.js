import { useReducer } from "react";
import { A } from "./Organizador";

const estadoInicial = {};

const reducer = (state, action) => {
  switch (action.type) {
    case A.TEST:
      return { ...state };

    default:
      return { ...state };
  }
};

export const useGeneralReducer = () => {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  return [state, dispatch];
};
