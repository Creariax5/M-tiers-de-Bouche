import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import DashboardPage from './features/dashboard/DashboardPage';
import RecipesListPage from './pages/RecipesListPage';
import RecipeFormPage from './pages/RecipeFormPage';
import { useAuthStore } from './stores/authStore';

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
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recipes',
    element: (
      <ProtectedRoute>
        <RecipesListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recipes/new',
    element: (
      <ProtectedRoute>
        <RecipeFormPage />
      </ProtectedRoute>
    ),
  },
]);
