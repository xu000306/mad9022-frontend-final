import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../assets/holycrap.png";
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <img className={styles.logoImage} src={logo} alt="logo" />{" "}
          <h1 className={styles.logoName}>HolyCrap</h1>
        </div>
        <nav className={styles.nav}>
          <Link className={styles.link} to="/">
            Home
          </Link>
          <Link className={styles.link} to="/about">
            About
          </Link>
          <Link className={styles.link} to="/offer">
            Offer Crap
          </Link>
          <Link className={styles.link} to="/mine">
            My Crap
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
