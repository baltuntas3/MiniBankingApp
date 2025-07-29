import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { loadingAtom, errorAtom } from '../store/atoms';
import { handleGetRequest, handlePostRequest } from '../api/axiosConfig';

export const useTransfers = () => {
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const transferMoney = async (transferData) => {
    setLoading(true);
    setError(null);
    
    const [data, err] = await handlePostRequest('/api/transfers', transferData);
    
    if (err) {
      setError(err.message || 'Failed to transfer money');
      setLoading(false);
      return null;
    }
    
    setLoading(false);
    return data;
  };

  const getAccountBalance = useCallback(async (accountId) => {
    setLoading(true);
    setError(null);
    
    const [data, err] = await handleGetRequest(`/api/transfers/accounts/${accountId}/balance`);
    
    if (err) {
      setError(err.message || 'Failed to fetch account balance');
      setLoading(false);
      return null;
    }
    
    setLoading(false);
    return data;
  }, []);

  const getTransactionHistory = useCallback(async (accountId) => {
    console.log('getTransactionHistory called with accountId:', accountId);
    setLoading(true);
    setError(null);
    
    const url = `/api/transfers/transactions/account/${accountId}`;
    console.log('Making request to:', url);
    const [data, err] = await handleGetRequest(url);
    
    if (err) {
      console.log('Error fetching transaction history:', err);
      setError(err.message || 'Failed to fetch transaction history');
      setLoading(false);
      return [];
    }
    
    console.log('Successfully fetched transaction history:', data);
    setLoading(false);
    return data || [];
  }, []);

  const getTransactionHistoryPaginated = useCallback(async (accountId, page = 0, size = 10) => {
    console.log('getTransactionHistoryPaginated called with accountId:', accountId, 'page:', page, 'size:', size);
    setLoading(true);
    setError(null);
    
    const url = `/api/transfers/transactions/account/${accountId}/paginated?page=${page}&size=${size}`;
    console.log('Making request to:', url);
    const [data, err] = await handleGetRequest(url);
    
    if (err) {
      console.log('Error fetching paginated transaction history:', err);
      setError(err.message || 'Failed to fetch transaction history');
      setLoading(false);
      return null;
    }
    
    console.log('Successfully fetched paginated transaction history:', data);
    setLoading(false);
    return data;
  }, []);

  return {
    loading,
    error,
    transferMoney,
    getAccountBalance,
    getTransactionHistory,
    getTransactionHistoryPaginated
  };
};