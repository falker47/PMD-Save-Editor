export class BitBlock {
    public bits: boolean[];
    public position: number;

    constructor(source?: number | boolean[] | Uint8Array | BitBlock) {
        this.position = 0;
        if (typeof source === 'number') {
            this.bits = new Array(source).fill(false);
        } else if (source instanceof BitBlock) {
            this.bits = [...source.bits];
        } else if (source instanceof Uint8Array) {
            this.bits = [];
            for (let i = 0; i < source.length; i++) {
                const byte = source[i];
                for (let b = 0; b < 8; b++) {
                    this.bits.push(((byte >> b) & 1) === 1);
                }
            }
        } else if (Array.isArray(source)) {
            this.bits = [...source];
        } else {
            this.bits = [];
        }
    }

    get count(): number {
        return this.bits.length;
    }

    getBit(index: number): boolean {
        if (index < 0 || index >= this.bits.length) return false;
        return this.bits[index];
    }

    setBit(index: number, value: boolean): void {
        if (index < 0 || index >= this.bits.length) return;
        this.bits[index] = value;
    }

    getInt(byteIndex: number, bitIndex: number, bitLength: number): number {
        let output = 0;
        for (let b = 0; b < bitLength; b++) {
            const idx = byteIndex * 8 + bitIndex + b;
            if (idx >= 0 && idx < this.bits.length) {
                if (this.bits[idx]) {
                    output |= (1 << b);
                }
            }
        }
        return output;
    }

    setInt(byteIndex: number, bitIndex: number, bitLength: number, value: number): void {
        let bitsWritten = 0;
        // JS numbers are 32-bit integers for bitwise ops usually, need to handle carefully
        // But for < 32 bits this is fine.
        // We write bit by bit from the value.
        for (let j = 0; j < bitLength; j++) {
            const idx = byteIndex * 8 + bitIndex + j;
            if (idx >= 0 && idx < this.bits.length) {
                this.bits[idx] = ((value >> j) & 1) === 1;
            }
            bitsWritten++;
            if (bitsWritten >= bitLength) return;
        }
    }

    getNextInt(bitLength: number): number {
        const output = this.getInt(0, this.position, bitLength);
        this.position += bitLength;
        return output;
    }

    setNextInt(bitLength: number, value: number): void {
        this.setInt(0, this.position, bitLength, value);
        this.position += bitLength;
    }

    // JS doesn't have uint vs int distinction easily without DataView, but standard bitwise ops are signed 32-bit.
    // We can use unsigned right shift >>> 0 to enforce unsigned interpretation if needed.

    getUInt(byteIndex: number, bitIndex: number, bitLength: number): number {
        let output = 0;
        for (let b = 0; b < bitLength; b++) {
            const idx = byteIndex * 8 + bitIndex + b;
            if (idx >= 0 && idx < this.bits.length) {
                if (this.bits[idx]) {
                    // Use Math.pow for positions > 30 to avoid sign flipping issues with << 31
                    output += Math.pow(2, b);
                }
            }
        }
        return output;
    }

    setUInt(byteIndex: number, bitIndex: number, bitLength: number, value: number): void {
        // basic handling same as Int for writing logic
        for (let j = 0; j < bitLength; j++) {
            const idx = byteIndex * 8 + bitIndex + j;
            if (idx >= 0 && idx < this.bits.length) {
                // Check bit using division for large numbers or standard shift for small
                // Safe generic way:
                this.bits[idx] = (Math.floor(value / Math.pow(2, j)) % 2) === 1;
            }
        }
    }

    getRange(bitIndex: number, bitLength: number): BitBlock {
        const buffer: boolean[] = new Array(bitLength).fill(false);
        for (let i = 0; i < bitLength; i++) {
            if (bitIndex + i < this.bits.length) {
                buffer[i] = this.bits[bitIndex + i];
            }
        }
        return new BitBlock(buffer);
    }

    setRange(bitIndex: number, bitLength: number, value: BitBlock): void {
        for (let i = 0; i < bitLength; i++) {
            const idx = bitIndex + i;
            if (idx >= 0 && idx < this.bits.length && i < value.count) {
                this.bits[idx] = value.getBit(i);
            }
        }
    }

    toByteArray(): Uint8Array {
        const byteCount = Math.ceil(this.bits.length / 8);
        const bytes = new Uint8Array(byteCount);
        for (let i = 0; i < this.bits.length; i += 8) {
            let val = 0;
            for (let b = 0; b < 8; b++) {
                if (i + b < this.bits.length && this.bits[i + b]) {
                    val |= (1 << b);
                }
            }
            bytes[i / 8] = val;
        }
        return bytes;
    }
}
