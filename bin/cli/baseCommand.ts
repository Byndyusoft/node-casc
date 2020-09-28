import {Command, flags} from "@oclif/command";
import {CLIError} from "@oclif/errors";
import prettyPrint from "@oclif/errors/lib/errors/pretty-print";

import {container, ICascDirProvider, ICascDirProviderToken} from "../../src";

export abstract class BaseCommand extends Command {
  public static flags = {
    cascDir: flags.string({
      char: "c",
      default() {
        const cascDirProvider = container.resolve<ICascDirProvider>(
          ICascDirProviderToken,
        );

        return cascDirProvider.cascDir;
      },
      description: "CASC directory",
    }),
  };

  protected get _cascDir(): string {
    return this.__cascDirProvider.cascDir;
  }

  private __cascDirProvider!: ICascDirProvider;

  public init(): Promise<void> {
    const {flags} = this.parse(this.constructor as typeof BaseCommand);

    this.__cascDirProvider = container.resolve(ICascDirProviderToken);
    this.__cascDirProvider.cascDir = flags.cascDir;

    return Promise.resolve();
  }

  public logWarn(message: string): void {
    this.log(prettyPrint(new CLIError.Warn(message)));
  }
}
