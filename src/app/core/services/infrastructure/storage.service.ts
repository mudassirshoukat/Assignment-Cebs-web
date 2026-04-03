import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly prefix = "worklytics_";
  private readonly encrypt = true;
  private readonly encryptionKey ="5d9e5b2a0c7e4f1a3b5c7d9e1f0a4b6c8e2d4f6a8b0c2e4f6a8b0c2e4f6a8b0c";

 
  // Define ALL storage keys here in one place
  public readonly KEYS = {
    // Authentication
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    PERMISSIONS: 'permissions',
    
    // App Settings
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_STATE: 'sidebar_state',
    
    // Form Data
    FORM_DRAFT: 'form_draft',
    
    // Cache
    API_CACHE: (endpoint: string) => `cache_${endpoint}`
  } as const;

  setItem<T>(key: string, value: T): boolean {
    try {
      const storageKey = this.getStorageKey(key);
      const stringValue = this.prepareValueForStorage(value);
      
      localStorage.setItem(storageKey, stringValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }

  /**
   * Get an item from localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const storageKey = this.getStorageKey(key);
      const item = localStorage.getItem(storageKey);
      
      if (!item) return null;
      
      return this.parseStoredValue<T>(item);
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }


  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): boolean {
    try {
      const storageKey = this.getStorageKey(key);
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  /**
   * Clear all items with app prefix (or all if no prefix)
   */
  clear(): void {
    try {
      if (this.prefix) {
        // Only remove items with our prefix
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else {
        // Clear everything
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if key exists
   */
  hasItem(key: string): boolean {
    const storageKey = this.getStorageKey(key);
    return localStorage.getItem(storageKey) !== null;
  }

 
  // ==================== Private Helper Methods ====================

  private getStorageKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private prepareValueForStorage(value: any): string {
    let stringValue = JSON.stringify(value);
    
    if (this.encrypt) {
      stringValue = this.encryptData(stringValue);
    }
    
    return stringValue;
  }

  private parseStoredValue<T>(storedValue: string): T {
    let parsedValue = storedValue;
    
    if (this.encrypt) {
      parsedValue = this.decryptData(storedValue);
    }
    
    try {
      return JSON.parse(parsedValue);
    } catch {
      // If it's not JSON, return as is
      return parsedValue as any;
    }
  }

  // ==================== Encryption Methods (Simple Implementation) ====================

  private encryptData(text: string): string {
    // In production, use a proper encryption library like crypto-js
    // This is a simple XOR encryption for demonstration
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      );
    }
    return btoa(result); // Base64 encode
  }

  private decryptData(text: string): string {
    // Simple XOR decryption
    const decoded = atob(text);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      );
    }
    return result;
  }

 
}