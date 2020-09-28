#!/usr/bin/env node

import "reflect-metadata";

import * as path from "path";

import {run} from "@oclif/command";
import * as flush from "@oclif/command/flush";
import {handle as errorsHandler} from "@oclif/errors";

(async () => {
  if (path.extname(__filename) === ".ts") {
    await import("./cli/pjsonProxy"); // workaround https://github.com/oclif/oclif/issues/294
  }

  process.env.OCLIF_TS_NODE = "0"; // workaround https://github.com/oclif/oclif/issues/333
  await run();
  await flush();
})().catch(errorsHandler);
