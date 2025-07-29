import { useEffect } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { accounts, fetchAccounts, loading } = useAccounts();

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  return (
    <Layout title="Dashboard">
      <div className="dashboard">
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
                    <div className="account-header">
                      <h3>{account.name}</h3>
                      <span className="account-type">{account.accountType}</span>
                    </div>
                    
                    <div className="account-details">
                      <p className="balance">
                        <strong>{account.accountType} {account.balance?.toFixed(2) || '0.00'}</strong>
                      </p>
                      <p className="account-number">
                        Account: {account.number}
                      </p>
                      <p className="created-date">
                        Created: {new Date(account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="account-actions">
                      <Link 
                        to={`/accounts/${account.id}`} 
                        className="view-btn"
                      >
                        View Details
                      </Link>
                      <Link 
                        to={`/transfer?from=${account.id}`} 
                        className="transfer-btn"
                      >
                        Transfer
                      </Link>
                      <Link 
                        to={`/transactions?account=${account.id}`} 
                        className="history-btn"
                      >
                        View Full History
                      </Link>
                    </div>
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
    </Layout>
  );
};

export default Dashboard;