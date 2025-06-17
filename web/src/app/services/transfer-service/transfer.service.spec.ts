import { TestBed } from '@angular/core/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { PersistenEngine } from '../../engine/types';
import { TransferService as TransferSerive } from './transfer.service';

describe('TransferServiceService', () => {
    let service: TransferSerive;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideZonelessChangeDetection()],
        });
        service = TestBed.inject(TransferSerive);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('exporting should return a base64 string', async () => {
        const engine = new PersistenEngine();

        const result = await service.exportEngine(engine);
        expect(result).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });

    it('should be able to roundtrip an engine', async () => {
        const engine = new PersistenEngine();
        engine.name = 'test';
        engine.id = '1234';
        engine.created = new Date();
        engine.lastModified = new Date();
        engine.lastUsed = new Date();

        const exported = await service.exportEngine(engine);

        // Correctly convert base64 to binary data for the Blob
        const binaryString = atob(exported);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: 'application/gzip' });
        const file = new File([blob], 'test.json.gz', { type: 'application/gzip' });
        const imported = await service.importEngine(file);

        expect(imported).toBeInstanceOf(Array);
        expect(imported.length).toBe(1);
        expect(imported[0].name).toEqual(engine.name);
        expect(imported[0].id).not.toEqual(engine.id);
    });
});
