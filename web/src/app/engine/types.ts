export abstract class Engine {
    address = 3;
    functions: DccFunction[] = [];
    isForwards = true;
    speed = 0;
}

export class SimpleEngine extends Engine {}

export class PersistenEngine extends Engine {
    id: string = crypto.randomUUID();
    public name = '';
    public notes = '';
    public tags: string[] = [];
    public created: Date = new Date();
    public lastModified: Date = new Date();
    public lastUsed: Date = new Date();

    updateWith(updatedEngine: PersistenEngine) {
        this.name = updatedEngine.name;
        this.notes = updatedEngine.notes;
        this.tags = updatedEngine.tags;
        this.address = updatedEngine.address;
        this.functions = updatedEngine.functions.map((f) => {
            return Object.assign(new DccFunction(), f);
        }); // ensure functions are instances of DccFunction
    }
}

export class DccFunction {
    static create(number: number) {
        const f = new DccFunction();
        f.number = number;
        return f;
    }

    number = 0;
    description = '';
    duration = 0;
    isActive = false;

    get displayName() {
        return this.description ? `F${this.number} - ${this.description}` : `F${this.number}`;
    }
}
