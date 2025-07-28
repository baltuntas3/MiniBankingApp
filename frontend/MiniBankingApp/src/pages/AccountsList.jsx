import { useEffect, useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { Link } from 'react-router-dom';

const AccountsList = () => {
  const { accounts, fetchAccounts, loading, error, searchAccounts } = useAccounts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  useEffect(() => {
    setFilteredAccounts(accounts);
  }, [accounts]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const results = await searchAccounts(query);
      setFilteredAccounts(results);
    } else {
      setFilteredAccounts(accounts);
    }
  };

  if (loading) return <div className="loading">Loading accounts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="accounts-list">
      <div className="accounts-header">
        <h1>Your Accounts</h1>
        <Link to="/accounts/create" className="create-btn">
          Create New Account
        </Link>
      </div>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredAccounts.length === 0 ? (
        <div className="no-accounts">
          <p>No accounts found.</p>
          <Link to="/accounts/create" className="create-account-btn">
            Create Your First Account
          </Link>
        </div>
      ) : (
        <div className="accounts-grid">
          {filteredAccounts.map(account => (
            <div key={account.id} className="account-card">
              <div className="account-header">
                <h3>{account.accountName}</h3>
                <span className="account-type">{account.accountType}</span>
              </div>
              
              <div className="account-details">
                <p className="balance">
                  <strong>{account.currency} {account.balance?.toFixed(2) || '0.00'}</strong>
                </p>
                <p className="account-number">
                  Account: {account.accountNumber}
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
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="navigation">
        <Link to="/dashboard" className="back-btn">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default AccountsList;