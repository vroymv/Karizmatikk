import React, { createContext, useContext, useState, useEffect } from "react";
import { getNumberOfPendingOrders, requestAuth } from "../lib/Node/api";
import { getLanguage, getTheme } from "@/lib/Storage";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [numberOrders, setnumberOrders] = useState(0);
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");

  async function checkAuth() {
    try {
      setAuthIsLoading(true);
      const user = await requestAuth();

      if (user) {
        setIsAuthenticated(true);
        setUserInfo(user);
        const numberOfPendingOrders = await getNumberOfPendingOrders(user._id);
        setnumberOrders(numberOfPendingOrders);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAuthIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
    async function getLangAndTheme() {
      const lang = await getLanguage();
      const theme = await getTheme();
      setLang(lang || "en");
      setTheme(theme || "light");
    }
    getLangAndTheme();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        authIsLoading,
        setAuthIsLoading,
        userInfo,
        setUserInfo,
        isAuthenticated,
        setIsAuthenticated,
        numberOrders,
        setnumberOrders,
        checkAuth,
        lang,
        setLang,
        theme,
        setTheme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
