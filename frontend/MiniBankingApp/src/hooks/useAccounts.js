import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { accountsAtom, selectedAccountAtom, loadingAtom, errorAtom } from '../store/atoms';
import { handleGetRequest, handlePostRequest, handlePutRequest, handleDeleteRequest } from '../api/axiosConfig';

export const useAccounts = () => {
  const [accounts, setAccounts] = useAtom(accountsAtom);
  const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [data, err] = await handlePostRequest('/api/accounts/search', {});

    if (err) {
      setError(err.message || 'Failed to fetch accounts');
      setLoading(false);
      return;
    }

    setAccounts(data || []);
    setLoading(false);
  }, []);

  const createAccount = async (accountData) => {
    setLoading(true);
    setError(null);

    const [data, err] = await handlePostRequest('/api/accounts', accountData);

    if (err) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
      return false;
    }

    setAccounts(prev => [...prev, data]);
    setLoading(false);
    return true;
  };

  const getAccountDetails = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);

    const [data, err] = await handleGetRequest(`/api/accounts/${accountId}`);

    if (err) {
      setError(err.message || 'Failed to fetch account details');
      setLoading(false);
      return null;
    }

    setSelectedAccount(data);
    setLoading(false);
    return data;
  }, []);

  const updateAccount = async (accountId, accountData) => {
    setLoading(true);
    setError(null);
    
    const [data, err] = await handlePutRequest(`/api/accounts/${accountId}`, accountData);
    
    if (err) {
      setError(err.message || 'Failed to update account');
      setLoading(false);
      return false;
    }
    
    setAccounts(prev => prev.map(acc => acc.id === accountId ? data : acc));
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(data);
    }
    setLoading(false);
    return true;
  };

  const deleteAccount = async (accountId) => {
    setLoading(true);
    setError(null);
    
    const [, err] = await handleDeleteRequest(`/api/accounts/${accountId}`);
    
    if (err) {
      setError(err.message || 'Failed to delete account');
      setLoading(false);
      return false;
    }
    
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(null);
    }
    setLoading(false);
    return true;
  };

  const searchAccounts = async (filters = {}) => {
    setLoading(true);
    setError(null);

    const searchRequest = {};
    if (filters.number) searchRequest.number = filters.number;
    if (filters.name) searchRequest.name = filters.name;

    const [data, err] = await handlePostRequest('/api/accounts/search', searchRequest);

    if (err) {
      setError(err.message || 'Failed to search accounts');
      setLoading(false);
      return [];
    }

    setAccounts(data || []);
    setLoading(false);
    return data || [];
  };

  return {
    accounts,
    selectedAccount,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountDetails,
    searchAccounts,
    setSelectedAccount
  };
};