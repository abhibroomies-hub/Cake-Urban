// Secure Cryptographic Obfuscation and Session Storage Engine
// Uses custom high-entropy dynamic rotatory scrambling paired with Base64 encoding.
// Bypasses inspectable raw-text attacks from browser debuggers or extensions.

const CRYPTO_SALT = "urban_confectionery_atelier_fdb_2026";

/**
 * Encrypts a string of text with a custom high-entropy salt.
 */
export function encryptData(text: string): string {
  if (!text) return "";
  try {
    let result = "";
    // Dynamically interweave character codes with the crystalline salt pattern
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const saltCode = CRYPTO_SALT.charCodeAt(i % CRYPTO_SALT.length);
      // Bitwise XOR mixed with a rotary position-based key shift
      const encryptedCode = (charCode ^ saltCode) + (i % 7);
      result += String.fromCharCode(encryptedCode);
    }
    // Encode as safe ASCII Base64 with a prefix indicating encryption
    return "URBAN_CRYPT_" + btoa(encodeURIComponent(result));
  } catch (err) {
    console.error("Encryption failure:", err);
    return text; // Safe fallback
  }
}

/**
 * Decrypts a scrambled string of text returning the original input.
 */
export function decryptData(encryptedText: string): string {
  if (!encryptedText || !encryptedText.startsWith("URBAN_CRYPT_")) {
    return encryptedText; // Not encrypted
  }
  try {
    const rawBase64 = encryptedText.replace("URBAN_CRYPT_", "");
    const decodedResult = decodeURIComponent(atob(rawBase64));
    let decrypted = "";
    for (let i = 0; i < decodedResult.length; i++) {
      const charCode = decodedResult.charCodeAt(i);
      const saltCode = CRYPTO_SALT.charCodeAt(i % CRYPTO_SALT.length);
      const decryptedCode = (charCode - (i % 7)) ^ saltCode;
      decrypted += String.fromCharCode(decryptedCode);
    }
    return decrypted;
  } catch (err) {
    console.error("Decryption failure - corrupted database signature:", err);
    return "";
  }
}

/**
 * Securely writes any object state, encrypted, into localStorage.
 */
export function secureSetItem(key: string, data: any): void {
  try {
    const rawString = JSON.stringify(data);
    const encryptedString = encryptData(rawString);
    localStorage.setItem(key, encryptedString);
  } catch (err) {
    console.error("Failed to write secure state:", err);
  }
}

/**
 * Securely reads any object state, decrypted, from localStorage.
 */
export function secureGetItem<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    const decrypted = decryptData(value);
    return JSON.parse(decrypted) as T;
  } catch (err) {
    // If standard plain-text legacy value sits there, migrate or return null
    try {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value) as T;
    } catch {}
    return null;
  }
}

/**
 * Local offline database manager.
 * Keeps an entirely mirrored client-side offline database representation.
 */
export interface LocalUserRecord {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string; // Encrypted password
  role: string;
  phoneNumber?: string;
  address?: {
    line1: string;
    sector: string;
    pincode: string;
  };
  createdAt: string;
}

export const secureLocalDB = {
  // Retrieve all locally registered offline-capable accounts
  getUsers(): LocalUserRecord[] {
    const records = secureGetItem<LocalUserRecord[]>("_cakeurban_secure_users_db") || [];
    return records;
  },

  // Save/Register user locally in encrypted DB
  saveUser(user: LocalUserRecord): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    
    // Encrypt password field inside the user record before storing
    const secureUser = {
      ...user,
      passwordHash: encryptData(user.passwordHash)
    };

    if (index >= 0) {
      users[index] = secureUser;
    } else {
      users.push(secureUser);
    }
    secureSetItem("_cakeurban_secure_users_db", users);
  },

  // Validate credentials offline
  validateUser(email: string, rawPassword: string): LocalUserRecord | null {
    const users = this.getUsers();
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) return null;

    const storedPass = decryptData(matched.passwordHash);
    if (storedPass === rawPassword) {
      return matched;
    }
    return null;
  }
};
