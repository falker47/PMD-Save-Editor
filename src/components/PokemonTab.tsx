import React, { useState } from 'react';
import { SaveFile, GenericPokemon } from '../save/SaveFile';
import { SkySave } from '../save/SkySave';
import { PokemonSelect } from './PokemonSelect';
import { MoveSelect } from './MoveSelect';
import { DataManager } from '../utils/DataManager';

import { useTranslation } from '../hooks/useTranslation';

interface PokemonTabProps {
    save: SaveFile;
    onUpdate: () => void;
    language: string;
}

export const PokemonTab: React.FC<PokemonTabProps> = ({ save, onUpdate, language }) => {
    const { t } = useTranslation(language);
    const [mode, setMode] = useState<'recruited' | 'active' | 'special'>('recruited');
    const [selectedStored, setSelectedStored] = useState<GenericPokemon | null>(null);
    const [selectedActive, setSelectedActive] = useState<GenericPokemon | null>(null);
    const [page, setPage] = useState(0);
    const itemsPerPage = 50;
    const dataManager = DataManager.getInstance();

    const isSky = save.gameType === 'Sky';
    const skySave = isSky ? (save as SkySave) : null;

    // Reset selection when switching modes
    const handleModeChange = (newMode: 'recruited' | 'active' | 'special') => {
        setMode(newMode);
        setSelectedStored(null);
        setSelectedActive(null);
        setPage(0);
    };

    const renderList = () => {
        if (mode === 'recruited') {
            const paginatedPokemon = save.storedPokemon.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
            const totalPages = Math.ceil(save.storedPokemon.length / itemsPerPage);

            return (
                <>
                    <h2>{t('StoredPokemon')} ({save.storedPokemon.length})</h2>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Lvl</th>
                                    <th>Species</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPokemon.map((pkm, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                                        <td>{page * itemsPerPage + idx + 1}</td>
                                        <td>{pkm.isValid ? pkm.nickname : '---'}</td>
                                        <td>{pkm.isValid ? pkm.level : '-'}</td>
                                        <td>
                                            {pkm.isValid
                                                ? `${dataManager.getPokemonName(pkm.speciesId)}`
                                                : '-'
                                            }
                                        </td>
                                        <td>
                                            <button
                                                style={{ padding: '2px 5px', fontSize: '0.8em' }}
                                                onClick={() => setSelectedStored(pkm)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'center', gap: '0.5em' }}>
                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>&lt;</button>
                        <span>Page {page + 1} / {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>&gt;</button>
                    </div>
                </>
            );
        } else {
            const isRB = save.gameType === 'RescueTeam';
            const list = mode === 'active' ? (save.activePokemon || []) : (skySave ? skySave.spEpisodeActivePokemon : []);

            if (mode === 'active' && isRB) {
                return <div className="card">Rescue Team uses the recruited list for active party members. Check the Recruited tab.</div>;
            }

            if (mode === 'active' && !save.activePokemon) {
                return <div>No active pokemon data available for this save type.</div>;
            }

            return (
                <>
                    <h2>{mode === 'active' ? t('ActivePokemonHeader') : t('SpEpisodeParty')} ({list.length})</h2>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #555' }}>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Lvl</th>
                                    <th>Species</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((pkm, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
                                        <td>{idx + 1}</td>
                                        <td>{pkm.isValid ? pkm.nickname : '---'}</td>
                                        <td>{pkm.isValid ? pkm.level : '-'}</td>
                                        <td>
                                            {pkm.isValid
                                                ? `${dataManager.getPokemonName(pkm.speciesId)}`
                                                : '-'
                                            }
                                        </td>
                                        <td>
                                            <button
                                                style={{ padding: '2px 5px', fontSize: '0.8em' }}
                                                onClick={() => setSelectedActive(pkm)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            );
        }
    };

    return (
        <div style={{ display: 'flex', gap: '1em' }}>
            <div className="card" style={{ flex: 1, maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <button disabled={mode === 'recruited'} onClick={() => handleModeChange('recruited')}>Recruited</button>
                    <button disabled={mode === 'active'} onClick={() => handleModeChange('active')}>Active Team</button>
                    {isSky && (
                        <button disabled={mode === 'special'} onClick={() => handleModeChange('special')}>Special Episode</button>
                    )}
                </div>
                {renderList()}
            </div>

            <div className="card" style={{ flex: 1 }}>
                <h2>Edit Pokemon</h2>
                {mode === 'recruited' && selectedStored && (
                    <GenericPokemonEditor pokemon={selectedStored} onUpdate={onUpdate} isSky={isSky} />
                )}
                {(mode === 'active' || mode === 'special') && selectedActive && (
                    <GenericPokemonEditor pokemon={selectedActive} onUpdate={onUpdate} isSky={isSky} />
                )}
                {((mode === 'recruited' && !selectedStored) || ((mode !== 'recruited') && !selectedActive)) && (
                    <p>Select a Pokemon to edit.</p>
                )}
            </div>
        </div>
    );
};

interface GenericPokemonEditorProps {
    pokemon: GenericPokemon;
    onUpdate: () => void;
    isSky: boolean;
}

const GenericPokemonEditor: React.FC<GenericPokemonEditorProps> = ({ pokemon, onUpdate, isSky }) => {
    // Helper to cast to SkyStoredPokemon for Sky-specific fields
    const skyPokemon = isSky ? (pokemon as any) : null;
    // Using any for casting to access specific fields if we know they exist. 
    // Better would be to have discriminating union or type guard.

    return (
        <div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={pokemon.isValid}
                        onChange={(e) => {
                            pokemon.isValid = e.target.checked;
                            onUpdate();
                        }}
                    />
                    Is Valid
                </label>
            </div>

            {pokemon.isValid && (
                <>
                    <div className="form-group">
                        <label>Nickname</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={pokemon.nickname}
                            onChange={(e) => {
                                pokemon.nickname = e.target.value;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Species</label>
                        <PokemonSelect
                            value={pokemon.speciesId}
                            onChange={(val) => {
                                pokemon.speciesId = val;
                                onUpdate();
                            }}
                        />
                    </div>

                    {isSky && skyPokemon && skyPokemon.id && (
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={skyPokemon.id.isFemale}
                                    onChange={(e: any) => {
                                        skyPokemon.id.isFemale = e.target.checked;
                                        onUpdate();
                                    }}
                                />
                                Is Female
                            </label>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Level</label>
                        <input
                            type="number"
                            min={1}
                            max={100}
                            value={pokemon.level}
                            onChange={(e) => {
                                pokemon.level = parseInt(e.target.value) || 1;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience</label>
                        <input
                            type="number"
                            value={pokemon.exp}
                            onChange={(e) => {
                                pokemon.exp = parseInt(e.target.value) || 0;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1em' }}>
                        <div className="form-group">
                            <label>HP / Max</label>
                            <input
                                type="number"
                                style={{ width: '60px' }}
                                value={pokemon.hp}
                                onChange={(e) => {
                                    pokemon.hp = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                        {pokemon.maxHP !== undefined && (
                            <div className="form-group">
                                <label>Max HP</label>
                                <input
                                    type="number"
                                    style={{ width: '60px' }}
                                    value={pokemon.maxHP}
                                    onChange={(e) => {
                                        pokemon.maxHP = parseInt(e.target.value) || 0;
                                        onUpdate();
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '1em' }}>
                        <div className="form-group">
                            <label>Atk</label>
                            <input
                                type="number"
                                style={{ width: '50px' }}
                                value={pokemon.attack}
                                onChange={(e) => {
                                    pokemon.attack = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Def</label>
                            <input
                                type="number"
                                style={{ width: '50px' }}
                                value={pokemon.defense}
                                onChange={(e) => {
                                    pokemon.defense = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Sp.Atk</label>
                            <input
                                type="number"
                                style={{ width: '50px' }}
                                value={pokemon.spAttack}
                                onChange={(e) => {
                                    pokemon.spAttack = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Sp.Def</label>
                            <input
                                type="number"
                                style={{ width: '50px' }}
                                value={pokemon.spDefense}
                                onChange={(e) => {
                                    pokemon.spDefense = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>IQ</label>
                        <input
                            type="number"
                            value={pokemon.iq}
                            onChange={(e) => {
                                pokemon.iq = parseInt(e.target.value) || 0;
                                onUpdate();
                            }}
                        />
                    </div>

                    {pokemon.metAt !== undefined && (
                        <div className="form-group">
                            <label>Met At (Location ID)</label>
                            <input
                                type="number"
                                value={pokemon.metAt}
                                onChange={(e) => {
                                    pokemon.metAt = parseInt(e.target.value) || 0;
                                    onUpdate();
                                }}
                            />
                        </div>
                    )}

                    <h3>Moves</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em' }}>
                        {pokemon.moves.map((move, idx) => (
                            <div key={idx} className="form-group">
                                <label>Move {idx + 1}</label>
                                <div style={{ display: 'flex', gap: '0.5em' }}>
                                    <div style={{ flex: 3 }}>
                                        <MoveSelect
                                            value={move.id}
                                            onChange={(val) => {
                                                move.id = val;
                                                onUpdate();
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.8em' }}>Ginseng</label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={99}
                                            value={move.powerBoost || 0}
                                            onChange={(e) => {
                                                move.powerBoost = parseInt(e.target.value) || 0;
                                                onUpdate();
                                            }}
                                            style={{ width: '100%' }}
                                            placeholder="+0"
                                        />
                                    </div>
                                </div>
                                {move.pp !== undefined && (
                                    <div>PP: {move.pp}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
