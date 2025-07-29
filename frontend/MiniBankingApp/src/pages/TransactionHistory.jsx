import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTransfers } from '../hooks/useTransfers';
import { useAccounts } from '../hooks/useAccounts';

const TransactionHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getTransactionHistory, getTransactionHistoryPaginated, loading, error } = useTransfers();
  const { accounts, fetchAccounts } = useAccounts();

  const [transactions, setTransactions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false
  });
  const [usePagination, setUsePagination] = useState(true);
  const [filters, setFilters] = useState({
    accountId: searchParams.get('account') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    type: searchParams.get('type') || '',
    minAmount: searchParams.get('minAmount') || '',
    maxAmount: searchParams.get('maxAmount') || ''
  });

  const loadTransactions = useCallback(async (page = 0) => {
    if (!filters.accountId) {
      console.log('No accountId found in filters:', filters);
      return;
    }

    console.log('Loading transactions for accountId:', filters.accountId);
    
    if (usePagination) {
      const data = await getTransactionHistoryPaginated(filters.accountId, page, paginationData.pageSize);
      if (data) {
        console.log('Paginated transaction data received:', data);
        setTransactions(data.transactions);
        setPaginationData({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          pageSize: data.pageSize,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious
        });
      }
    } else {
      const data = await getTransactionHistory(filters.accountId);
      console.log('Transaction data received:', data);
      setTransactions(data);
      setPaginationData({
        currentPage: 0,
        totalPages: 1,
        totalElements: data.length,
        pageSize: data.length,
        hasNext: false,
        hasPrevious: false
      });
    }
  }, [filters.accountId, usePagination, paginationData.pageSize, getTransactionHistory, getTransactionHistoryPaginated]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (filters.accountId) {
      loadTransactions();
    }
  }, [filters.accountId, loadTransactions]);

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
    loadTransactions(0);
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
    loadTransactions(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < paginationData.totalPages) {
      loadTransactions(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPaginationData(prev => ({ ...prev, pageSize: newSize }));
    loadTransactions(0);
  };

  const togglePagination = () => {
    setUsePagination(!usePagination);
    loadTransactions(0);
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
                  {account.name} - {account.number}
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
          <button onClick={togglePagination} className="toggle-pagination-btn">
            {usePagination ? 'Disable Pagination' : 'Enable Pagination'}
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading transactions...</div>}
      {error && <div className="error">Error: {error}</div>}

      {filters.accountId && getSelectedAccount() && (
        <div className="account-info">
          <h3>Account: {getSelectedAccount().name}</h3>
          <p>Current Balance: {getSelectedAccount().accountType} {getSelectedAccount().balance?.toFixed(2) || '0.00'}</p>
        </div>
      )}

      {transactions.length === 0 && !loading ? (
        <div className="no-transactions">
          <p>No transactions found with the current filters.</p>
        </div>
      ) : (
        <div className="transactions-section">
          <div className="transactions-header">
            <h3>Transactions ({usePagination ? paginationData.totalElements : transactions.length})</h3>
            {usePagination && (
              <div className="pagination-controls">
                <div className="page-size-selector">
                  <label>Items per page: </label>
                  <select 
                    value={paginationData.pageSize} 
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
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
                  {getSelectedAccount()?.accountType} {Math.abs(transaction.amount)?.toFixed(2)}
                </div>
                <div className="col-balance">
                  {getSelectedAccount()?.accountType} {transaction.balanceAfter?.toFixed(2) || 'N/A'}
                </div>
              </div>
            ))}
          </div>

          {usePagination && paginationData.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(paginationData.currentPage - 1)}
                disabled={!paginationData.hasPrevious}
                className="pagination-btn"
              >
                Previous
              </button>
              
              <div className="pagination-info">
                Page {paginationData.currentPage + 1} of {paginationData.totalPages}
                <span className="total-items">
                  ({paginationData.totalElements} total items)
                </span>
              </div>
              
              <button 
                onClick={() => handlePageChange(paginationData.currentPage + 1)}
                disabled={!paginationData.hasNext}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;