import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { IncomeProvider } from './contexts/IncomeContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { NotificationProvider } from './contexts/NotificationContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AddExpensePage from './pages/dashboard/AddExpensePage';
import AddIncomePage from './pages/dashboard/AddIncomePage';
import ReportsPage from './pages/dashboard/ReportsPage';
import BudgetsPage from './pages/dashboard/BudgetsPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContent from './pages/admin/AdminContent';
import { NotFoundPage, UnauthorizedPage, ForbiddenPage, ServerErrorPage } from './pages/errors';
import { AboutUsPage, SupportPage, ContactPage, PrivacyPolicyPage, TermsOfServicePage, CookiePolicyPage, SecurityPage } from './pages/info';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ExpenseProvider>
            <IncomeProvider>
              <BudgetProvider>
                <NotificationProvider>
                  <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/security" element={<SecurityPage />} />

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
              <Route path="/add-income" element={<AddIncomePage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
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
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* Shared Routes (accessible by both users and admins) */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Error Pages */}
            <Route path="/401" element={<UnauthorizedPage />} />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ServerErrorPage />} />

            {/* Catch-all: any unknown route → 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
                </ErrorBoundary>
              </NotificationProvider>
            </BudgetProvider>
          </IncomeProvider>
          </ExpenseProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
