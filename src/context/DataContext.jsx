import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const DataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState([]);

  // make a common use fetch function
  async function fetchData({
    endpoint = "",
    method = "GET",
    query = "",
    body = null,
  }) {
    const token = Cookies.get("token");
    if (!token) {
      setData([]);
      return;
    }

    try {
      const apiUrl = `https://mad9124backendfinal.onrender.com/api/${endpoint}?query=${encodeURIComponent(
        query
      )}`;

      const res = await fetch(apiUrl, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: method !== "GET" && body ? JSON.stringify(body) : null,
      });

      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    }
  }

  return (
    <DataContext.Provider value={{ data, setData, fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside <DataProvider>");
  return context;
}

export { useData, DataProvider };
