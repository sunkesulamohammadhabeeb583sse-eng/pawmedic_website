import { useState, useCallback, useEffect } from 'react';
import { petsService } from '@/services/api';

export const usePets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await petsService.getPets();
            const data = response.data || response.pets || [];
            setPets(data);
            return data;
        } catch (err) {
            console.error('Error fetching pets:', err);
            if (err.message !== 'No pets found') {
                setError(err.message);
            } else {
                setPets([]);
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addPet = async (petData) => {
        try {
            const response = await petsService.createPet(petData);
            await fetchPets();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updatePet = async (petId, petData) => {
        try {
            const response = await petsService.updatePet(petId, petData);
            await fetchPets();
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deletePet = async (petId) => {
        try {
            await petsService.deletePet(petId);
            await fetchPets();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    return {
        pets,
        loading,
        error,
        fetchPets,
        addPet,
        updatePet,
        deletePet
    };
};
