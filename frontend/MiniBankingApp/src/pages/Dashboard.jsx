import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAccounts } from '../hooks/useAccounts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { accounts, fetchAccounts, loading } = useAccounts();

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <Link to="/accounts" className="nav-link">Accounts</Link>
        <Link to="/transfer" className="nav-link">Transfer Money</Link>
      </nav>

      <main className="dashboard-content">
        <section className="accounts-overview">
          <h2>Your Accounts</h2>
          {loading ? (
            <p>Loading accounts...</p>
          ) : accounts.length > 0 ? (
            <div className="accounts-grid">
              {accounts.map(account => (
                <div key={account.id} className="account-card">
                  <h3>{account.accountName}</h3>
                  <p>Balance: {account.currency} {account.balance}</p>
                  <p>Account Number: {account.accountNumber}</p>
                  <Link to={`/accounts/${account.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-accounts">
              <p>You don't have any accounts yet.</p>
              <Link to="/accounts/create" className="btn btn-success">
                Create Account
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;