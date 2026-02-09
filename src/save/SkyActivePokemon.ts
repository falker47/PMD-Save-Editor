
import { BitBlock } from '../utils/BitBlock';
import { CharacterEncoding } from '../utils/CharacterEncoding';
import { ExplorersPokemonId } from './SkyPokemon';
import { GenericPokemon, GenericMove } from './SaveFile';

export class ExplorersActiveAttack implements GenericMove {
    public static readonly bitLength: number = 29;
    public isValid: boolean = false;
    public isLinked: boolean = false;
    public isSwitched: boolean = false;
    public isSet: boolean = false;
    public isSealed: boolean = false;
    public id: number = 0;
    public pp: number = 0;
    public powerBoost: number = 0;

    constructor(bits?: BitBlock) {
        if (bits) {
            this.isValid = bits.getBit(0);
            this.isLinked = bits.getBit(1);
            this.isSwitched = bits.getBit(2);
            this.isSet = bits.getBit(3);
            this.isSealed = bits.getBit(4);
            this.id = bits.getInt(0, 5, 10);
            this.pp = bits.getInt(0, 15, 7);
            this.powerBoost = bits.getInt(0, 22, 7);
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(ExplorersActiveAttack.bitLength);
        bits.setBit(0, this.isValid);
        bits.setBit(1, this.isLinked);
        bits.setBit(2, this.isSwitched);
        bits.setBit(3, this.isSet);
        bits.setBit(4, this.isSealed);
        bits.setInt(0, 5, 10, this.id);
        bits.setInt(0, 15, 7, this.pp);
        bits.setInt(0, 22, 7, this.powerBoost);
        return bits;
    }
}

export class SkyActivePokemon implements GenericPokemon {
    public static readonly bitLength: number = 546;

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
    public unk4: BitBlock = new BitBlock(105);
    public iqMap: BitBlock = new BitBlock(69);
    public tactic: number = 0;
    public unk5: BitBlock = new BitBlock(15);
    public name: string = "";

    get speciesId(): number { return this.id.id; }
    set speciesId(val: number) { this.id.id = val; }

    get nickname(): string { return this.name; }
    set nickname(val: string) { this.name = val; }

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
            this.maxHP = bits.getInt(0, 91, 10);
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

            this.unk4 = bits.getRange(273, 105);
            this.iqMap = bits.getRange(378, 69);
            this.tactic = bits.getInt(0, 447, 4);
            this.unk5 = bits.getRange(451, 15);

            const nameBytes = bits.getRange(466, 80).toByteArray();
            this.name = CharacterEncoding.decode(nameBytes);
        } else {
            // Initialize default moves
            this.moves = [
                new ExplorersActiveAttack(),
                new ExplorersActiveAttack(),
                new ExplorersActiveAttack(),
                new ExplorersActiveAttack()
            ];
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(SkyActivePokemon.bitLength);
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

        bits.setRange(273, 105, this.unk4);
        bits.setRange(378, 69, this.iqMap);
        bits.setInt(0, 447, 4, this.tactic);
        bits.setRange(451, 15, this.unk5);

        const nameBytes = CharacterEncoding.encode(this.name, 10);
        const nameBlock = new BitBlock(nameBytes);
        bits.setRange(466, 80, nameBlock);

        return bits;
    }
}
