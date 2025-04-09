import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    return match ? match[2] : null;
  };

  const fetchData = async () => {
    try {
      const crapApi = "https://mad9124backendfinal.onrender.com/api/crap/";
      let token = getTokenFromCookie();
      token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWI0ZGM0YzQ3M2NjMTdhY2E2MGQ0OSIsIm5hbWUiOiJUb20gWHUiLCJpYXQiOjE3NDM3ODQxMzQsImV4cCI6MTc0NjM3NjEzNH0.5sVuMF2V7EWm-94dvXLlwQeP1Do450lZ9BOUtFDWK7s";

      const res = await fetch(crapApi, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fetch failed");
      const json = await res.json();
      console.log(json);

      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

// custom hook for using context
export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside <DataProvider>");
  return context;
}
