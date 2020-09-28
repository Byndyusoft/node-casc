export interface IConfigBuilderHelper {
  readonly name: string;

  readonly processSync: (...args: readonly unknown[]) => unknown;
}

export const IConfigBuilderHelperToken = Symbol();
