import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.home}>
      <h2 className={styles.heading}>Welcome to HollyCrapr</h2>
      <p className={styles.description}>Find items people are looking to get rid of!</p>
    </div>
  )
}

export default Home