import * as _ from "lodash";

import {singleton} from "../di";
import {IConfigBuilderHelper, IConfigBuilderHelperToken} from "../interfaces";

@singleton(IConfigBuilderHelperToken)
export class ConfigBuilderHelperStr implements IConfigBuilderHelper {
  public get name(): string {
    return "str";
  }

  public processSync(...args: readonly unknown[]): string | null | undefined {
    if (args.length !== 1) {
      throw new Error(`one argument expected, ${args.length} received`);
    }

    if (_.isNil(args[0])) {
      return args[0];
    }

    return JSON.stringify(String(args[0]));
  }
}
