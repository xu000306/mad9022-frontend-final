import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const DataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState([]);

  // make a common use fetch function
  async function fetchData({
    method = "POST",
    req = "",
    body = null,
    headers = null,
  }) {
    const token = Cookies.get("token");
    if (!token) {
      console.log("get token from cookie failed!");

      return;
    }

    try {
      //const apiUrl = `https://mad9124backendfinal.onrender.com/api/crap/${req}`;

      const apiUrl = `http://localhost:5000/api/crap/${req}`;

      const res = await fetch(apiUrl, {
        method,
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: method !== "GET" && body ? JSON.stringify(body) : null,
      });

      if (!res.ok) console.error("Fetch failed");
      const json = await res.json();
      console.log("data from fetch", json);

      return json?.data;
    } catch (err) {
      console.error("Error fetching data:", err);
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
