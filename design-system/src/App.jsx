import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BrandPage from './pages/fundamentals/BrandPage';
import ConfigurationPage from './pages/fundamentals/ConfigurationPage';
import TypographyPage from './pages/fundamentals/TypographyPage';
import ColorsPage from './pages/fundamentals/ColorsPage';
import CardsPage from './pages/components/CardsPage';
import InputsPage from './pages/components/InputsPage';
import BadgesPage from './pages/components/BadgesPage';
import ButtonsPage from './pages/components/ButtonsPage';
import TablesPage from './pages/components/TablesPage';
import TabsPage from './pages/components/TabsPage';
import AlertsPage from './pages/components/AlertsPage';
import ModalsPage from './pages/components/ModalsPage';
import ExtraComponentsPage from './pages/components/ExtraComponentsPage';
import NutritionPage from './pages/components/NutritionPage';
import RecipeDetailPage from './pages/examples/RecipeDetailPage';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Fundamentals */}
            <Route path="fundamentals/configuration" element={<ConfigurationPage />} />
            <Route path="fundamentals/brand" element={<BrandPage />} />
            <Route path="fundamentals/typography" element={<TypographyPage />} />
            <Route path="fundamentals/colors" element={<ColorsPage />} />
            
            {/* Components */}
            <Route path="components/buttons" element={<ButtonsPage />} />
            <Route path="components/cards" element={<CardsPage />} />
            <Route path="components/inputs" element={<InputsPage />} />
            <Route path="components/badges" element={<BadgesPage />} />
            <Route path="components/tables" element={<TablesPage />} />
            <Route path="components/tabs" element={<TabsPage />} />
            <Route path="components/alerts" element={<AlertsPage />} />
            <Route path="components/modals" element={<ModalsPage />} />
            <Route path="components/extras" element={<ExtraComponentsPage />} />
            <Route path="components/nutrition" element={<NutritionPage />} />

            {/* Examples */}
            <Route path="examples/recipe-detail" element={<RecipeDetailPage />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
