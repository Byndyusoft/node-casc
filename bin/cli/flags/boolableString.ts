import {build, Definition} from "@oclif/parser/lib/flags";
import * as yn from "yn";

export const boolableString: Definition<boolean> = build<boolean>({
  parse(input) {
    return yn(input, {default: false});
  },
});
