import { Injectable } from '@angular/core';
import { PersistenEngine } from '../../engine/types';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor() { }

  public async exportEngine(engine: PersistenEngine): Promise<string> {
    const json = JSON.stringify(engine);
    const blob = new Blob([json], { type: 'application/json' });
    let cs = new CompressionStream('gzip');
    const compressedResponse = await new Response(blob.stream().pipeThrough(cs));
    const responseBlob = await compressedResponse.blob();

    const buffer = await responseBlob.arrayBuffer();
        
        const compressedBase64 = btoa(
          String.fromCharCode(
            ...new Uint8Array(buffer)
          )
        );        

        return compressedBase64;
  }

  public async importEngine(file: File): Promise<PersistenEngine> {
    const arrayBuffer = await file.arrayBuffer();
    const compressedData = new Uint8Array(arrayBuffer);
    
    // Decompress the gzipped data
    const ds = new DecompressionStream('gzip');
    const decompressedStream = new Response(
      new Blob([compressedData]).stream().pipeThrough(ds)
    ).body;
    
    if (!decompressedStream) {
      throw new Error('Failed to decompress data');
    }
    
    const decompressedResponse = await new Response(decompressedStream).blob();
    const jsonText = await decompressedResponse.text();
    
    try {
      // Parse the JSON into a PersistentEngine object
      const engineData = JSON.parse(jsonText);
      const engine = new PersistenEngine();
      
      // Copy properties from imported data to the new engine
      Object.assign(engine, engineData);
      
      // Ensure the engine has a new ID to avoid conflicts
      engine.id = crypto.randomUUID();
      engine.created = new Date();
      engine.lastModified = new Date();
      engine.lastUsed = new Date();
      
      return engine;
    } catch (error) {
      console.error('Error parsing imported engine:', error);
      throw new Error('Invalid engine file format');
    }
  }
}
