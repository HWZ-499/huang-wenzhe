import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Ideas from './pages/Ideas';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/ideas" element={<Ideas />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;