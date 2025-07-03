import { KimuExtensionMeta } from './kimu-types';

const DB_NAME = 'kimu-db'; // Name of the IndexedDB database
const STORE_NAME = 'extensions'; // Name of the store (table) in the database

/**
 * The `KimuStore` class provides utility methods for managing extensions in IndexedDB.
 * It acts as a persistent storage layer for saving, retrieving, and managing extension metadata.
 * 
 * Key functionalities:
 * - Initializes IndexedDB and creates the store if it does not exist.
 * - Provides methods to check if the database is empty.
 * - Saves, retrieves, and removes extensions from the database.
 * - Clears all extensions from the database.
 */
export class KimuStore {
  private static _db: IDBDatabase;

  /**
   * Initializes IndexedDB and creates the store if it does not exist.
   * 
   * @returns A promise that resolves when the database is initialized.
   */
  static async init(): Promise<void> {
    // console.log('[KimuStore] IndexedDB initialize...');
    // Check if IndexedDB is already initialized
    if (this._db) {
      // console.log('[KimuStore] ✅ IndexedDB is already initialized');
      return;
    }
    // Initialize IndexedDB
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onerror = () => reject('❌ IndexedDB is not available');
      request.onsuccess = () => {
        this._db = request.result;
        resolve();
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'tag' });
        }
      };
    });
  }

  /**
   * Checks if the database is empty.
   * 
   * @returns A promise that resolves to `true` if the database is empty, otherwise `false`.
   */
  static async isEmpty(): Promise<boolean> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countRequest = store.count();
      countRequest.onsuccess = () => resolve(countRequest.result === 0);
      countRequest.onerror = () => reject(countRequest.error);
    });
  }

  /**
   * Retrieves all extensions saved in the database.
   * 
   * @returns A promise that resolves to an array of extension metadata.
   */
  static async list(): Promise<KimuExtensionMeta[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as KimuExtensionMeta[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieves a specific extension by its tag.
   * 
   * @param tag - The tag of the extension to retrieve.
   * @returns A promise that resolves to the extension metadata or `undefined` if not found.
   */
  static async get(tag: string): Promise<KimuExtensionMeta | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(tag);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Saves an extension to the database.
   * 
   * @param entry - The extension metadata to save.
   * @returns A promise that resolves when the extension is saved.
   */
  static async save(entry: KimuExtensionMeta): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Removes an extension from the database by its tag.
   * 
   * @param tag - The tag of the extension to remove.
   * @returns A promise that resolves when the extension is removed.
   */
  static async remove(tag: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(tag);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clears all extensions from the database.
   * 
   * @returns A promise that resolves when the database is cleared.
   */
  static async clear(): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

}
