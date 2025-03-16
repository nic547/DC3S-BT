
export abstract class Engine {
    address: number = 3;
    functions: DccFunction[] = [];
    isForwards: boolean = true;
    speed: number = 0;

}

export class SimpleEngine extends Engine {
    
}

export class PersistenEngine extends Engine {
    id: string = crypto.randomUUID();
    public name: string = '';
    public notes: string = '';
    public tags: string[] = [];
    public created: Date = new Date();
    public lastModified: Date = new Date();
    public lastUsed: Date = new Date();

    updateWith(updatedEngine: PersistenEngine) {
        this.name = updatedEngine.name;
        this.notes = updatedEngine.notes;
        this.tags = updatedEngine.tags;
        this.address = updatedEngine.address;
        this.functions = updatedEngine.functions;
    }
}

export class DccFunction {
    
    static create(number: number) {
        let f = new DccFunction();
        f.number = number;
        return f;
    }

    number: number = 0;
    description: string = '';
    duration: number = -1;
    isActive: boolean = false;

    get displayName() {return this.description ? `F${this.number} - ${this.description}` : `F${this.number}`;}
}