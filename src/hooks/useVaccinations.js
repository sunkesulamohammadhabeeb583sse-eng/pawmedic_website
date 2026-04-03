import { useState, useCallback } from 'react';
import { vaccinationsService } from '@/services/api';

export const useVaccinations = (petId) => {
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchVaccinations = useCallback(async (id = petId) => {
        if (!id) return [];
        try {
            setLoading(true);
            setError(null);
            const response = await vaccinationsService.getVaccinations(id);
            const data = response.data || response.vaccinations || [];
            setVaccinations(data);
            return data;
        } catch (err) {
            console.error('Error fetching vaccinations:', err);
            setError(err.message);
            setVaccinations([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [petId]);

    const addVaccination = async (data) => {
        if (!petId) return;
        try {
            const response = await vaccinationsService.addVaccination(petId, data);
            await fetchVaccinations();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateVaccination = async (vaccId, data) => {
        if (!petId) return;
        try {
            const response = await vaccinationsService.updateVaccination(petId, vaccId, data);
            await fetchVaccinations();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteVaccination = async (vaccId) => {
        if (!petId) return;
        try {
            await vaccinationsService.deleteVaccination(petId, vaccId);
            await fetchVaccinations();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        vaccinations,
        loading,
        error,
        fetchVaccinations,
        addVaccination,
        updateVaccination,
        deleteVaccination
    };
};
