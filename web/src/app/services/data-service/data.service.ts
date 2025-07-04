import { Injectable } from '@angular/core';
import { type DBSchema, type IDBPDatabase, openDB } from 'idb';
import { DccFunction, PersistenEngine } from '../../engine/types';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private db: IDBPDatabase<DC3SDB> | undefined;

    // Mostly for the tests - somehow doesn't work reliably when not an arrow function
    setup = async (dbName = 'dc3s-db'): Promise<void> => {
        this.db = await openDB<DC3SDB>(dbName, 1, {
            upgrade(db) {
                db?.createObjectStore('engines');
            },
        });
        console.log('Database upgrade complete');
    };

    async getEngine(key: string): Promise<PersistenEngine | null> {
        const engineObject = await this.db?.get('engines', key);
        return this.rehydrateEngine(engineObject);
    }

    async addOrUpdateEngine(engine: PersistenEngine): Promise<void> {
        engine.lastUsed = new Date();
        await this.db?.put('engines', engine, engine.id);
    }

    async updateLastUsed(engine: PersistenEngine): Promise<void> {
        await this.db?.put('engines', engine, engine.id);
    }

    async deleteEngine(engine: PersistenEngine): Promise<void> {
        await this.db?.delete('engines', engine.id);
    }

    async getEngines(
        searchTerm = '',
        sortKey: 'lastUsed' | 'name' | 'created' | 'address' = 'lastUsed',
        desc = true,
    ): Promise<PersistenEngine[]> {
        const engines = (await this.db?.getAll('engines'))
            ?.filter((engine) => engine.name.includes(searchTerm) || engine.tags.some((tag) => tag.includes(searchTerm)))
            ?.sort((a, b) => {
                if (a[sortKey] < b[sortKey]) return desc ? 1 : -1;
                if (a[sortKey] > b[sortKey]) return desc ? -1 : 1;
                return 0;
            });
        return engines?.map((engine) => this.rehydrateEngine(engine)) || [];
    }

    /** Tries to ensure that the stored data object gets turned into a "real" PersistentEngine with functions and up-to-date properties  */
    private rehydrateEngine(engine: PersistenEngine): PersistenEngine;
    private rehydrateEngine(engine: PersistenEngine | undefined | null): PersistenEngine | null;
    private rehydrateEngine(engine: PersistenEngine | undefined | null): PersistenEngine | null {
        if (!engine) return null;
        const instance = new PersistenEngine();

        // Only copy properties that exist in the class prototype
        const prototypeKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
        const propertyKeys = Object.getOwnPropertyNames(instance);

        // Combine both property and method names (excluding constructor)
        const validKeys = [...propertyKeys, ...prototypeKeys.filter((key) => key !== 'constructor')];

        // Copy only the valid properties
        for (const key of Object.keys(engine)) {
            if (validKeys.includes(key)) {
                // biome-ignore lint/suspicious/noExplicitAny: weird type stuff is done here
                (instance as any)[key] = (engine as any)[key];
            }
        }

        //Deal with functions
        // biome-ignore lint/suspicious/noExplicitAny: weird type stuff is done here
        instance.functions = engine.functions.map((f: any) => {
            return Object.assign(new DccFunction(), f);
        });

        return instance;
    }
}

interface DC3SDB extends DBSchema {
    engines: {
        key: string;
        value: PersistenEngine;
    };
}
