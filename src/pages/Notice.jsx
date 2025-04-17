import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Notice.module.css";
import { useData, DataProvider } from "../context/DataContext";

export default function Notice() {
  const { notice } = useData();
  console.log(notice);

  return (
    <div>
      <h3>
        These items require your actons ,please check My Crap page for details:
      </h3>
      {notice?.length > 0 ? (
        notice.map((item) => (
          <p key={item._id}>
            Crap: {item.title} in status {item.status} require your response!
          </p>
        ))
      ) : (
        <h4>Nothing update!</h4>
      )}
    </div>
  );
}
