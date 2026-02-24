import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AddExpensePage from './pages/dashboard/AddExpensePage';
import ReportsPage from './pages/dashboard/ReportsPage';
import BudgetsPage from './pages/dashboard/BudgetsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAlerts from './pages/admin/AdminAlerts';
import { NotFoundPage, UnauthorizedPage, ForbiddenPage, ServerErrorPage } from './pages/errors';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected User Routes */}
            <Route
              element={
                <ProtectedRoute userOnly>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/add-expense" element={<AddExpensePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              element={
                <ProtectedRoute adminOnly>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/alerts" element={<AdminAlerts />} />
            </Route>

            {/* Error Pages */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ServerErrorPage />} />

            {/* Catch-all: any unknown route → 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
