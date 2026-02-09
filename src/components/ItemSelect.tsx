import React, { useMemo } from 'react';
import { DataManager } from '../utils/DataManager';

interface ItemSelectProps {
    value: number;
    onChange: (value: number) => void;
}

export const ItemSelect: React.FC<ItemSelectProps> = ({ value, onChange }) => {
    const dataManager = DataManager.getInstance();


    // Simple optimization: only compute list once or when data changes
    const items = useMemo(() => {
        return Object.entries(dataManager.items).map(([id, name]) => ({
            id: parseInt(id),
            name
        }));
    }, [dataManager.items]); // Dependency on loaded data? 
    // Actually items might be empty initially. We need to trigger re-render when data loads.
    // But DataManager is a singleton, not specific React state.
    // The parent component should probably wait for load.

    return (
        <select
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={{ width: '150px' }}
        >
            <option value={0}>Nothing</option>
            {items.map(item => (
                <option key={item.id} value={item.id}>
                    {item.name} ({item.id})
                </option>
            ))}
        </select>
    );
};
