import { BitBlock } from '../utils/BitBlock';
import { CharacterEncoding } from '../utils/CharacterEncoding';
import { RBHeldItem, RBStoredItem } from './RBItem';
import { RBStoredPokemon } from './RBPokemon';
import { SaveFile } from './SaveFile';

export class RBOffsets {
    // Checksums
    get ChecksumEnd(): number { return 0x57D0; }
    get BackupSaveStart(): number { return 0x6000; }

    // General
    get TeamNameStart(): number { return 0x4EC8 * 8; }
    get TeamNameLength(): number { return 10; }
    get BaseTypeOffset(): number { return 0x67 * 8; }
    get HeldMoneyOffset(): number { return 0x4E6C * 8; }
    get HeldMoneyLength(): number { return 24; }
    get StoredMoneyOffset(): number { return 0x4E6F * 8; }
    get StoredMoneyLength(): number { return 24; }
    get RescuePointsOffset(): number { return 0x4ED3 * 8; }
    get RescuePointsLength(): number { return 32; }

    // Stored Items
    get StoredItemOffset(): number { return 0x4D2B * 8 - 2; }
    get StoredItemCount(): number { return 239; }

    // Held Items
    get HeldItemOffset(): number { return 0x4CF0 * 8; }
    get HeldItemCount(): number { return 20; }
    get HeldItemLength(): number { return 23; }

    // Stored Pokemon
    get StoredPokemonOffset(): number { return (0x5B3 * 8 + 3) - (323 * 9); }
    get StoredPokemonLength(): number { return 323; } // Note: 362 in RBPokemon.ts? Legacy RBSave.cs says 323. RBPokemon defines 362.
    // Wait, Legacy RBStoredPokemon.cs says BitLength = 362.
    // Legacy RBSave.cs says StoredPokemonLength => 323.
    // THIS IS A MAJOR CONFLICT.
    // Let's re-read legacy files carefully.

    get StoredPokemonCount(): number { return 407 + 6; }
}

export class RBEUOffsets extends RBOffsets {
    get TeamNameStart(): number { return 0x4ECC * 8; }
    get HeldMoneyOffset(): number { return 0x4E70 * 8; }
    get StoredMoneyOffset(): number { return 0x4E73 * 8; }
    get RescuePointsOffset(): number { return 0x4ED7 * 8; }
    get StoredItemOffset(): number { return 0x4D2F * 8 - 2; }
    get HeldItemOffset(): number { return 0x4CF4 * 8; }
    get StoredPokemonOffset(): number { return (0x5B7 * 8 + 3) - (323 * 9); }
}

export class RBSave implements SaveFile {
    public gameType: 'RescueTeam' = 'RescueTeam';
    public bits: BitBlock;
    public offsets: RBOffsets;

    public static async isOfType(data: Uint8Array): Promise<boolean> {
        if (data.length < 0x57D0) return false;
        const bits = new BitBlock(data);
        const usChecksum = RBSave.calculate32BitChecksumStatic(bits, 4, 0x57D0);
        const fileChecksum = bits.getUInt(0, 0, 32);
        return fileChecksum === usChecksum || fileChecksum === (usChecksum - 1) >>> 0;
    }

    private static calculate32BitChecksumStatic(bits: BitBlock, startIndex: number, endIndex: number): number {
        let sum = 0;
        for (let i = startIndex; i <= endIndex; i += 4) {
            sum += bits.getUInt(0, i * 8, 32);
        }
        return sum >>> 0;
    }

    // Checksums
    public primaryChecksum: number = 0;
    public secondaryChecksum: number = 0;

    // General
    public teamName: string = "";
    public heldMoney: number = 0;
    public storedMoney: number = 0;
    public rescueTeamPoints: number = 0;
    public baseType: number = 0;

    // Lists
    public storedItems: RBStoredItem[] = [];
    public heldItems: RBHeldItem[] = [];
    public storedPokemon: RBStoredPokemon[] = [];

    constructor(data: Uint8Array) {
        this.bits = new BitBlock(data);
        this.offsets = new RBOffsets();
        this.init();
    }

    private init(): void {
        this.primaryChecksum = this.bits.getUInt(0, 0, 32);
        this.secondaryChecksum = this.bits.getUInt(this.offsets.BackupSaveStart, 0, 32);

        // Detect EU
        const usChecksum = this.calculate32BitChecksum(this.bits, 4, 0x57D0);
        if (this.primaryChecksum === (usChecksum - 1) >>> 0) {
            // It's EU
            this.offsets = new RBEUOffsets();
        }

        let baseOffset = 0;
        if (!this.isPrimaryChecksumValid() && this.isSecondaryChecksumValid()) {
            baseOffset = this.offsets.BackupSaveStart;
        }

        this.loadGeneral(baseOffset);
        this.loadItems(baseOffset);
        this.loadStoredPokemon(baseOffset);
    }

    private loadGeneral(baseOffset: number): void {
        const nameBits = this.bits.getRange(baseOffset * 8 + this.offsets.TeamNameStart, this.offsets.TeamNameLength * 8);
        const nameBytes = nameBits.toByteArray();
        this.teamName = CharacterEncoding.decode(nameBytes);

        // Held money, stored money, points, and base type are global (ignored baseOffset in byte index sense, 
        // but offsets themselves are regional). 
        // Legacy: Bits.GetInt(0, Offsets.HeldMoneyOffset, ...)
        this.heldMoney = this.bits.getInt(0, this.offsets.HeldMoneyOffset, this.offsets.HeldMoneyLength);
        this.storedMoney = this.bits.getInt(0, this.offsets.StoredMoneyOffset, this.offsets.StoredMoneyLength);
        this.rescueTeamPoints = this.bits.getInt(0, this.offsets.RescuePointsOffset, this.offsets.RescuePointsLength);
        this.baseType = this.bits.getInt(0, this.offsets.BaseTypeOffset, 8);
    }

    private loadItems(baseOffset: number): void {
        // Stored items are global
        this.storedItems = [];
        const block = this.bits.getRange(this.offsets.StoredItemOffset, this.offsets.StoredItemCount * 10);

        for (let i = 0; i < this.offsets.StoredItemCount; i++) {
            const quantity = block.getInt(0, i * 10, 10);
            if (quantity > 0) {
                this.storedItems.push(new RBStoredItem(i + 1, quantity));
            }
        }

        // Held Items use baseOffset
        this.heldItems = [];

        for (let i = 0; i < 20; i++) {
            const itemBits = this.bits.getRange(
                baseOffset * 8 + this.offsets.HeldItemOffset + (i * 33),
                33
            );
            const item = new RBHeldItem(itemBits);
            if (item.isValid) {
                this.heldItems.push(item);
            } else {
                break;
            }
        }
    }

    private loadStoredPokemon(baseOffset: number): void {
        this.storedPokemon = [];
        for (let i = 0; i < this.offsets.StoredPokemonCount; i++) {
            const pkmBits = this.bits.getRange(
                baseOffset * 8 + this.offsets.StoredPokemonOffset + i * this.offsets.StoredPokemonLength,
                this.offsets.StoredPokemonLength
            );
            // CONFLICT: StoredPokemonLength in Offsets is 323.
            // RBStoredPokemon class says 362.
            // If I read 323 bits, but class expects 362...
            // It will fail or readOutOfBounds if I passed a block of 323?
            // RBStoredPokemon `Initialize`:
            // ...
            // Name at 243, 10 chars -> 80 bits. 243+80 = 323.
            // So 323 IS CORRECT for Rescue Team (no Name at end in same way?).
            // RBStoredPokemon.cs: `Name = bits.GetStringPMD(0, 243, 10);` -> Ends at 323.
            // So `BitLength` 362 in `RBStoredPokemon.cs` is WRONG?
            // Or maybe 362 is for something else?
            // Wait, 362 - 323 = 39.
            // Maybe extra padding?
            // But `GetRange` logic uses `StoredPokemonLength` from offsets (323).
            // So we pass 323 bits.
            // `RBStoredPokemon` reads up to 323.
            // So 323 is the correct length.

            const pkm = new RBStoredPokemon(pkmBits);
            if (pkm.id > 0) {
                this.storedPokemon.push(pkm);
            } else {
                break;
            }
        }
    }

    public toByteArray(): Uint8Array {
        this.saveGeneral(0);
        this.saveItems(0);
        this.saveStoredPokemon(0);

        // Copy backup
        const backupStartBit = this.offsets.BackupSaveStart * 8;
        const copyLength = backupStartBit - 32;
        const sourceData = this.bits.getRange(32, copyLength);
        this.bits.setRange(backupStartBit + 32, copyLength, sourceData);

        // Checksums
        this.primaryChecksum = this.calculatePrimaryChecksum();
        this.bits.setUInt(0, 0, 32, this.primaryChecksum);

        this.secondaryChecksum = this.calculateSecondaryChecksum();
        this.bits.setUInt(this.offsets.BackupSaveStart, 0, 32, this.secondaryChecksum);

        return this.bits.toByteArray();
    }

    private saveGeneral(baseOffset: number): void {
        const nameBytes = CharacterEncoding.encode(this.teamName, this.offsets.TeamNameLength);
        const nameBlock = new BitBlock(nameBytes);
        this.bits.setRange(baseOffset * 8 + this.offsets.TeamNameStart, this.offsets.TeamNameLength * 8, nameBlock);

        // Shared fields: write only to primary (0) offset.
        // Even if saving to backup, legacy logic doesn't use baseOffset for these.
        this.bits.setInt(0, this.offsets.HeldMoneyOffset, this.offsets.HeldMoneyLength, this.heldMoney);
        this.bits.setInt(0, this.offsets.StoredMoneyOffset, this.offsets.StoredMoneyLength, this.storedMoney);
        this.bits.setInt(0, this.offsets.RescuePointsOffset, this.offsets.RescuePointsLength, this.rescueTeamPoints);
        this.bits.setInt(0, this.offsets.BaseTypeOffset, 8, this.baseType);
    }

    private saveItems(baseOffset: number): void {
        const compiledItems: { [id: number]: number } = {};
        for (const item of this.storedItems) {
            if (!compiledItems[item.itemID]) compiledItems[item.itemID] = 0;
            compiledItems[item.itemID] = Math.min(item.quantity + compiledItems[item.itemID], 1024);
        }

        const block = new BitBlock(this.offsets.StoredItemCount * 10);
        for (let i = 0; i < this.offsets.StoredItemCount; i++) {
            const qty = compiledItems[i + 1] || 0;
            block.setInt(0, i * 10, 10, qty);
        }
        // Stored items are global
        this.bits.setRange(this.offsets.StoredItemOffset, this.offsets.StoredItemCount * 10, block);

        // Held items handle baseOffset
        for (let i = 0; i < 20; i++) {
            const itemOffset = baseOffset * 8 + this.offsets.HeldItemOffset + (i * 33);
            if (i < this.heldItems.length) {
                const itemBits = this.heldItems[i].toBitBlock();
                const bits33 = new BitBlock(33);
                for (let b = 0; b < 23; b++) bits33.setBit(b, itemBits.getBit(b));
                this.bits.setRange(itemOffset, 33, bits33);
            } else {
                this.bits.setRange(itemOffset, 33, new BitBlock(33));
            }
        }
    }

    private saveStoredPokemon(baseOffset: number): void {
        for (let i = 0; i < this.offsets.StoredPokemonCount; i++) {
            const pkmOffset = baseOffset * 8 + this.offsets.StoredPokemonOffset + i * this.offsets.StoredPokemonLength;
            if (i < this.storedPokemon.length) {
                // RBPokemon returns 362 bits?
                // Offsets.StoredPokemonLength is 323.
                // We MUST use 323.
                // `RBStoredPokemon.toBitBlock()` returns `bitLength` (362).
                // I need to only take the first 323 bits?
                // The Name ends at 323.
                // `Unk2` is 43 bits? 
                // Wait. 323 + ??? = 362. Difference 39.
                // RBStoredPokemon.ts: `Unk2` (43) + `Name` (80) + ...
                // `Name` starts at 243. 243+80 = 323.
                // End of struct is 323.
                // `RBStoredPokemon` logic in `Initialize`: `Unk2 = bits.GetRange(120, 43)`.
                // `Attack1` at 163.
                // 120 + 43 = 163. Correct.
                // `Name` ends at 323.
                // So where does 362 come from?
                // `RBStoredPokemon.cs` defines `BitLength = 362`.
                // But `Initialize` only reads up to 323.
                // So 362 is bogus/unused space or legacy garbage?
                // I will use 323 bits.

                const fullBits = this.storedPokemon[i].toBitBlock();
                const bits323 = new BitBlock(323);
                for (let b = 0; b < 323; b++) bits323.setBit(b, fullBits.getBit(b));
                this.bits.setRange(pkmOffset, 323, bits323);
            } else {
                this.bits.setRange(pkmOffset, 323, new BitBlock(323));
            }
        }
    }

    public calculatePrimaryChecksum(): number {
        const sum = this.calculate32BitChecksum(this.bits, 4, this.offsets.ChecksumEnd);
        return (this.offsets instanceof RBEUOffsets) ? (sum - 1) >>> 0 : sum;
    }

    public calculateSecondaryChecksum(): number {
        const sum = this.calculate32BitChecksum(this.bits, this.offsets.BackupSaveStart + 4, this.offsets.BackupSaveStart + this.offsets.ChecksumEnd);
        return (this.offsets instanceof RBEUOffsets) ? (sum - 1) >>> 0 : sum;
    }

    private calculate32BitChecksum(bits: BitBlock, startIndex: number, endIndex: number): number {
        let sum = 0;
        for (let i = startIndex; i <= endIndex; i += 4) {
            sum += bits.getUInt(0, i * 8, 32);
        }
        return sum >>> 0;
    }

    public isPrimaryChecksumValid(): boolean {
        return this.primaryChecksum === this.calculatePrimaryChecksum();
    }

    public isSecondaryChecksumValid(): boolean {
        return this.secondaryChecksum === this.calculateSecondaryChecksum();
    }
}
