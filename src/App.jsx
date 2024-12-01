import React from 'react';
import styles from "./App.module.css";
import NavBar from "./components/NavBar/NavBar.jsx";
import Hero from './components/Hero/Hero.jsx';
import Features from './components/Features/Features.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Hero />
      <Features/>
      <Footer/>
    </div>
  );
}

export default App;