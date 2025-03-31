import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Crap from './pages/Crap'
import Header from './components/Header';
import styles from './App.module.css';

function App() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/crap" element={<Crap />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;