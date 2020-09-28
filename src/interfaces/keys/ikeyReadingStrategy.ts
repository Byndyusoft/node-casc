export interface IKeyReadingStrategy {
  readonly name: string;

  readonly tryRead: () => Promise<string | null>;
}
