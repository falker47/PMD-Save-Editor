export class CharacterEncoding {
    // 0x00 to 0xFF mapping based on the C# file
    private static eightBitCharacters: string[] = [
        "\0", "?", "?", "?", "?", "?", "?", "?", "?", "?", "\n", "?", "?", "\r", "?", "?", // 0x00-0x0F
        "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", "?", // 0x10-0x1F
        " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", // 0x20-0x2F
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", // 0x30-0x3F
        "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", // 0x40-0x4F
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", // 0x50-0x5F
        "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", // 0x60-0x6F
        "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "?", " ", // 0x70-0x7F
        "€", "?", "?", "?", "?", "⋯", "†", "?", "ˆ", "‰", "Š", "‹", "Œ", "ₑ", "Ž", "•", // 0x80-0x8F
        "•", "‘", "’", "“", "”", "•", "ᵉʳ", "ʳᵉ", "˜", "™", "š", "›", "œ", "•", "ž", "Ÿ", // 0x90-0x9F
        " ", "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "—", "®", "¯", // 0xA0-0xAF
        "°", "±", "²", "³", "´", "µ", "¶", "„", "‚", "¹", "⁰", "»", "←", "♂", "♀", "¿", // 0xB0-0xBF
        "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", // 0xC0-0xCF
        "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß", // 0xD0-0xDF
        "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", // 0xE0-0xEF
        "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"  // 0xF0-0xFF
    ];

    public static decode(bytes: Uint8Array): string {
        let result = "";
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            if (byte === 0 || byte === 0xFF) {
                // Rescue Team often uses 0xFF or 0x00 as terminator
                break;
            }

            // Handle escape sequences 0x81-0x87 except 0x85/0x86
            if ((byte >= 0x81 && byte <= 0x84) || byte === 0x87) {
                // It's a control code, usually followed by another byte
                if (i + 1 < bytes.length) {
                    const next = bytes[i + 1];
                    const hexCode = byte.toString(16).toUpperCase().padStart(2, '0') + next.toString(16).toUpperCase().padStart(2, '0');
                    result += `\\${hexCode}`;
                    i++;
                } else {
                    result += "?";
                }
            } else {
                result += this.eightBitCharacters[byte] || "?";
            }
        }
        return result;
    }

    public static encode(text: string, maxLengthBytes: number): Uint8Array {
        const buffer: number[] = [];

        for (let i = 0; i < text.length; i++) {
            if (buffer.length >= maxLengthBytes) break;

            const char = text[i];

            // Check for escape sequence starting with \
            if (char === '\\') {
                // Try to look ahead 4 chars for hex code
                const next4 = text.substring(i + 1, i + 5);
                if (next4.length === 4 && /^[0-9A-Fa-f]{4}$/.test(next4)) {
                    const val = parseInt(next4, 16);
                    buffer.push((val >> 8) & 0xFF);
                    buffer.push(val & 0xFF);
                    i += 4;
                    continue;
                }
                // Not a valid escape, treat as literal backslash (0x5C)
                buffer.push(0x5C);
                continue;
            }

            // Normal character mapping
            const index = this.eightBitCharacters.indexOf(char);
            if (index !== -1) {
                buffer.push(index);
            } else {
                buffer.push(0x3F); // '?'
            }
        }

        // Fill remainder with 0
        while (buffer.length < maxLengthBytes) {
            buffer.push(0);
        }

        return new Uint8Array(buffer);
    }
}
