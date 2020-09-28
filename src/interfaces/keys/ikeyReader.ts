export interface IKeyReader {
  readonly read: () => Promise<string>;
}
