import { useGeneralReducer } from "./MainReducer";
import React, { useContext } from "react";

const generalContext = React.createContext();

export const useGeneralContext = () => {
  return useContext(generalContext);
};

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useGeneralReducer();
  return (
    <div>
      <generalContext.Provider value={{ state, dispatch }}>
        {children}
      </generalContext.Provider>
    </div>
  );
};
