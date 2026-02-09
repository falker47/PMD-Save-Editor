import { BitBlock } from '../utils/BitBlock';
import { ExplorersItem, ItemHolder } from './ExplorersItem';

export class TDHeldItem extends ExplorersItem {
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
            this.parameter = data.getInt(0, 8, 10);
            this.id = data.getInt(0, 18, 10);
            this.holder = data.getInt(0, 28, 3);
        }
    }

    toBitBlock(): BitBlock {
        const bits = new BitBlock(31);
        bits.setBit(0, this.isValid);
        bits.setBit(1, this.flag1);
        bits.setBit(2, this.flag2);
        bits.setBit(3, this.flag3);
        bits.setBit(4, this.flag4);
        bits.setBit(5, this.flag5);
        bits.setBit(6, this.flag6);
        bits.setBit(7, this.flag7);

        bits.setInt(0, 8, 10, this.parameter);
        bits.setInt(0, 18, 10, this.id);
        bits.setInt(0, 28, 3, this.holder);

        return bits;
    }

    clone(): TDHeldItem {
        return new TDHeldItem(this.toBitBlock());
    }
}
