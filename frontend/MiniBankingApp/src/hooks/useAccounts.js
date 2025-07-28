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

  const searchAccounts = async (query) => {
    setLoading(true);
    setError(null);

    const searchRequest = query ? { query } : {};
    const [data, err] = await handlePostRequest('/api/accounts/search', searchRequest);

    if (err) {
      setError(err.message || 'Failed to search accounts');
      setLoading(false);
      return [];
    }

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
    getAccountDetails,
    searchAccounts,
    setSelectedAccount
  };
};