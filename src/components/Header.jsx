import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>HollyCrapr</h1>
      </div>
      <nav className={styles.nav}>
        <Link className={styles.link} to="/">Home</Link>
        <Link className={styles.link} to="/about">About</Link>
        <button className={styles.button}>Login</button>
      </nav>
    </header>
  )
}

export default Header