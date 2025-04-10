import React, { useState } from "react";
import { useData } from "../context/DataContext";

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchData } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData({
      endpoint: "crap",
      method: "GET",
      query: searchQuery,
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
