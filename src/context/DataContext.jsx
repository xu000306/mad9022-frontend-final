import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const DataContext = createContext();
//if my crap function
function checkIfMyCrap(token, crapDetail) {
  if (token && crapDetail) {
    //check if my crap
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const userId = JSON.parse(payloadJson).id;
    console.log(userId, "||", crapDetail.owner?._id);

    if (userId === crapDetail.owner?._id) {
      return true;
    }
    return false;
  }
}
//check if I am the buyer
function checkIfIAmBuyer(token, crapDetail) {
  if (token && crapDetail) {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const userId = JSON.parse(payloadJson).id;
    console.log(userId, "||", "buyer", crapDetail?.buyer?._id);

    if (userId === crapDetail?.buyer?._id) {
      return true;
    }
    return false;
  }
}

function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [notice, setNotice] = useState(false);

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

  //when my crap has status : interested, agreed and not my crap has scheduled ,add notice
  const token = Cookies.get("token");
  useEffect(() => {
    const getNotice = async () => {
      const data = await fetchData({ method: "GET", req: "mine" });
      if (data && data?.length > 0) {
        console.log("shit", data);
        const filterData = data.filter((details) => {
          let isMine = checkIfMyCrap(token, details);
          let isBuyer = checkIfIAmBuyer(token, details);
          console.log(details.status);

          if (
            isMine &&
            (details.status === "INTERESTED" || details.status === "AGREED")
          ) {
            return true;
          }
          if (isBuyer && details.status === "SCHEDULED") {
            return true;
          }
          return false;
        });
        console.log(filterData);

        if (filterData.length > 0) {
          console.log("notice content", filterData);

          setNotice(filterData);
        }
      }
    };
    getNotice();
  }, [token]);

  return (
    <DataContext.Provider value={{ data, setData, fetchData, notice }}>
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
