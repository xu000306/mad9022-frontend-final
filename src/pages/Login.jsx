import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [btn, setBtn] = useState(false);
  // Function to handle the token extraction from the URL query parameters
  function handleQueryParams() {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("Token received:", token);

      // Store the token in cookies with appropriate options
      Cookies.set("token", token, {
        secure: true, // cookie will be sent only over HTTPS
        expires: 6 / 24, // token expires in 6 hours
      });
      // change the button to  Log in successfully!
      setBtn(true);
      // Optionally, clean up the URL (remove the token from the query string)
      // window.history.replaceState(null, "", window.location.pathname);
    } else {
      console.log("token fetch failed!");
    }
  }

  // Call the function to handle query parameters when the component mounts
  useEffect(() => {
    handleQueryParams();
  }, []);

  function handleClick() {
    const googleAuthUrl = "http://localhost:5000/auth/google"; // Your API route
    window.location.href = googleAuthUrl; // Redirect the user to Google login page
  }

  return (
    <div>
      <button className={styles.btn} onClick={handleClick}>
        {btn
          ? "Log in successfully!"
          : "Click To Login By Google Authentication"}
      </button>
    </div>
  );
}
