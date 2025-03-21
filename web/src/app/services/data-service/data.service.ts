import { Injectable } from '@angular/core';
import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Engine, PersistenEngine } from '../../engine/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private db: IDBPDatabase<DC3SDB> | undefined;

  constructor() {
  }

  async setup() {
    this.db = await openDB<DC3SDB>('dc3s-db', 1, {
      upgrade(db) {
        db.createObjectStore('engines')
      }
    })
  }

  async getEngine(key: string): Promise<PersistenEngine|null> {
    let engineObject = await this.db?.get('engines', key)
    return this.rehydrateEngine(engineObject);
  }

  async addOrUpdateEngine(engine: PersistenEngine): Promise<void> {
    engine.lastModified = new Date();
    await this.db?.put('engines', engine, engine.id)
  }

  async getEngines(): Promise<PersistenEngine[]> {
    const engines = await this.db?.getAll('engines')
    return engines?.map(engine => this.rehydrateEngine(engine)) || [];
  }

  /** Tries to ensure that the stored data object gets turned into a "real" PersistentEngine with functions and up-to-date properties  */
  private rehydrateEngine(engine: PersistenEngine): PersistenEngine
  private rehydrateEngine(engine: PersistenEngine | undefined | null): PersistenEngine | null;
  private rehydrateEngine(engine: PersistenEngine | undefined | null): PersistenEngine | null {
    if (!engine) return null;
    const instance = new PersistenEngine();
  
    // Only copy properties that exist in the class prototype
    const prototypeKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
    const propertyKeys = Object.getOwnPropertyNames(instance);
    
    // Combine both property and method names (excluding constructor)
    const validKeys = [...propertyKeys, ...prototypeKeys.filter(key => key !== 'constructor')];
    
    // Copy only the valid properties
    for (const key of Object.keys(engine)) {
      if (validKeys.includes(key)) {
        (instance as any)[key] = (engine as any)[key];
      }
    }
    
    return instance;
  }
}

interface DC3SDB extends DBSchema {
   'engines': {
    key: string;
    value: PersistenEngine;
   }
}