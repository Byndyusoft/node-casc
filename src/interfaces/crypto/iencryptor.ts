export interface IEncryptor {
  readonly encrypt: (value: string) => Promise<string>;
}

export const IEncryptorToken = Symbol();
