import * as _ from "lodash";

import {singleton} from "../di";
import {IConfigBuilderHelper, IConfigBuilderHelperToken} from "../interfaces";

@singleton(IConfigBuilderHelperToken)
export class ConfigBuilderHelperExists implements IConfigBuilderHelper {
  public get name(): string {
    return "exists";
  }

  public processSync(...args: readonly unknown[]): boolean {
    return args.every((x) => !_.isNil(x));
  }
}
