import { BitBlock } from '../utils/BitBlock';
import { ExplorersPokemonId } from './SkyPokemon';


export class SkyQuicksaveAttack {
    public static readonly bitLength: number = 48;

    public isValid: boolean = false;
    public isLinked: boolean = false;
    public isSwitched: boolean = false;
    public isSet: boolean = false;
    public isSealed: boolean = false;
    public unknown: BitBlock = new BitBlock(11);
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
            this.unknown = bits.getRange(5, 11);
            this.id = bits.getInt(0, 16, 16);
            this.pp = bits.getInt(0, 32, 8);
            this.powerBoost = bits.getInt(0, 40, 8);
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(SkyQuicksaveAttack.bitLength);
        bits.setBit(0, this.isValid);
        bits.setBit(1, this.isLinked);
        bits.setBit(2, this.isSwitched);
        bits.setBit(3, this.isSet);
        bits.setBit(4, this.isSealed);
        bits.setRange(5, 11, this.unknown);
        bits.setInt(0, 16, 16, this.id);
        bits.setInt(0, 32, 8, this.pp);
        bits.setInt(0, 40, 8, this.powerBoost);
        return bits;
    }
}

export class SkyQuicksavePokemon {
    public static readonly bitLength: number = 3432; // 429 * 8

    public unk1: BitBlock = new BitBlock(80);
    public transformedID: ExplorersPokemonId = new ExplorersPokemonId();
    public id: ExplorersPokemonId = new ExplorersPokemonId();
    public unk2: BitBlock = new BitBlock(48);
    public level: number = 0;
    public unk3: BitBlock = new BitBlock(48);
    public currentHP: number = 0;
    public maxHP: number = 0;
    public hpBoost: number = 0;
    public unk4: BitBlock = new BitBlock(32);
    public attack: number = 0;
    public defense: number = 0;
    public spAttack: number = 0;
    public spDefense: number = 0;
    public exp: number = 0;
    public unk5: BitBlock = new BitBlock(2408);
    public moves: SkyQuicksaveAttack[] = [];
    public unk6: BitBlock = new BitBlock(592);

    constructor(bits?: BitBlock) {
        if (bits) {
            this.unk1 = bits.getRange(0, 80);
            this.transformedID = new ExplorersPokemonId(bits.getInt(0, 80, 16));
            this.id = new ExplorersPokemonId(bits.getInt(0, 96, 16));
            this.unk2 = bits.getRange(112, 48);
            this.level = bits.getInt(0, 144, 8);
            this.unk3 = bits.getRange(152, 48);
            this.currentHP = bits.getInt(0, 192, 16);
            this.maxHP = bits.getInt(0, 208, 16);
            this.hpBoost = bits.getInt(0, 224, 16);
            this.unk4 = bits.getRange(240, 32);
            this.attack = bits.getInt(0, 256, 8);
            this.defense = bits.getInt(0, 264, 8);
            this.spAttack = bits.getInt(0, 272, 8);
            this.spDefense = bits.getInt(0, 280, 8);
            // Note: C# Legacy load uses 280 for Exp but save uses 288. 
            // We use 288 for load to match save structure/logic, assuming 280 was a bug or overlapping read.
            this.exp = bits.getInt(0, 288, 32);

            this.unk5 = bits.getRange(320, 2408);

            this.moves = [
                new SkyQuicksaveAttack(bits.getRange(2696 + 0 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength)),
                new SkyQuicksaveAttack(bits.getRange(2696 + 1 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength)),
                new SkyQuicksaveAttack(bits.getRange(2696 + 2 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength)),
                new SkyQuicksaveAttack(bits.getRange(2696 + 3 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength))
            ];

            this.unk6 = bits.getRange(2840, 592);
        } else {
            this.moves = [
                new SkyQuicksaveAttack(),
                new SkyQuicksaveAttack(),
                new SkyQuicksaveAttack(),
                new SkyQuicksaveAttack()
            ];
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(SkyQuicksavePokemon.bitLength);
        bits.setRange(0, 80, this.unk1);
        bits.setInt(0, 80, 16, this.transformedID.rawID);
        bits.setInt(0, 96, 16, this.id.rawID);
        bits.setRange(112, 48, this.unk2);
        bits.setInt(0, 144, 8, this.level);
        bits.setRange(152, 48, this.unk3);
        bits.setInt(0, 192, 16, this.currentHP);
        bits.setInt(0, 208, 16, this.maxHP);
        bits.setInt(0, 224, 16, this.hpBoost);
        bits.setRange(240, 32, this.unk4);
        bits.setInt(0, 256, 8, this.attack);
        bits.setInt(0, 264, 8, this.defense);
        bits.setInt(0, 272, 8, this.spAttack);
        bits.setInt(0, 280, 8, this.spDefense);
        bits.setInt(0, 288, 32, this.exp);
        bits.setRange(320, 2408, this.unk5);

        bits.setRange(2696 + 0 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength, this.moves[0].toBitBlock());
        bits.setRange(2696 + 1 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength, this.moves[1].toBitBlock());
        bits.setRange(2696 + 2 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength, this.moves[2].toBitBlock());
        bits.setRange(2696 + 3 * SkyQuicksaveAttack.bitLength, SkyQuicksaveAttack.bitLength, this.moves[3].toBitBlock());

        bits.setRange(2840, 592, this.unk6);

        return bits;
    }
}
