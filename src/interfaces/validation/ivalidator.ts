export interface IValidator<T> {
  readonly validateSync: (data: T) => void;
}
