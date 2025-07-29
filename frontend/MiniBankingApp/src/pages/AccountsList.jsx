import { useEffect, useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useDebounce } from '../hooks/useDebounce';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const AccountsList = () => {
  const { accounts, fetchAccounts, loading, error, searchAccounts } = useAccounts();
  const [searchFilters, setSearchFilters] = useState({ number: '', name: '' });
  const debouncedFilters = useDebounce(searchFilters, 300);

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  useEffect(() => {
    console.log('Debounced filters changed:', debouncedFilters);
    const hasFilters = debouncedFilters.number.trim() || debouncedFilters.name.trim();
    
    if (hasFilters) {
      const filters = {};
      if (debouncedFilters.number.trim()) filters.number = debouncedFilters.number.trim();
      if (debouncedFilters.name.trim()) filters.name = debouncedFilters.name.trim();
      console.log('Calling searchAccounts with filters:', filters);
      searchAccounts(filters);
    } else {
      console.log('No filters, calling fetchAccounts');
      fetchAccounts();
    }
  }, [debouncedFilters]); // Remove function dependencies to prevent infinite loop

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Layout title="Your Accounts" showBackButton={true}>
      <div className="accounts-list">
        <div className="accounts-header">
          <Link to="/accounts/create" className="btn btn-success">
            Create New Account
          </Link>
        </div>
        
        <div className="search-section">
        <input
          type="text"
          placeholder="Search by account number..."
          value={searchFilters.number}
          onChange={(e) => handleFilterChange('number', e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by account name..."
          value={searchFilters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          className="search-input"
        />
      </div>

      <div className="results-section">
        {loading ? (
          <div className="loading">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="no-accounts">
            <p>No accounts found.</p>
            <Link to="/accounts/create" className="create-account-btn">
              Create Your First Account
            </Link>
          </div>
        ) : (
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
        )}
        </div>
      </div>
    </Layout>
  );
};

export default AccountsList;