import * as _ from "lodash";
import * as manipula from "manipula";

import {IKeyReader, IKeyReadingStrategy, TKeyType} from "../interfaces";

export abstract class KeyReader implements IKeyReader {
  private readonly __keyReadingStrategiesMap: manipula.Collections.IMap<
    string,
    IKeyReadingStrategy
  >;

  protected constructor(
    private readonly __keyType: TKeyType,
    private readonly __keyReadingStrategiesOrder: readonly string[],
    keyReadingStrategies: readonly IKeyReadingStrategy[],
  ) {
    this.__keyReadingStrategiesMap = manipula
      .from(keyReadingStrategies)
      .toMap((k) => k.name);
  }

  public async read(): Promise<string> {
    for (const keyReadingStrategyName of this.__keyReadingStrategiesOrder) {
      const keyReadingStrategy = this.__keyReadingStrategiesMap.get(
        keyReadingStrategyName,
      );
      if (_.isNil(keyReadingStrategy)) {
        throw new Error(
          `${this.__keyType} key reading strategy "${keyReadingStrategyName}" doesn't exists`,
        );
      }

      const privateKey = await keyReadingStrategy.tryRead();
      if (!_.isNil(privateKey)) {
        return privateKey;
      }
    }

    throw new Error(`${this.__keyType} key reader can't find key`);
  }
}
