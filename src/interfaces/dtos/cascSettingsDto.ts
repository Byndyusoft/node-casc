export interface CascSettingsDto {
  readonly crypto: {
    readonly strategy: string;
  };

  readonly privateKey: {
    readonly format: string;
    readonly strategies: {
      readonly [strategyName: string]: unknown;
    };
  };

  readonly publicKey: {
    readonly format: string;
    readonly strategies: {
      readonly [strategyName: string]: unknown;
    };
  };
}
