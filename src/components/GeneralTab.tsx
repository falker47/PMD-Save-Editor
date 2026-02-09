import React from 'react';
import { SaveFile } from '../save/SaveFile';
import { SkySave } from '../save/SkySave';
import { PokemonSelect } from './PokemonSelect';

import { useTranslation } from '../hooks/useTranslation';

interface GeneralTabProps {
    save: SaveFile;
    onUpdate: () => void;
    language: string;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({ save, onUpdate, language }) => {
    const { t } = useTranslation(language);
    const isSky = save.gameType === 'Sky';
    const skySave = isSky ? (save as SkySave) : null;

    // We bind directly to the save object for now, triggering re-renders via onUpdate

    return (
        <div className="card">
            <h2>{t('General')}</h2>

            <div className="form-group">
                <label>{t('TeamName')}</label>
                <input
                    type="text"
                    maxLength={10}
                    value={save.teamName}
                    onChange={(e) => {
                        save.teamName = e.target.value;
                        onUpdate();
                    }}
                />
            </div>

            {(save.heldMoney !== undefined) && (
                <div className="form-group">
                    <label>{t('HeldMoney')}</label>
                    <input
                        type="number"
                        value={save.heldMoney}
                        onChange={(e) => {
                            save.heldMoney = parseInt(e.target.value) || 0;
                            onUpdate();
                        }}
                    />
                </div>
            )}

            {(save.storedMoney !== undefined) && (
                <div className="form-group">
                    <label>{t('StoredMoney')}</label>
                    <input
                        type="number"
                        value={save.storedMoney}
                        onChange={(e) => {
                            save.storedMoney = parseInt(e.target.value) || 0;
                            onUpdate();
                        }}
                    />
                </div>
            )}

            {(save.rescueTeamPoints !== undefined) && (
                <div className="form-group">
                    <label>{t('RescuePoints')}</label>
                    <input
                        type="number"
                        value={save.rescueTeamPoints}
                        onChange={(e) => {
                            save.rescueTeamPoints = parseInt(e.target.value) || 0;
                            onUpdate();
                        }}
                    />
                </div>
            )}

            {(save.baseType !== undefined) && (
                <div className="form-group">
                    <label>{t('BaseType')}</label>
                    <input
                        type="number"
                        value={save.baseType}
                        onChange={(e) => {
                            save.baseType = parseInt(e.target.value) || 0;
                            onUpdate();
                        }}
                    />
                </div>
            )}

            {isSky && skySave && (
                <>
                    <div className="form-group">
                        <label>{t('Adventures')}</label>
                        <input
                            type="number"
                            value={skySave.numberOfAdventures}
                            onChange={(e) => {
                                skySave.numberOfAdventures = parseInt(e.target.value) || 0;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('RankPoints')}</label>
                        <input
                            type="number"
                            value={skySave.explorerRankPoints}
                            onChange={(e) => {
                                skySave.explorerRankPoints = parseInt(e.target.value) || 0;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('OriginalPlayerGeneric')}</label>
                        <PokemonSelect
                            value={skySave.originalPlayerId.id}
                            onChange={(val) => {
                                skySave.originalPlayerId.id = val;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('OriginalPartnerGeneric')}</label>
                        <PokemonSelect
                            value={skySave.originalPartnerId.id}
                            onChange={(val) => {
                                skySave.originalPartnerId.id = val;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Original Player Name</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={skySave.originalPlayerName}
                            onChange={(e) => {
                                skySave.originalPlayerName = e.target.value;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Original Partner Name</label>
                        <input
                            type="text"
                            maxLength={10}
                            value={skySave.originalPartnerName}
                            onChange={(e) => {
                                skySave.originalPartnerName = e.target.value;
                                onUpdate();
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Window Frame Type</label>
                        <input
                            type="number"
                            value={skySave.windowFrameType}
                            onChange={(e) => {
                                skySave.windowFrameType = parseInt(e.target.value) || 0;
                                onUpdate();
                            }}
                        />
                    </div>
                </>
            )}

        </div>
    );
};
