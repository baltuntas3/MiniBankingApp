import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'jotai';
import { useAuth } from './hooks/useAuth';
import { setNavigateFunction } from './utils/navigationUtils';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import AccountsList from './pages/AccountsList';
import AccountDetails from './pages/AccountDetails';
import AccountForm from './components/AccountForm';
import TransferForm from './components/TransferForm';
import TransactionHistory from './pages/TransactionHistory';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { checkAuthStatus, authInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set navigate function for global use
    setNavigateFunction(navigate);
    checkAuthStatus();
  }, [navigate, checkAuthStatus]);

  // Show loading while initializing authentication
  if (!authInitialized) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/accounts" element={
          <ProtectedRoute>
            <AccountsList />
          </ProtectedRoute>
        } />
        <Route path="/accounts/create" element={
          <ProtectedRoute>
            <AccountForm />
          </ProtectedRoute>
        } />
        <Route path="/accounts/:id" element={
          <ProtectedRoute>
            <AccountDetails />
          </ProtectedRoute>
        } />
        <Route path="/transfer" element={
          <ProtectedRoute>
            <TransferForm />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <TransactionHistory />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/accounts" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
