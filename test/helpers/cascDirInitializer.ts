import * as fs from "fs";
import * as path from "path";

import * as yaml from "js-yaml";
import * as _ from "lodash";

import {CascSettingsDto, ValuesDto} from "../../src";

import {FixtureLoader} from "./fixtureLoader";

export class CascDirInitializer {
  private readonly __tasks: Array<Promise<void>>;

  public constructor(private readonly __cascDir: string) {
    this.__tasks = [];
  }

  public async init(): Promise<void> {
    await Promise.all(this.__tasks);
  }

  public withConfig(config: Record<string, unknown>): CascDirInitializer {
    return this.__createFileSync(
      path.join(this.__cascDir, "config.yaml"),
      config,
    );
  }

  public withKey(
    keyName: string,
    fixtureName: "private.rsa.2048.pkcs8.pem" | "public.rsa.2048.pkcs8.pem",
  ): CascDirInitializer {
    return this.__createFileSync(
      path.join(this.__cascDir, "keys", keyName),
      FixtureLoader.loadKey(fixtureName),
    );
  }

  public withSettings(settings?: CascSettingsDto): CascDirInitializer {
    if (_.isNil(settings)) {
      settings = {
        crypto: {
          strategy: "rsa",
        },
        privateKey: {
          format: "pkcs8-private-pem",
          strategies: {
            file: "private.pem",
          },
        },
        publicKey: {
          format: "pkcs8-public-pem",
          strategies: {
            file: "public.pem",
          },
        },
      };
    }

    return this.__createFileSync(
      path.join(this.__cascDir, "settings.yaml"),
      settings,
    );
  }

  public withValues(values: ValuesDto): CascDirInitializer {
    return this.__createFileSync(
      path.join(this.__cascDir, "values.yaml"),
      values,
    );
  }

  public withValuesOverride(valuesOverride: ValuesDto): CascDirInitializer {
    return this.__createFileSync(
      path.join(this.__cascDir, "values.override.yaml"),
      valuesOverride,
    );
  }

  private __createFileSync<T>(
    fileName: string,
    content: T | Promise<T>,
  ): CascDirInitializer {
    this.__tasks.push(
      (async () => {
        content = await content;

        await fs.promises.mkdir(path.dirname(fileName), {recursive: true});
        await fs.promises.writeFile(
          fileName,
          _.isString(content) ? content : yaml.dump(content),
        );
      })(),
    );

    return this;
  }
}
