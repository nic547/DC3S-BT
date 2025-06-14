export class Session {
    data: Uint32Array;

    static FromBuffer(buffer: ArrayBuffer): Session {
        const session = new Session();
        const view = new DataView(buffer);
        for (let i = 0; i < 4; i++) {
            session.data[i] = view.getUint32(i * 4, true);
        }
        return session;
    }

    constructor() {
        this.data = new Uint32Array(4);
        crypto.getRandomValues(this.data);

        // Set UUID v4 version and variant bits
        const bytes = new Uint8Array(this.data.buffer);
        // Set version (byte 6, high nibble to 0b0100)
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        // Set variant (byte 8, high 2 bits to 0b10)
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
    }

    toString(): string {
        const bytes = new Uint8Array(this.data.buffer);
        const hex = Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
    }
}
