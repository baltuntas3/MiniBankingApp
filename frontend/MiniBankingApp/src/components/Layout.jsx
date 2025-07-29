import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children, title, showBackButton = false, backPath = '/dashboard' }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            {showBackButton && (
              <a href={backPath} className="back-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </a>
            )}
            <h1 className="page-title">{title}</h1>
          </div>
          
          <div className="header-center">
            {user && (
              <div className="welcome-message">
                Welcome, <span className="username">{user.username}</span>
              </div>
            )}
          </div>

          <div className="header-right">
            <ThemeToggle />
            <button onClick={handleLogout} className="btn btn-danger btn-sm logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;