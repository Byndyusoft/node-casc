export interface IDecryptor {
  readonly decrypt: (encryptedValue: string) => Promise<string>;
}

export const IDecryptorToken = Symbol();
