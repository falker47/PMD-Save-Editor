import { BitBlock } from '../utils/BitBlock';
import { GenericItem } from './SaveFile';

export enum ItemHolder {
    None = 0,
    Equipped = 1,
    Bag = 2,
    Stored = 3 // Not used for Held Items usually
}

export class ExplorersItem implements GenericItem {
    public id: number;
    public parameter: number;

    constructor(id: number = 0, parameter: number = 0) {
        this.id = id;
        this.parameter = parameter;
    }

    get isValid(): boolean {
        return this.id > 0;
    }

    set isValid(value: boolean) {
        // No-op for base item? Or set ID to 0 if false?
        if (!value) this.id = 0;
    }

    get isBox(): boolean {
        return this.id >= 364 && this.id <= 399;
    }

    get isUsedTM(): boolean {
        return this.id === 187;
    }

    get isStackableItem(): boolean {
        return this.id >= 1 && this.id <= 9;
    }

    get quantity(): number {
        return this.isStackableItem ? Math.min(Math.max(this.parameter, 0), 127) : 1;
    }

    set quantity(value: number) {
        if (this.isStackableItem) {
            this.parameter = value;
        }
    }

    get containedItemID(): number {
        if (this.isUsedTM) return this.parameter + 188;
        if (this.isBox) return this.parameter;
        return 0;
    }

    set containedItemID(value: number) {
        if (this.isUsedTM) this.parameter = value - 188;
        else if (this.isBox) this.parameter = value;
    }
}

export class SkyHeldItem extends ExplorersItem {
    private _isValid: boolean;
    public flag1: boolean = false;
    public flag2: boolean = false;
    public flag3: boolean = false;
    public flag4: boolean = false;
    public flag5: boolean = false;
    public flag6: boolean = false;
    public flag7: boolean = false;
    public holder: ItemHolder;

    get isValid(): boolean { return this._isValid; }
    set isValid(val: boolean) { this._isValid = val; }

    constructor(data?: BitBlock) {
        super();
        this._isValid = true;
        this.holder = ItemHolder.None;

        if (data) {
            this._isValid = data.getBit(0);
            this.flag1 = data.getBit(1);
            this.flag2 = data.getBit(2);
            this.flag3 = data.getBit(3);
            this.flag4 = data.getBit(4);
            this.flag5 = data.getBit(5);
            this.flag6 = data.getBit(6);
            this.flag7 = data.getBit(7);
            this.parameter = data.getInt(0, 8, 11);
            this.id = data.getInt(0, 19, 11);
            this.holder = data.getInt(0, 30, 3);
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(33);
        bits.setBit(0, this.isValid);
        bits.setBit(1, this.flag1);
        bits.setBit(2, this.flag2);
        bits.setBit(3, this.flag3);
        bits.setBit(4, this.flag4);
        bits.setBit(5, this.flag5);
        bits.setBit(6, this.flag6);
        bits.setBit(7, this.flag7);

        bits.setInt(0, 8, 11, this.parameter);
        bits.setInt(0, 19, 11, this.id);
        bits.setInt(0, 30, 3, this.holder);

        return bits;
    }
}
