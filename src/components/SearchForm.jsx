import React, { useState } from "react";
import { useData } from "../context/DataContext";
import styles from "./searchForm.module.css";

export default function SearchForm(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchData, setData, data } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    //set loading
    props.setLoading(true);
    fetchData({
      method: "GET",
      req: `?query=${searchQuery}`,
    }).then((res) => {
      setData(res);
      //clear input, async anyway
      props.setLoading(false);
      setSearchQuery("");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        className={styles.searchBar}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit" className={styles.btn}>
        Search
      </button>
    </form>
  );
}
