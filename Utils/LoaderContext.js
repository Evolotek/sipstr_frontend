import React, { createContext, useState, useContext, useEffect } from "react";
import Loader from "../components/Loader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🔄 Loader state changed:", loading);
  }, [loading]);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      <Loader visible={loading} />
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
