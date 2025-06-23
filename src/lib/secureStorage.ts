/**
 * Secure storage utility for encrypting sensitive data
 * Uses AES encryption for localStorage data
 */

class SecureStorage {
  private readonly storageKey = 'payment-app-key';
  private key: CryptoKey | null = null;

  /**
   * Initialize or retrieve encryption key
   */
  private async getKey(): Promise<CryptoKey> {
    if (this.key) return this.key;

    // Try to get existing key from sessionStorage
    const existingKey = sessionStorage.getItem(this.storageKey);
    if (existingKey) {
      const keyData = JSON.parse(existingKey);
      this.key = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(keyData),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
      return this.key;
    }

    // Generate new key
    this.key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Store key in sessionStorage (cleared on tab close)
    const keyData = await crypto.subtle.exportKey('raw', this.key);
    sessionStorage.setItem(this.storageKey, JSON.stringify(Array.from(new Uint8Array(keyData))));
    
    return this.key;
  }

  /**
   * Encrypt and store data
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      const cryptoKey = await this.getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedValue = new TextEncoder().encode(value);
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encodedValue
      );

      const encryptedObject = {
        data: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
        timestamp: Date.now()
      };

      localStorage.setItem(`secure_${key}`, JSON.stringify(encryptedObject));
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Retrieve and decrypt data
   */
  async getItem(key: string): Promise<string | null> {
    try {
      const storedData = localStorage.getItem(`secure_${key}`);
      if (!storedData) return null;

      const encryptedObject = JSON.parse(storedData);
      
      // Check if data is too old (expire after 24 hours)
      if (Date.now() - encryptedObject.timestamp > 24 * 60 * 60 * 1000) {
        this.removeItem(key);
        return null;
      }

      const cryptoKey = await this.getKey();
      const iv = new Uint8Array(encryptedObject.iv);
      const encryptedData = new Uint8Array(encryptedObject.data);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedData
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      // Remove corrupted data
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove encrypted data
   */
  removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }

  /**
   * Clear all encrypted data
   */
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
    keys.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem(this.storageKey);
    this.key = null;
  }
}

export const secureStorage = new SecureStorage();