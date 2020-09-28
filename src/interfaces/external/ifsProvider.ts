export interface IFsProvider {
  readonly hasReadAccess: (fileName: string) => Promise<boolean>;
  readonly readText: (fileName: string) => Promise<string>;
  readonly readTextSync: (fileName: string) => string;
  readonly readYaml: <T>(fileName: string) => Promise<T>;
  readonly readYamlSync: <T>(fileName: string) => T;
}

export const IFsProviderToken = Symbol();
