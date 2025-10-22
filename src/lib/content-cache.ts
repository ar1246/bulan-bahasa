import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.dev-content-cache.json');

interface CacheData {
  [key: string]: any;
}

class DevelopmentCache {
  private cache: Map<string, any> = new Map();

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = fs.readFileSync(CACHE_FILE, 'utf-8');
        const parsed: CacheData = JSON.parse(data);
        this.cache = new Map(Object.entries(parsed));
        console.log('📦 Loaded development cache from file:', this.cache.size, 'items');
      }
    } catch (error) {
      console.log('📦 No existing cache file found, starting fresh');
    }
  }

  private saveToFile(): void {
    try {
      const data: CacheData = Object.fromEntries(this.cache);
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
      console.log('💾 Saved development cache to file:', this.cache.size, 'items');
    } catch (error) {
      console.error('❌ Failed to save cache to file:', error);
    }
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
    this.saveToFile();
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    if (result) {
      this.saveToFile();
    }
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.saveToFile();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  entries(): [string, any][] {
    return Array.from(this.cache.entries());
  }

  // For debugging
  debug(): void {
    console.log('🔍 DEBUG: Current cache state:');
    console.log('Cache keys:', this.keys());
    console.log('Cache size:', this.size());
    for (const [key, value] of this.cache.entries()) {
      const type = Array.isArray(value) ? `Array[${value.length}]` : typeof value;
      console.log(`Key: ${key}, Value type: ${type}`);
    }
  }
}

// Export singleton instance
export const devCache = new DevelopmentCache();