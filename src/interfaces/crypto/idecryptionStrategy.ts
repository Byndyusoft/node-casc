export interface IDecryptionStrategy {
  readonly name: string;

  readonly decrypt: (encryptedValue: string) => Promise<string>;
}

export const IDecryptionStrategyToken = Symbol();
