import {useAtom} from 'jotai';
import {useCallback} from 'react';
import {errorAtom, loadingAtom, transactionsAtom} from '../store/atoms';
import {handleGetRequest, handlePostRequest} from '../api/axiosConfig';

export const useTransactions = () => {
    const [transactions, setTransactions] = useAtom(transactionsAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);

    const fetchTransactions = useCallback(async (accountId) => {
        setLoading(true);
        setError(null);

        const [data, err] = await handleGetRequest(`/api/accounts/${accountId}`);
        transactions
        if (err) {
            setError(err.message || 'Failed to fetch transactions');
            setLoading(false);
            return;
        }

        setTransactions(data || []);
        setLoading(false);
    }, []);

    const createTransfer = async (transferData) => {
        setLoading(true);
        setError(null);

        const [, err] = await handlePostRequest('/api/transfers', transferData);

        if (err) {
            setError(err.message || 'Transfer failed');
            setLoading(false);
            return false;
        }

        setLoading(false);
        return true;
    };

    const getTransactionHistory = async (accountId, params = {}) => {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams(params).toString();
        const url = `/api/transfers/transactions/account/${accountId}${queryParams ? `?${queryParams}` : ''}`;

        const [data, err] = await handleGetRequest(url);

        console.log(data, '-*-*-*-')

        if (err) {
            setError(err.message || 'Failed to fetch transaction history');
            setLoading(false);
            return [];
        }

        setLoading(false);
        return data || [];
    };

    const getTransactionHistoryPaginated = useCallback(async (accountId, page = 0, size = 5) => {
        setLoading(true);
        setError(null);

        const url = `/api/transfers/transactions/account/${accountId}/paginated?page=${page}&size=${size}`;
        const [data, err] = await handleGetRequest(url);

        if (err) {
            setError(err.message || 'Failed to fetch transaction history');
            setLoading(false);
            return null;
        }

        setLoading(false);
        return data;
    }, []);

    return {
        transactions,
        loading,
        error,
        fetchTransactions,
        createTransfer,
        getTransactionHistory,
        getTransactionHistoryPaginated
    };
};