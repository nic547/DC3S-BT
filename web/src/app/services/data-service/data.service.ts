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

  async getEngine(key: string): Promise<PersistenEngine|undefined> {
    return await this.db?.get('engines', key)
  }

  async addOrUpdateEngine(engine: PersistenEngine): Promise<void> {
    await this.db?.put('engines', engine, engine.id)
  }

  async getEngines(): Promise<PersistenEngine[]> {
    const engines = await this.db?.getAll('engines')
    return engines || []
  }
}

interface DC3SDB extends DBSchema {
   'engines': {
    key: string;
    value: PersistenEngine;
   }
}