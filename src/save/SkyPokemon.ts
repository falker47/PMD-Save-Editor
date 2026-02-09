import { BitBlock } from '../utils/BitBlock';
import { CharacterEncoding } from '../utils/CharacterEncoding';
import { GenericPokemon, GenericMove } from './SaveFile';

export class ExplorersPokemonId {
    public rawID: number;

    constructor(rawID: number = 0) {
        this.rawID = rawID;
    }

    get id(): number {
        return this.rawID >= 600 ? this.rawID - 600 : this.rawID;
    }

    set id(value: number) {
        if (this.rawID >= 600) {
            this.rawID = value + 600;
        } else {
            this.rawID = value;
        }
    }

    get isFemale(): boolean {
        return this.rawID >= 600;
    }

    set isFemale(value: boolean) {
        if (this.rawID >= 600) {
            if (!value) this.rawID -= 600;
        } else {
            if (value) this.rawID += 600;
        }
    }
}

export class ExplorersAttack implements GenericMove {
    public static readonly bitLength: number = 21;
    public id: number;
    public linked: boolean;
    public switched: boolean;
    public set: boolean;
    public powerBoost: number;

    constructor(bits?: BitBlock) {
        if (bits) {
            this.linked = bits.getBit(1);
            this.switched = bits.getBit(2);
            this.set = bits.getBit(3);
            this.set = bits.getBit(3);
            this.id = bits.getInt(0, 4, 10);
            this.powerBoost = bits.getInt(0, 14, 7);
        } else {
            this.linked = false;
            this.switched = false;
            this.switched = false;
            this.set = false;
            this.id = 0;
            this.powerBoost = 0;
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(ExplorersAttack.bitLength);
        bits.setBit(0, this.id > 0); // IsValid inferred from ID > 0 or explicitly true
        bits.setBit(1, this.linked);
        bits.setBit(2, this.switched);
        bits.setBit(3, this.set);
        bits.setInt(0, 4, 10, this.id);
        bits.setInt(0, 14, 7, this.powerBoost);
        return bits;
    }
}

export class SkyStoredPokemon implements GenericPokemon {
    public static readonly bitLength: number = 362;

    public isValid: boolean = false;
    public level: number = 0;
    public id: ExplorersPokemonId = new ExplorersPokemonId();
    public metAt: number = 0;
    public metFloor: number = 0;
    public unk1: boolean = false;
    public evolvedAtLevel1: number = 0;
    public evolvedAtLevel2: number = 0;
    public iq: number = 0;
    public hp: number = 0;
    public attack: number = 0;
    public defense: number = 0;
    public spAttack: number = 0;
    public spDefense: number = 0;
    public exp: number = 0;
    public iqMap: BitBlock = new BitBlock(69);
    public tactic: number = 0;
    public moves: ExplorersAttack[] = [];
    public name: string = "";

    get speciesId(): number { return this.id.id; }
    set speciesId(val: number) { this.id.id = val; }

    get nickname(): string { return this.name; }
    set nickname(val: string) { this.name = val; }

    constructor(bits?: BitBlock) {
        if (bits) {
            this.isValid = bits.getBit(0);
            this.level = bits.getInt(0, 1, 7);
            this.id = new ExplorersPokemonId(bits.getInt(0, 8, 11));
            // ... loads remaining fields based on offsets
            this.metAt = bits.getInt(0, 19, 8);
            this.metFloor = bits.getInt(0, 27, 7);
            this.unk1 = bits.getBit(34);
            this.evolvedAtLevel1 = bits.getInt(0, 35, 7);
            this.evolvedAtLevel2 = bits.getInt(0, 42, 7);
            this.iq = bits.getInt(0, 49, 10);
            this.hp = bits.getInt(0, 59, 10);
            this.attack = bits.getInt(0, 69, 8);
            this.spAttack = bits.getInt(0, 77, 8);
            this.defense = bits.getInt(0, 85, 8);
            this.spDefense = bits.getInt(0, 93, 8);
            this.exp = bits.getInt(0, 101, 24);
            this.iqMap = bits.getRange(125, 69);
            this.tactic = bits.getInt(0, 194, 4);

            this.moves = [
                new ExplorersAttack(bits.getRange(198, 21)),
                new ExplorersAttack(bits.getRange(219, 21)),
                new ExplorersAttack(bits.getRange(240, 21)),
                new ExplorersAttack(bits.getRange(261, 21))
            ];

            // Decode name using custom encoding
            // bits.getStringPMD(0, 282, 10) -> GetRange(282, 80) -> ToByte array
            const nameBytes = bits.getRange(282, 80).toByteArray();
            this.name = CharacterEncoding.decode(nameBytes);
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(SkyStoredPokemon.bitLength);
        bits.setBit(0, this.isValid);
        bits.setInt(0, 1, 7, this.level);
        bits.setInt(0, 8, 11, this.id.rawID);
        bits.setInt(0, 19, 8, this.metAt);
        bits.setInt(0, 27, 7, this.metFloor);
        bits.setBit(34, this.unk1);
        bits.setInt(0, 35, 7, this.evolvedAtLevel1);
        bits.setInt(0, 42, 7, this.evolvedAtLevel2);
        bits.setInt(0, 49, 10, this.iq);
        bits.setInt(0, 59, 10, this.hp);
        bits.setInt(0, 69, 8, this.attack);
        bits.setInt(0, 77, 8, this.spAttack);
        bits.setInt(0, 85, 8, this.defense);
        bits.setInt(0, 93, 8, this.spDefense);
        bits.setInt(0, 101, 24, this.exp);
        bits.setRange(125, 69, this.iqMap);
        bits.setInt(0, 194, 4, this.tactic);

        bits.setRange(198, 21, this.moves[0]?.toBitBlock() || new BitBlock(21));
        bits.setRange(219, 21, this.moves[1]?.toBitBlock() || new BitBlock(21));
        bits.setRange(240, 21, this.moves[2]?.toBitBlock() || new BitBlock(21));
        bits.setRange(261, 21, this.moves[3]?.toBitBlock() || new BitBlock(21));

        // Encode Name
        const nameBytes = CharacterEncoding.encode(this.name, 10);
        // SetStringPMD logic:
        // C# logic: for i < byteLength: SetInt(0, i*8 + index, 8, buffer[i])
        // Here index is 282 (bits).
        const nameBlock = new BitBlock(nameBytes);
        bits.setRange(282, 80, nameBlock);

        return bits;
    }
}
