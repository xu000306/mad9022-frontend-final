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
      const googleAuthUrl =
        "https://mad9124backendfinal.onrender.com/auth/google";
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
