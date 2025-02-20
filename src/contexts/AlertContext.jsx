import { createContext, useState, useContext } from "react";

const AlertContext = createContext();

function AlertProvider({ children }) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const providerValue = { error, message, setError, setMessage };

  return (
    <AlertContext.Provider value={providerValue}>
      {children}
    </AlertContext.Provider>
  );
}

function useAlertContext() {
  return useContext(AlertContext);
}

export { AlertProvider, useAlertContext };
