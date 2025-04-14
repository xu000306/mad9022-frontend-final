import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Crap from "./pages/Crap";
import Header from "./components/Header";
import Login from "./pages/Login";
import styles from "./App.module.css";
import MyCrap from "./pages/MyCrap";
import Offer from "./pages/Offer";
function App() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/crap/:id" element={<Crap />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mine" element={<MyCrap />} />
          <Route path="/offer" element={<Offer />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
