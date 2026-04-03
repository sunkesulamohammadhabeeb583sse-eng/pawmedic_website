import { useState, useCallback, useEffect } from 'react';
import { recordsService } from '@/services/api';

export const useRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecords = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await recordsService.getRecords();
            const data = response.data || [];
            setRecords(data);
            return data;
        } catch (err) {
            console.error('Error fetching records:', err);
            setError(err.message);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addDailyCare = async (data) => {
        try {
            const response = await recordsService.createDailyCare(data);
            await fetchRecords();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const addActivity = async (data) => {
        try {
            const response = await recordsService.createActivity(data);
            await fetchRecords();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteRecord = async (type, id) => {
        try {
            await recordsService.deleteRecord(type, id);
            await fetchRecords();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return {
        records,
        loading,
        error,
        fetchRecords,
        addDailyCare,
        addActivity,
        deleteRecord
    };
};
