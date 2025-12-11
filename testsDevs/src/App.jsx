import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BrandPage from './pages/fundamentals/BrandPage';
import ButtonsPage from './pages/components/ButtonsPage';
import RecipeDetailPage from './pages/examples/RecipeDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Fundamentals */}
          <Route path="fundamentals/brand" element={<BrandPage />} />
          <Route path="fundamentals/typography" element={<div className="p-8 text-center text-stone-brown">Page Typographie en construction</div>} />
          <Route path="fundamentals/colors" element={<div className="p-8 text-center text-stone-brown">Page Couleurs en construction</div>} />
          
          {/* Components */}
          <Route path="components/buttons" element={<ButtonsPage />} />
          <Route path="components/cards" element={<div className="p-8 text-center text-stone-brown">Page Cards en construction</div>} />
          <Route path="components/inputs" element={<div className="p-8 text-center text-stone-brown">Page Inputs en construction</div>} />
          <Route path="components/badges" element={<div className="p-8 text-center text-stone-brown">Page Badges en construction</div>} />

          {/* Examples */}
          <Route path="examples/recipe-detail" element={<RecipeDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
