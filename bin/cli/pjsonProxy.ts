import * as fs from "fs";
import * as path from "path";

import * as _ from "lodash";

const pjsonFileName = path.join(__dirname, "..", "..", "package.json");

// @ts-expect-error: fs.readFile is not readonly property
fs.readFile = new Proxy(fs.readFile, {
  apply(target, thisArg, args) {
    if (
      Array.isArray(args) &&
      args[0] === pjsonFileName &&
      args[1] == "utf8" &&
      typeof args[2] === "function"
    ) {
      target.call(thisArg, pjsonFileName, (error, data) => {
        const callback = args[2] as (
          error: Error | null,
          data?: string,
        ) => void;

        if (!_.isNil(error)) {
          callback(error);
        } else {
          const pjson = JSON.parse(data.toString()) as {
            oclif: {commands: string};
          };
          pjson.oclif.commands = "./bin/commands";

          callback(error, JSON.stringify(pjson));
        }
      });
    } else {
      target.apply(thisArg, args);
    }
  },
});
