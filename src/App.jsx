import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App