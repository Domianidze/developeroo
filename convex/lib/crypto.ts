const ENCRYPTED_PREFIX = "enc:";
const LEGACY_ENCRYPTED_PREFIX = "enc:v1:";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKeyBase64() {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error("ENCRYPTION_KEY is not configured");
  }

  return key;
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);

  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function hexToBytes(hex: string) {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex payload");
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return bytes;
}

async function importAesKey() {
  const keyBytes = base64ToBytes(getEncryptionKeyBase64());

  if (keyBytes.length !== 32) {
    throw new Error("ENCRYPTION_KEY must decode to exactly 32 bytes (base64)");
  }

  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function importLegacyAesKey() {
  const raw = new TextEncoder().encode(getEncryptionKeyBase64());
  const digest = await crypto.subtle.digest("SHA-256", raw);

  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function decryptLegacy(payload: string) {
  const value = payload.slice(LEGACY_ENCRYPTED_PREFIX.length);
  const [ivHex, ciphertextHex] = value.split(":");

  if (!ivHex || !ciphertextHex) {
    throw new Error("Invalid encrypted payload");
  }

  const key = await importLegacyAesKey();
  const iv = hexToBytes(ivHex);
  const ciphertext = hexToBytes(ciphertextHex);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(plaintext);
}

export async function encrypt(value: string) {
  const key = await importAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const plaintext = new TextEncoder().encode(value);
  const encryptedWithTag = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext),
  );

  const tag = encryptedWithTag.slice(encryptedWithTag.length - TAG_LENGTH);
  const ciphertext = encryptedWithTag.slice(
    0,
    encryptedWithTag.length - TAG_LENGTH,
  );

  return `${ENCRYPTED_PREFIX}${bytesToBase64(iv)}:${bytesToBase64(tag)}:${bytesToBase64(ciphertext)}`;
}

export async function decrypt(payload: string) {
  if (payload.startsWith(LEGACY_ENCRYPTED_PREFIX)) {
    return await decryptLegacy(payload);
  }

  if (!payload.startsWith(ENCRYPTED_PREFIX)) {
    return payload;
  }

  const value = payload.slice(ENCRYPTED_PREFIX.length);

  const [ivText, tagText, encryptedText] = value.split(":");

  if (!ivText || !tagText || !encryptedText) {
    throw new Error("Invalid encrypted payload");
  }

  const key = await importAesKey();
  const iv = base64ToBytes(ivText);
  const tag = base64ToBytes(tagText);
  const ciphertext = base64ToBytes(encryptedText);
  const encryptedWithTag = new Uint8Array(ciphertext.length + tag.length);

  encryptedWithTag.set(ciphertext, 0);
  encryptedWithTag.set(tag, ciphertext.length);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedWithTag,
  );

  return new TextDecoder().decode(plaintext);
}
