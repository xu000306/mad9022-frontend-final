import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Home.module.css";
import { useData, DataProvider } from "../context/DataContext";
import SearchForm from "../components/SearchForm";
import { Link } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(false);

  //get data from data provider;
  const items = useData().data;
  console.log("items", items);
  // if (!items || items.length === 0) {
  //   return <p>No data available, Please login!</p>;
  // }

  return (
    <div className={styles.crapPage}>
      <h1 className={styles.pageTitle}>Available Items</h1>
      <SearchForm setLoading={setLoading}></SearchForm>
      <div className={styles.searchSummary}></div>

      {loading ? (
        <div className={styles.loading}>Loading items...</div>
      ) : items?.length > 0 ? (
        <div className={styles.itemsGrid}>
          {items.map((item) => (
            <div key={item._id} className={styles.itemCard}>
              <div className={styles.itemImage}>
                <img src={item.images[0]} alt={item.title} />
              </div>
              <div className={styles.itemContent}>
                <h2 className={styles.itemTitle}>{item.title}</h2>
                <p className={styles.itemDescription}>{item.description}</p>
                {/* <a href={`/crap/${item._id}`} className={styles.viewButton}>
                  View Details
                </a> */}
                <Link to={`/crap/${item._id}`} className={styles.viewButton}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No items found matching your search criteria.</p>
          <p>Try adjusting your search terms or increasing the distance.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
