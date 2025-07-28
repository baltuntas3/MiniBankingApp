import { useState, useEffect } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TransferForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accounts, fetchAccounts } = useAccounts();
  const { createTransfer, loading, error } = useTransactions();
  
  const [formData, setFormData] = useState({
    fromAccountId: searchParams.get('from') || '',
    toAccountId: '',
    amount: '',
    description: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [transferSuccess, setTransferSuccess] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []); // Remove fetchAccounts dependency to prevent infinite loop

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fromAccountId) {
      errors.fromAccountId = 'Source account is required';
    }
    
    if (!formData.toAccountId) {
      errors.toAccountId = 'Destination account is required';
    }
    
    if (formData.fromAccountId === formData.toAccountId) {
      errors.toAccountId = 'Source and destination accounts cannot be the same';
    }
    
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }

    const fromAccount = accounts.find(acc => acc.id === formData.fromAccountId);
    if (fromAccount && parseFloat(formData.amount) > fromAccount.balance) {
      errors.amount = 'Insufficient balance';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const transferData = {
      fromAccountId: formData.fromAccountId,
      toAccountId: formData.toAccountId,
      amount: parseFloat(formData.amount),
      description: formData.description || 'Money transfer'
    };
    
    const success = await createTransfer(transferData);
    if (success) {
      setTransferSuccess(true);
      setFormData({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: ''
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  };

  const getAccountBalance = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.currency} ${account.balance?.toFixed(2) || '0.00'}` : '';
  };

  if (transferSuccess) {
    return (
      <div className="transfer-success">
        <h2>Transfer Successful!</h2>
        <p>Your money transfer has been completed successfully.</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="transfer-form">
      <h2>Transfer Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fromAccountId">From Account:</label>
          <select
            id="fromAccountId"
            name="fromAccountId"
            value={formData.fromAccountId}
            onChange={handleChange}
            required
          >
            <option value="">Select source account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.accountName} - {account.accountNumber} 
                (Balance: {account.currency} {account.balance?.toFixed(2) || '0.00'})
              </option>
            ))}
          </select>
          {validationErrors.fromAccountId && (
            <div className="error-message">{validationErrors.fromAccountId}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="toAccountId">To Account:</label>
          <select
            id="toAccountId"
            name="toAccountId"
            value={formData.toAccountId}
            onChange={handleChange}
            required
          >
            <option value="">Select destination account</option>
            {accounts
              .filter(account => account.id !== formData.fromAccountId)
              .map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountName} - {account.accountNumber}
                </option>
              ))}
          </select>
          {validationErrors.toAccountId && (
            <div className="error-message">{validationErrors.toAccountId}</div>
          )}
        </div>
        
        {formData.fromAccountId && (
          <div className="balance-info">
            <p>Available balance: {getAccountBalance(formData.fromAccountId)}</p>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
          />
          {validationErrors.amount && (
            <div className="error-message">{validationErrors.amount}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description for this transfer"
            rows="3"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Processing...' : 'Transfer Money'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;