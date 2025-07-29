import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: 'john_doe',
    password: 'password123'
  });
  const [authMessage, setAuthMessage] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a redirect reason (unauthorized access)
    if (location.state?.from) {
      setAuthMessage('Please log in to access this page.');
    }
    
    // Check for session storage messages
    const storedMessage = sessionStorage.getItem('authMessage');
    if (storedMessage) {
      setAuthMessage(storedMessage);
      sessionStorage.removeItem('authMessage');
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear auth message when user starts typing
    if (authMessage) {
      setAuthMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage(''); // Clear any previous messages
    const success = await login(formData.username, formData.password);
    if (success) {
      // Navigate to the intended page or accounts
      const from = location.state?.from?.pathname || '/accounts';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {(error || authMessage) && (
          <div className={`alert ${error ? 'alert-error' : 'alert-warning'}`}>
            {error || authMessage}
          </div>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{width: '100%'}}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginForm;