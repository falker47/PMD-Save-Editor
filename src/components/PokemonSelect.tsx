import React, { useMemo } from 'react';
import { DataManager } from '../utils/DataManager';

interface PokemonSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export const PokemonSelect: React.FC<PokemonSelectProps> = ({ value, onChange }) => {
    const dataManager = DataManager.getInstance();

    const pokemonList = useMemo(() => {
        return Object.entries(dataManager.pokemon).map(([id, name]) => ({
            id: parseInt(id),
            name
        }));
    }, [dataManager.pokemon]);

    return (
        <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ width: '150px' }}
        >
            <option value={0}>Nothing</option>
            {pokemonList.map(p => (
                <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                </option>
            ))}
        </select>
    );
};
