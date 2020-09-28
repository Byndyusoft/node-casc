import {TKeyType} from "../types";

export interface ICascSettings {
  readonly cryptoStrategy: string;
  readonly privateKeyFormat: string;
  readonly privateKeyReadingStrategies: readonly string[];
  readonly publicKeyFormat: string;
  readonly publicKeyReadingStrategies: readonly string[];

  readonly getKeyReadingStrategySettingsSync: <T>(
    keyType: TKeyType,
    strategyName: string,
  ) => T | null;
}

export const ICascSettingsToken = Symbol();
