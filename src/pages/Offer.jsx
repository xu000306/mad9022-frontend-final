import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Offer.module.css";

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

  try {
    // const apiUrl = `  https://mad9124backendfinal.onrender.com/api/${endpoint}${
    //   query ? `?query=${encodeURIComponent(query)}` : ""
    // }`;

    const apiUrl = ` http://localhost:5000/api/${endpoint}${
      query ? `?query=${encodeURIComponent(query)}` : ""
    }`;
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

function Offer() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({
            type: "Point",
            coordinates: [longitude, latitude],
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Could not access your location. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login", { state: { from: "/offer" } });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!formData.image) {
      setError("Image is required");
      return;
    }
    if (!userLocation) {
      setError("Location is required. Please enable location services.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData with all required fields for a single request
      const crapFormData = new FormData();
      crapFormData.append("title", formData.title);
      crapFormData.append("description", formData.description);
      crapFormData.append("location", JSON.stringify(userLocation));

      // The backend expects 'images' as the field name for file uploads
      crapFormData.append("images", formData.image);

      // Use the common fetch function instead of axios
      const result = await fetchData({
        endpoint: "crap",
        method: "POST",
        formData: crapFormData,
      });

      // Navigate to the crap details page or back to homepage
      if (result && result.data && result.data._id) {
        navigate(`/crap/${result.data._id}`);
      } else {
        // navigate("/crap"); // Fallback to crap list page
        console.error("No data back,crap upload failed!");
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || "Failed to upload. Please try again.");
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className={styles.offerPage}>
      <h1 className={styles.pageTitle}>Offer Your Crap</h1>
      <p className={styles.pageDescription}>
        Got something to get rid of? Fill out the form below and someone might
        take it off your hands!
      </p>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.offerForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="What are you offering?"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us more about your item. Condition, dimensions, etc."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className={styles.fileInput}
            disabled={isSubmitting}
          />
          <div className={styles.uploadInfo}>
            Upload a clear image of your item (Max size: 5MB)
          </div>
        </div>

        {preview && (
          <div className={styles.imagePreview}>
            <p>Image Preview:</p>
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Location</label>
          <div className={styles.locationInfo}>
            {userLocation
              ? `Using your current location: [${userLocation.coordinates[0].toFixed(
                  6
                )}, ${userLocation.coordinates[1].toFixed(6)}]`
              : "Fetching your location..."}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || !userLocation}
        >
          {isSubmitting ? "Submitting..." : "Offer Item"}
        </button>
      </form>
    </div>
  );
}

export default Offer;
