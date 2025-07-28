import { useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useNavigate } from 'react-router-dom';

const AccountForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    accountType: 'TRY',
    initialBalance: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const { createAccount, loading, error } = useAccounts();
  const navigate = useNavigate();

  const accountTypes = ['TRY', 'USD', 'GOLD'];

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
    
    if (!formData.name.trim()) {
      errors.name = 'Account name is required';
    }
    
    if (formData.initialBalance && (isNaN(formData.initialBalance) || parseFloat(formData.initialBalance) < 0)) {
      errors.initialBalance = 'Initial balance must be a valid positive number or zero';
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
    
    const accountData = {
      name: formData.name,
      accountType: formData.accountType,
      initialBalance: formData.initialBalance ? parseFloat(formData.initialBalance) : 0
    };
    
    const success = await createAccount(accountData);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="account-form">
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Account Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., My Savings Account"
            required
          />
          {validationErrors.name && (
            <div className="error-message">{validationErrors.name}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="accountType">Account Type:</label>
          <select
            id="accountType"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            required
          >
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        
        <div className="form-group">
          <label htmlFor="initialBalance">Initial Balance:</label>
          <input
            type="number"
            id="initialBalance"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          {validationErrors.initialBalance && (
            <div className="error-message">{validationErrors.initialBalance}</div>
          )}
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;