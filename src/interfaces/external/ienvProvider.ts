export interface IEnvProvider {
  readonly env: Readonly<NodeJS.ProcessEnv>;
}

export const IEnvProviderToken = Symbol();
