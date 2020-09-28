import * as Config from "@oclif/config";
import {ExitError} from "@oclif/errors";
import * as _ from "lodash";
import {stderr as stderrMock, stdout as stdoutMock} from "stdout-stderr";

import {container, ICascDirProvider, ICascDirProviderToken} from "../../src";

export class CommandHelper {
  public static cleanupHelpSync(stdout: string): string {
    const cascDirProvider = container.resolve<ICascDirProvider>(
      ICascDirProviderToken,
    );

    return stdout
      .replace(
        new RegExp(_.escapeRegExp(cascDirProvider.cascDir), "g"),
        "/app/.casc",
      )
      .replace(/\\/g, "/");
  }

  public static async run(
    command: string,
    ...argv: readonly string[]
  ): Promise<{exitCode: number; stderr: string; stdout: string}> {
    container.clearInstances();

    const config: Config.IConfig = await Config.load();
    await config.runHook("init", {id: command, argv: argv as string[]});

    let exitCode = 0;
    stderrMock.start();
    stdoutMock.start();

    try {
      await config.runCommand(command, argv as string[]);
    } catch (error: unknown) {
      if (error instanceof ExitError) {
        exitCode = error.oclif.exit;
      } else {
        throw error;
      }
    } finally {
      stderrMock.stop();
      stdoutMock.stop();
    }

    return {
      exitCode,
      stderr: stderrMock.output,
      stdout: stdoutMock.output,
    };
  }
}
