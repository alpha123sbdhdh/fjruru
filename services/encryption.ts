// services/encryption.ts

// We use a deterministic key derivation for simplicity in this demo,
// based on the channel ID. In a real app, this would be a shared key
// exchanged securely via public/private key pairs.

const getChannelKey = async (channelId: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(channelId + "-secret-salt-123"), // Salted channel ID
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("arena-salt"),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptMessage = async (channelId: string, text: string): Promise<string> => {
  try {
    const key = await getChannelKey(channelId);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(text)
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (e) {
    console.error("Encryption failed", e);
    return text; // fallback or throw
  }
};

export const decryptMessage = async (channelId: string, encryptedBase64: string): Promise<string> => {
  try {
    // Check if it's actually base64 and looks like our encrypted format
    if (!encryptedBase64 || !encryptedBase64.match(/^[A-Za-z0-9+/=]+$/)) {
      return encryptedBase64; // Not encrypted or legacy plain text
    }

    const key = await getChannelKey(channelId);
    const combined = new Uint8Array(
      atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
    );
    
    if (combined.length < 12) return encryptedBase64;

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    // If decryption fails, it might be plain text
    return encryptedBase64;
  }
};
