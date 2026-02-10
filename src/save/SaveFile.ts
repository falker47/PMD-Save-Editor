export interface GenericItem {
    id: number;
    parameter: number; // Quantity for stackables, or specific param
    isValid: boolean;
}

export interface GenericPokemon {
    speciesId: number;
    name: string;
    level: number;
    nickname: string;
    isValid: boolean;

    // Stats
    hp: number;
    maxHP?: number; // Not present in all?
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    exp: number;
    iq: number;
    metAt?: number;

    // Moves
    moves: GenericMove[];

    // Metadata
    isFemale?: boolean;
}

export interface GenericMove {
    id: number;
    pp?: number;
    powerBoost?: number;
}

export interface SaveFile {
    gameType: 'Sky' | 'TimeDarkness' | 'RescueTeam';

    teamName: string;
    heldMoney?: number;
    storedMoney?: number;
    rescueTeamPoints?: number;
    rankPoints?: number; // For TD/Sky explorer rank points
    baseType?: number;

    heldItems: GenericItem[];
    storedItems: GenericItem[];

    activePokemon?: GenericPokemon[];
    storedPokemon: GenericPokemon[];

    toByteArray(): Uint8Array;
    isPrimaryChecksumValid(): boolean;
    isSecondaryChecksumValid(): boolean;
}
