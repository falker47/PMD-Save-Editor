import React, { useState, useEffect } from 'react';
import { DataManager } from '../utils/DataManager';

interface MoveSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export const MoveSelect: React.FC<MoveSelectProps> = ({ value, onChange }) => {
    // Native select for performance with large lists
    const dataManager = DataManager.getInstance();
    const [moves, setMoves] = useState<Record<number, string>>({});

    useEffect(() => {
        setMoves(dataManager.moves);
    }, []);

    // Convert object to sorted array for display
    const sortedMoves = Object.entries(moves)
        .map(([id, name]) => ({ id: parseInt(id), name }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ width: '100%' }}
        >
            <option value={0}>Nothing</option>
            {sortedMoves.map((move) => (
                <option key={move.id} value={move.id}>
                    {move.name}
                </option>
            ))}
        </select>
    );
};
