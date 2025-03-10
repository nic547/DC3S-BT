import { flush } from "@angular/core/testing";

export abstract class Engine {
    address: number = 3;
    functions: DccFunction[] = [];
}

export class SimpleEngine extends Engine {
    
}

export class PersistenEngine extends Engine {
    id: string = crypto.randomUUID();
    public name: string = '';

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