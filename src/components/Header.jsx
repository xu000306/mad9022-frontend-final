import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <h1>HolyCrap</h1>
        </div>
        <nav className={styles.nav}>
          <Link className={styles.link} to="/">
            Home
          </Link>
          <Link className={styles.link} to="/about">
            About
          </Link>
          <Link to={{ pathname: "/login" }}>
            <button className={styles.button}>Login</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
