import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Crap.module.css";
import crapImage from "../assets/crap.svg";
import { useData, DataProvider } from "../context/DataContext";

function Crap() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const distance = searchParams.get("distance") || "10";

  //get data from data provider;
  const items = useData().data;
  console.log("items", items);

  return (
    <div className={styles.crapPage}>
      <h1 className={styles.pageTitle}>Available Items</h1>

      <div className={styles.searchSummary}>
        <p>
          Showing results for: {keyword ? `"${keyword}"` : "All items"}
          within {distance} km
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading items...</div>
      ) : items.length > 0 ? (
        <div className={styles.itemsGrid}>
          {items.map((item) => (
            <div key={item._id} className={styles.itemCard}>
              <div className={styles.itemImage}>
                <img src={item.images[0]} alt={item.title} />
              </div>
              <div className={styles.itemContent}>
                <h2 className={styles.itemTitle}>{item.title}</h2>
                <p className={styles.itemDescription}>{item.description}</p>
                <a href={`/crap/${item._id}`} className={styles.viewButton}>
                  View Details
                </a>
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

export default Crap;
