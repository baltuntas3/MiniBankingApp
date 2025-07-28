import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';

const AccountDetails = () => {
  const { id } = useParams();
  const { selectedAccount, getAccountDetails, loading: accountLoading, error: accountError } = useAccounts();
  const { transactions, fetchTransactions, loading: transactionsLoading } = useTransactions();

  useEffect(() => {
    if (id) {
      getAccountDetails(id);
      fetchTransactions(id);
    }
  }, [id]); // Remove function dependencies to prevent infinite loop

  if (accountLoading) return <div className="loading">Loading account details...</div>;
  if (accountError) return <div className="error">Error: {accountError}</div>;
  if (!selectedAccount) return <div className="error">Account not found</div>;

  return (
    <div className="account-details">
      <div className="account-header">
        <h1>{selectedAccount.accountName}</h1>
        <div className="account-meta">
          <span className="account-type">{selectedAccount.accountType}</span>
          <span className="account-number">#{selectedAccount.accountNumber}</span>
        </div>
      </div>

      <div className="account-info">
        <div className="balance-card">
          <h2>Current Balance</h2>
          <p className="balance-amount">
            {selectedAccount.currency} {selectedAccount.balance?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="account-stats">
          <div className="stat-item">
            <label>Currency:</label>
            <span>{selectedAccount.currency}</span>
          </div>
          <div className="stat-item">
            <label>Account Type:</label>
            <span>{selectedAccount.accountType}</span>
          </div>
          <div className="stat-item">
            <label>Created:</label>
            <span>{new Date(selectedAccount.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="stat-item">
            <label>Status:</label>
            <span className={`status ${selectedAccount.status?.toLowerCase()}`}>
              {selectedAccount.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="account-actions">
        <Link 
          to={`/transfer?from=${selectedAccount.id}`} 
          className="action-btn transfer-btn"
        >
          Transfer Money
        </Link>
        <Link 
          to={`/transactions?account=${selectedAccount.id}`} 
          className="action-btn history-btn"
        >
          View Full History
        </Link>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        {transactionsLoading ? (
          <p>Loading transactions...</p>
        ) : transactions.length > 0 ? (
          <div className="transactions-list">
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">{transaction.type}</span>
                  <span className="transaction-date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="transaction-details">
                  {transaction.description && (
                    <p className="description">{transaction.description}</p>
                  )}
                  {transaction.fromAccount && (
                    <p className="from">From: {transaction.fromAccount}</p>
                  )}
                  {transaction.toAccount && (
                    <p className="to">To: {transaction.toAccount}</p>
                  )}
                </div>
                <div className={`transaction-amount ${transaction.amount < 0 ? 'debit' : 'credit'}`}>
                  {transaction.amount > 0 ? '+' : ''}{selectedAccount.currency} {transaction.amount?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-transactions">No transactions found for this account.</p>
        )}
      </div>

      <div className="navigation">
        <Link to="/accounts" className="back-btn">Back to Accounts</Link>
        <Link to="/dashboard" className="dashboard-btn">Dashboard</Link>
      </div>
    </div>
  );
};

export default AccountDetails;