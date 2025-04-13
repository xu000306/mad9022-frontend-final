import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function SearchForm(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchData, setData, data } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchData({
      method: "GET",
      req: `?query=${searchQuery}`,
    }).then((res) => {
      setData(res);
      //clear input, async anyway
      setSearchQuery("");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
