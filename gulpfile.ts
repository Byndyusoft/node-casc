// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./types/pkg.d.ts" />

import * as fs from "fs";
import * as path from "path";

import * as del from "del";
import * as gulp from "gulp";
import {exec} from "pkg";

export const standalone = gulp.series(
  async function clean(): Promise<void> {
    await del(path.join(__dirname, "standalone"));
  },
  async function pkg(): Promise<void> {
    const {name, version} = JSON.parse(
      await fs.promises.readFile(path.join(__dirname, "package.json"), "utf8"),
    ) as {name: string; version: string};
    const binaryName = name.split("/")[1];

    for (const platform of ["linux", "alpine", "win", "macos"]) {
      for (const arch of ["x64"]) {
        await exec([
          "--output",
          path.join(
            __dirname,
            "standalone",
            `${binaryName}-v${version}-${platform}-${arch}`,
          ),
          "--target",
          `node12.18.1-${platform}-${arch}`,
          "./package.json",
        ]);
      }
    }
  },
);
