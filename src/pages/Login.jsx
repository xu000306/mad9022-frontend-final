import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [log, setLogState] = useState(false);

  // Check for token on initial load
  useEffect(() => {
    const token = Cookies.get("token"); // read cookie
    console.log("token from cookie:", token);

    if (token) {
      setLogState(true);
    } else {
      //Check if there's a token in the URL after Google redirect
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        //set cookie expire in 7 days
        Cookies.set("token", urlToken, { secure: true, expires: 7 });
        setLogState(true);

        // remove token from URL
        // window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  function handleClick() {
    if (log) {
      // Logout
      Cookies.remove("token");
      setLogState(false);
    } else {
      // Redirect to Google login
      // const apiRedirectUrl = "https://mad9124backendfinal.onrender.com/login";
      // const googleAuthUrl = `https://mad9124backendfinal.onrender.com/auth/google/?redirect_url=${encodeURIComponent(
      //   apiRedirectUrl
      // )}`;

      // const apiRedirectUrl = "http://localhost:5173/login";
      // const googleAuthUrl = `http://localhost:5000/auth/google/?redirect_url=${encodeURIComponent(
      //   apiRedirectUrl
      // )}`;
      const frontendBaseUrl = window.location.origin;

      // Check if you're on localhost (development)
      const isLocalhost = frontendBaseUrl.includes("localhost");

      // Set backend base URL accordingly
      const backendBaseUrl = isLocalhost
        ? "http://localhost:5000"
        : "https://mad9124backendfinal.onrender.com";

      // Redirect URL after Google Auth
      const apiRedirectUrl = `${frontendBaseUrl}/login`;

      // Final Google Auth URL
      const googleAuthUrl = `${backendBaseUrl}/auth/google/?redirect_url=${encodeURIComponent(
        apiRedirectUrl
      )}`;
      console.log("googleAuthUrl", googleAuthUrl);

      window.location.href = googleAuthUrl;
    }
  }

  return (
    <div>
      <button className={styles.btn} onClick={handleClick}>
        {log ? "Click To Logout" : "Click To Login By Google Authentication"}
      </button>
    </div>
  );
}
