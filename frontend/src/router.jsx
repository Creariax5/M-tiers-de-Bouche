import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import DashboardPage from './features/dashboard/DashboardPage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeFormPage from './pages/RecipeFormPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CustomIngredientsPage from './pages/CustomIngredientsPage';
import LabelsPage from './pages/LabelsPage';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/layout';

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/recipes',
        element: <RecipesListPage />,
      },
      {
        path: '/recipes/new',
        element: <RecipeFormPage />,
      },
      {
        path: '/recipes/:id/edit',
        element: <RecipeFormPage />,
      },
      {
        path: '/recipes/:id',
        element: <RecipeDetailPage />,
      },
      {
        path: '/ingredients',
        element: <CustomIngredientsPage />,
      },
      {
        path: '/ingredients/custom',
        element: <Navigate to="/ingredients" replace />,
      },
      {
        path: '/labels',
        element: <LabelsPage />,
      },
    ]
  },
]);
