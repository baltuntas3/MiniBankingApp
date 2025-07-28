import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';

const TransactionHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getTransactionHistory, loading, error } = useTransactions();
  const { accounts, fetchAccounts } = useAccounts();

  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    accountId: searchParams.get('account') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    type: searchParams.get('type') || '',
    minAmount: searchParams.get('minAmount') || '',
    maxAmount: searchParams.get('maxAmount') || ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  useEffect(() => {
    if (filters.accountId) {
      loadTransactions();
    }
  }, [filters.accountId, loadTransactions]);

  const loadTransactions = useCallback(async () => {
    if (!filters.accountId) return;

    const queryParams = {};
    if (filters.startDate) queryParams.startDate = filters.startDate;
    if (filters.endDate) queryParams.endDate = filters.endDate;
    if (filters.type) queryParams.type = filters.type;
    if (filters.minAmount) queryParams.minAmount = filters.minAmount;
    if (filters.maxAmount) queryParams.maxAmount = filters.maxAmount;

    const data = await getTransactionHistory(filters.accountId, queryParams);
    setTransactions(data);
  }, [filters.accountId, filters.startDate, filters.endDate, filters.type, filters.minAmount, filters.maxAmount, getTransactionHistory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newSearchParams.set(key, val);
    });
    setSearchParams(newSearchParams);
  };

  const handleApplyFilters = () => {
    loadTransactions();
  };

  const clearFilters = () => {
    const clearedFilters = {
      accountId: filters.accountId,
      startDate: '',
      endDate: '',
      type: '',
      minAmount: '',
      maxAmount: ''
    };
    setFilters(clearedFilters);
    setSearchParams({ account: filters.accountId });
    loadTransactions();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSelectedAccount = () => {
    return accounts.find(acc => acc.id === filters.accountId);
  };

  return (
    <div className="transaction-history">
      <div className="page-header">
        <h1>Transaction History</h1>
        <Link to="/dashboard" className="back-btn">Back to Dashboard</Link>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="accountId">Account:</label>
            <select
              id="accountId"
              name="accountId"
              value={filters.accountId}
              onChange={handleFilterChange}
              required
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountName} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type">Transaction Type:</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minAmount">Min Amount:</label>
            <input
              type="number"
              id="minAmount"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxAmount">Max Amount:</label>
            <input
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="apply-btn" disabled={!filters.accountId}>
            Apply Filters
          </button>
          <button onClick={clearFilters} className="clear-btn">
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading transactions...</div>}
      {error && <div className="error">Error: {error}</div>}

      {filters.accountId && getSelectedAccount() && (
        <div className="account-info">
          <h3>Account: {getSelectedAccount().accountName}</h3>
          <p>Current Balance: {getSelectedAccount().currency} {getSelectedAccount().balance?.toFixed(2) || '0.00'}</p>
        </div>
      )}

      {transactions.length === 0 && !loading ? (
        <div className="no-transactions">
          <p>No transactions found with the current filters.</p>
        </div>
      ) : (
        <div className="transactions-section">
          <h3>Transactions ({transactions.length})</h3>
          <div className="transactions-table">
            <div className="table-header">
              <div className="col-date">Date</div>
              <div className="col-type">Type</div>
              <div className="col-description">Description</div>
              <div className="col-amount">Amount</div>
              <div className="col-balance">Balance</div>
            </div>

            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-row">
                <div className="col-date">
                  {formatDate(transaction.createdAt)}
                </div>
                <div className="col-type">
                  <span className={`type-badge ${transaction.type?.toLowerCase()}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="col-description">
                  <div className="description">
                    {transaction.description}
                  </div>
                  {transaction.fromAccount && transaction.fromAccount !== filters.accountId && (
                    <div className="sub-info">From: {transaction.fromAccountNumber}</div>
                  )}
                  {transaction.toAccount && transaction.toAccount !== filters.accountId && (
                    <div className="sub-info">To: {transaction.toAccountNumber}</div>
                  )}
                </div>
                <div className={`col-amount ${transaction.amount < 0 ? 'debit' : 'credit'}`}>
                  {transaction.amount > 0 ? '+' : ''}
                  {getSelectedAccount()?.currency} {Math.abs(transaction.amount)?.toFixed(2)}
                </div>
                <div className="col-balance">
                  {getSelectedAccount()?.currency} {transaction.balanceAfter?.toFixed(2) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;