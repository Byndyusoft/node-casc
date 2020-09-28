export interface IConfigTemplateReader {
  readonly read: () => Promise<string>;
}

export const IConfigTemplateReaderToken = Symbol();
