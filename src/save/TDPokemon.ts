import { BitBlock } from '../utils/BitBlock';
import { CharacterEncoding } from '../utils/CharacterEncoding';
import { ExplorersPokemonId, ExplorersAttack } from './SkyPokemon';
import { ExplorersActiveAttack } from './SkyActivePokemon';
import { GenericPokemon } from './SaveFile';

export class TDStoredPokemon implements GenericPokemon {
    public static readonly bitLength: number = 388;

    public isValid: boolean = false; // Inferred or explicit? Legacy says Bit 0 is always 1.
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
    public spAttack: number = 0;
    public defense: number = 0;
    public spDefense: number = 0;
    public exp: number = 0;
    public iqMap: BitBlock = new BitBlock(92);
    public tactic: number = 0;
    public moves: ExplorersAttack[] = [];
    public name: string = "";
    public unk2: BitBlock = new BitBlock(3);

    get speciesId(): number { return this.id.id; }
    set speciesId(val: number) { this.id.id = val; }

    get nickname(): string { return this.name; }
    set nickname(val: string) { this.name = val; }

    get isFemale(): boolean { return this.id.isFemale; }
    set isFemale(val: boolean) { this.id.isFemale = val; }

    constructor(bits?: BitBlock) {
        if (bits) {
            // Legacy: Bit 0 prevents "SetInt" overriding it? 
            // Legacy GetStoredPokemonBits sets bit 0 to true.
            this.isValid = true; // Always valid if loaded? Legacy: IsValid => Level > 0.

            this.level = bits.getInt(0, 1, 7);
            this.id = new ExplorersPokemonId(bits.getInt(0, 8, 11));
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
            this.iqMap = bits.getRange(125, 92);
            this.tactic = bits.getInt(0, 217, 4);

            this.moves = [
                new ExplorersAttack(bits.getRange(221, 21)),
                new ExplorersAttack(bits.getRange(242, 21)),
                new ExplorersAttack(bits.getRange(263, 21)),
                new ExplorersAttack(bits.getRange(284, 21))
            ];

            const nameBytes = bits.getRange(305, 80).toByteArray();
            this.name = CharacterEncoding.decode(nameBytes);
            this.unk2 = bits.getRange(385, 3);
        } else {
            this.moves = [new ExplorersAttack(), new ExplorersAttack(), new ExplorersAttack(), new ExplorersAttack()];
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(TDStoredPokemon.bitLength);
        bits.setBit(0, true);
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
        bits.setRange(125, 92, this.iqMap);
        bits.setInt(0, 217, 4, this.tactic);

        bits.setRange(221, 21, this.moves[0]?.toBitBlock() || new BitBlock(21));
        bits.setRange(242, 21, this.moves[1]?.toBitBlock() || new BitBlock(21));
        bits.setRange(263, 21, this.moves[2]?.toBitBlock() || new BitBlock(21));
        bits.setRange(284, 21, this.moves[3]?.toBitBlock() || new BitBlock(21));

        const nameBytes = CharacterEncoding.encode(this.name, 10);
        const nameBlock = new BitBlock(nameBytes);
        bits.setRange(305, 80, nameBlock);

        bits.setRange(385, 3, this.unk2);

        return bits;
    }
}

export class TDActivePokemon implements GenericPokemon {
    public static readonly bitLength: number = 544;

    public isValid: boolean = false;
    public unk1: BitBlock = new BitBlock(4);
    public level: number = 0;
    public metAt: number = 0;
    public metFloor: number = 0;
    public unk2: boolean = false;
    public iq: number = 0;
    public rosterNumber: number = 0;
    public unk3: BitBlock = new BitBlock(22);
    public id: ExplorersPokemonId = new ExplorersPokemonId();
    public currentHP: number = 0;
    public maxHP: number = 0;
    public attack: number = 0;
    public spAttack: number = 0;
    public defense: number = 0;
    public spDefense: number = 0;
    public exp: number = 0;
    public moves: ExplorersActiveAttack[] = [];
    public unk4: BitBlock = new BitBlock(191);
    public name: string = "";

    get speciesId(): number { return this.id.id; }
    set speciesId(val: number) { this.id.id = val; }

    get nickname(): string { return this.name; }
    set nickname(val: string) { this.name = val; }

    get isFemale(): boolean { return this.id.isFemale; }
    set isFemale(val: boolean) { this.id.isFemale = val; }

    get hp(): number { return this.currentHP; }
    set hp(val: number) { this.currentHP = val; }

    constructor(bits?: BitBlock) {
        if (bits) {
            this.isValid = bits.getBit(0);
            this.unk1 = bits.getRange(1, 4);
            this.level = bits.getInt(0, 5, 7);
            this.metAt = bits.getInt(0, 12, 8);
            this.metFloor = bits.getInt(0, 20, 7);
            this.unk2 = bits.getBit(27);
            this.iq = bits.getInt(0, 28, 10);
            this.rosterNumber = bits.getInt(0, 38, 10);
            this.unk3 = bits.getRange(48, 22);
            this.id = new ExplorersPokemonId(bits.getInt(0, 70, 11));
            this.currentHP = bits.getInt(0, 81, 10);
            this.maxHP = bits.getInt(0, 91, 10); // Corrected from legacy bug (offset 81 -> 91)
            this.attack = bits.getInt(0, 101, 8);
            this.spAttack = bits.getInt(0, 109, 8);
            this.defense = bits.getInt(0, 117, 8);
            this.spDefense = bits.getInt(0, 125, 8);
            this.exp = bits.getInt(0, 133, 24);

            this.moves = [
                new ExplorersActiveAttack(bits.getRange(157, 29)),
                new ExplorersActiveAttack(bits.getRange(186, 29)),
                new ExplorersActiveAttack(bits.getRange(215, 29)),
                new ExplorersActiveAttack(bits.getRange(244, 29))
            ];

            this.unk4 = bits.getRange(273, 191);

            const nameBytes = bits.getRange(464, 80).toByteArray();
            this.name = CharacterEncoding.decode(nameBytes);
        } else {
            this.moves = [new ExplorersActiveAttack(), new ExplorersActiveAttack(), new ExplorersActiveAttack(), new ExplorersActiveAttack()];
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(TDActivePokemon.bitLength);
        bits.setBit(0, this.isValid);
        bits.setRange(1, 4, this.unk1);
        bits.setInt(0, 5, 7, this.level);
        bits.setInt(0, 12, 8, this.metAt);
        bits.setInt(0, 20, 7, this.metFloor);
        bits.setBit(27, this.unk2);
        bits.setInt(0, 28, 10, this.iq);
        bits.setInt(0, 38, 10, this.rosterNumber);
        bits.setRange(48, 22, this.unk3);
        bits.setInt(0, 70, 11, this.id.rawID);
        bits.setInt(0, 81, 10, this.currentHP);
        bits.setInt(0, 91, 10, this.maxHP);
        bits.setInt(0, 101, 8, this.attack);
        bits.setInt(0, 109, 8, this.spAttack);
        bits.setInt(0, 117, 8, this.defense);
        bits.setInt(0, 125, 8, this.spDefense);
        bits.setInt(0, 133, 24, this.exp);

        bits.setRange(157, 29, this.moves[0]?.toBitBlock() || new BitBlock(29));
        bits.setRange(186, 29, this.moves[1]?.toBitBlock() || new BitBlock(29));
        bits.setRange(215, 29, this.moves[2]?.toBitBlock() || new BitBlock(29));
        bits.setRange(244, 29, this.moves[3]?.toBitBlock() || new BitBlock(29));

        bits.setRange(273, 191, this.unk4);

        const nameBytes = CharacterEncoding.encode(this.name, 10);
        const nameBlock = new BitBlock(nameBytes);
        bits.setRange(464, 80, nameBlock);

        return bits;
    }
}
