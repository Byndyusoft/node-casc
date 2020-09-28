export interface IEncryptionStrategy {
  readonly name: string;

  readonly encrypt: (value: string) => Promise<string>;
}

export const IEncryptionStrategyToken = Symbol();
