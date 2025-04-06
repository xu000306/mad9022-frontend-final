import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    distance: "10",
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/crap?keyword=${searchParams.keyword}&distance=${searchParams.distance}`
    );
  };

  return (
    <div className={styles.home}>
      <h2 className={styles.heading}>Welcome to HolyCrap</h2>
      <p className={styles.description}>
        Find items people are looking to get rid of!
      </p>

      <div className={styles.searchContainer}>
        <h3 className={styles.searchHeading}>Search for Items</h3>
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.formGroup}>
            <label htmlFor="keyword">Keyword</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              value={searchParams.keyword}
              onChange={handleChange}
              placeholder="What are you looking for?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="distance">Distance (km)</label>
            <select
              name="distance"
              id="distance"
              value={searchParams.distance}
              onChange={handleChange}
            >
              <option value="5">5km</option>
              <option value="10">10km</option>
              <option value="25">25km</option>
              <option value="50">50km</option>
            </select>
          </div>

          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
