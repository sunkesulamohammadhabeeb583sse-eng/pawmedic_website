import { useState, useCallback, useEffect } from 'react';
import { scansService } from '@/services/api';

export const useScans = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchScans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await scansService.getScans();
            const data = response.data || [];
            setScans(data);
            return data;
        } catch (err) {
            console.error('Error fetching scans:', err);
            setError(err.message);
            setScans([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteScan = async (scanId) => {
        try {
            await scansService.deleteScan(scanId);
            await fetchScans();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchScans();
    }, [fetchScans]);

    return {
        scans,
        loading,
        error,
        fetchScans,
        deleteScan
    };
};
