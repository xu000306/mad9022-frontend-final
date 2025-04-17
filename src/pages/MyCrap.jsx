import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./MyCrap.module.css";
import crapImage from "../assets/crap.svg"; // Default image for fallback

// Common fetch function
async function fetchData({
  endpoint = "",
  method = "GET",
  query = "",
  body = null,
  formData = null,
}) {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Not authenticated");
  }
  // Using hardcoded token for testing (replace with cookie-based token in production)

  try {
    const apiUrl = `http://localhost:5000/api/${endpoint}${
      query ? `?query=${encodeURIComponent(query)}` : ""
    }`;
    // const apiUrl = `https://mad9124backendfinal.onrender.com/api/${endpoint}${
    //   query ? `?query=${encodeURIComponent(query)}` : ""
    // }`;
    // Configure headers based on whether we're sending JSON or FormData
    const headers = {
      authorization: `Bearer ${token}`,
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!formData) {
      headers["Content-Type"] = "application/json";
    }

    const options = {
      method,
      headers,
      credentials: "include",
      // Use formData if provided, otherwise use JSON body if needed
      body:
        formData || (method !== "GET" && body ? JSON.stringify(body) : null),
    };

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw to let components handle errors
  }
}

function MyCrap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );

  // Status options
  const statusOptions = [
    { value: "all", label: "All Items" },
    { value: "AVAILABLE", label: "Available" },
    { value: "INTERESTED", label: "Interest Expressed" },
    { value: "SCHEDULED", label: "Pickup Scheduled" },
    { value: "AGREED", label: "Pickup Agreed" },
  ];

  // Check if user is authenticated
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login", { state: { from: "/mine" } });
    }
  }, [navigate]);

  // Fetch user's items
  // Fetch user's items
  useEffect(() => {
    async function getUserCrap() {
      try {
        setLoading(true);
        setError("");

        // Try to fetch from API
        try {
          const result = await fetchData({
            endpoint: "crap/mine", // Endpoint for user's items
            method: "GET",
          });

          console.log("result", result);
          //result && result.data && result.data.length > 0
          if (result?.data) {
            setItems(result.data);
            setLoading(false);
            return; // Exit early if we have data
          }
        } catch (err) {
          console.error("Error fetching from API:", err);
          // Continue to use mock data
        }
      } catch (err) {
        console.error("Error in getUserCrap:", err);
        setError("Failed to load your items. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getUserCrap();
  }, []);

  // Filter items based on status
  const filteredItems =
    statusFilter === "all"
      ? items
      : items.filter((item) => item.status === statusFilter);

  // Group items by status for display
  const groupedItems = {
    AVAILABLE: filteredItems.filter((item) => item.status === "AVAILABLE"),
    INTERESTED: filteredItems.filter((item) => item.status === "INTERESTED"),
    SUGGESTED: filteredItems.filter((item) => item.status === "SCHEDULED"),
    AGREED: filteredItems.filter((item) => item.status === "AGREED"),
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);

    // Update URL with status parameter
    navigate(`/mine?status=${status}`);
  };

  return (
    <div className={styles.myCrapPage}>
      <h1 className={styles.pageTitle}>My Crap</h1>

      <div className={styles.filterContainer}>
        <label htmlFor="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={handleStatusChange}
          className={styles.statusFilter}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading your items...</div>
      ) : filteredItems.length > 0 ? (
        <div className={styles.itemsContainer}>
          {statusFilter === "all" ? (
            // Show grouped by status when "all" is selected
            <>
              {Object.entries(groupedItems).map(
                ([status, items]) =>
                  items.length > 0 && (
                    <div key={status} className={styles.statusGroup}>
                      <h2 className={styles.statusTitle}>
                        {statusOptions.find((opt) => opt.value === status)
                          ?.label || status}
                      </h2>
                      <div className={styles.itemsGrid}>
                        {items.map((item) => (
                          <div key={item._id} className={styles.itemCard}>
                            <div className={styles.itemImage}>
                              <img
                                src={item.images[0] || crapImage}
                                alt={item.title}
                                onError={(e) => {
                                  e.target.src = crapImage;
                                }}
                              />
                            </div>
                            <div className={styles.itemContent}>
                              <h3 className={styles.itemTitle}>{item.title}</h3>
                              <p className={styles.itemDescription}>
                                {item.description}
                              </p>
                              <button
                                className={styles.viewButton}
                                onClick={() => navigate(`/crap/${item._id}`)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </>
          ) : (
            // Show simple grid when a specific status is selected
            <div className={styles.itemsGrid}>
              {filteredItems.map((item) => (
                <div key={item._id} className={styles.itemCard}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.images[0] || crapImage}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = crapImage;
                      }}
                    />
                  </div>
                  <div className={styles.itemContent}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <button
                      className={styles.viewButton}
                      onClick={() => navigate(`/crap/${item._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noItems}>
          <p>No items found with the selected filter.</p>
          {statusFilter !== "all" && (
            <button
              className={styles.resetButton}
              onClick={() => {
                setStatusFilter("all");
                navigate("/mine");
              }}
            >
              Show All Items
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MyCrap;
