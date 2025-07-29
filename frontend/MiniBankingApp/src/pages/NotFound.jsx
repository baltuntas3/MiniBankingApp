import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="not-found-svg"
          >
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6"/>
            <path d="m9 9 6 6"/>
          </svg>
        </div>
        
        <div className="not-found-text">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
          <Link to="/accounts" className="btn btn-secondary">
            View Accounts
          </Link>
        </div>
        
        <div className="not-found-links">
          <p>You might be looking for:</p>
          <div className="quick-links">
            <Link to="/auth/login" className="quick-link">Login</Link>
            <Link to="/register" className="quick-link">Register</Link>
            <Link to="/transfer" className="quick-link">Transfer Money</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;