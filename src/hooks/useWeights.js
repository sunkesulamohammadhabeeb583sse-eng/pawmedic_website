import { useState, useCallback } from 'react';
import { weightsService } from '@/services/api';

export const useWeights = (petId) => {
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeights = useCallback(async (id = petId) => {
        if (!id) return [];
        try {
            setLoading(true);
            setError(null);
            const response = await weightsService.getWeights(id);
            const data = response.data || response.weights || [];
            // Sort by date descending
            const sortedData = [...data].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
            setWeights(sortedData);
            return sortedData;
        } catch (err) {
            console.error('Error fetching weights:', err);
            setError(err.message);
            setWeights([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [petId]);

    const addWeight = async (weight) => {
        if (!petId) return;
        try {
            const response = await weightsService.addWeight(petId, weight);
            await fetchWeights();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteWeight = async (weightId) => {
        if (!petId) return;
        try {
            await weightsService.deleteWeight(petId, weightId);
            await fetchWeights();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        weights,
        loading,
        error,
        fetchWeights,
        addWeight,
        deleteWeight
    };
};
