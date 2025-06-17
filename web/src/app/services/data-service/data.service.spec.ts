import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DccFunction, PersistenEngine } from '../../engine/types';
import { DataService } from './data.service';

describe('DataService', () => {
    let service: DataService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(DataService);

        const dbName = Math.random().toString(36);
        await service.setup(dbName);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save engines', async () => {
        const engine = new PersistenEngine();

        await service.addOrUpdateEngine(engine);

        const numberOfEngines = await service.getEngines();
        expect(numberOfEngines.length).toBe(1);
    });

    it('should return saved engines with the correct type', async () => {
        const engine = new PersistenEngine();
        await service.addOrUpdateEngine(engine);

        const engines = await service.getEngines();
        expect(engines[0]).toBeInstanceOf(PersistenEngine);
    });

    it('should delete engines when requested', async () => {
        const engine = new PersistenEngine();
        await service.addOrUpdateEngine(engine);
        let engines = await service.getEngines();
        expect(engines.length).toBe(1);

        await service.deleteEngine(engine);
        engines = await service.getEngines();
        expect(engines.length).toBe(0);
    });

    it('stored functions should have a display name', async () => {
        const engine = new PersistenEngine();
        engine.functions.push(DccFunction.create(0));
        await service.addOrUpdateEngine(engine);

        const engines = await service.getEngines();
        expect(engines[0].functions[0].displayName).toBe('F0');
    });

    it('invalid key should return null', async () => {
        const engine = new PersistenEngine();
        await service.addOrUpdateEngine(engine);

        const loadedEngine = await service.getEngine('1234567890');
        expect(loadedEngine).toBeNull();
    });

    it('getting an engine by its key should return the correct engine', async () => {
        const engine = new PersistenEngine();
        engine.name = 'Test Engine';
        await service.addOrUpdateEngine(engine);

        const loadedEngine = await service.getEngine(engine.id);
        expect(loadedEngine?.name).toBe('Test Engine');
    });

    it('default database name should be used if no name is provided', async () => {
        const service = new DataService();
        expect(service.setup).not.toThrow();
    });
});
