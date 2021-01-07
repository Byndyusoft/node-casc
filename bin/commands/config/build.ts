import cli from "cli-ux";
import * as yaml from "js-yaml";

import {
  container,
  IConfigBuilder,
  IConfigBuilderToken,
  IContextBuilder,
  IContextBuilderToken,
  IValuesReader,
  IValuesReaderToken,
} from "../../../src";
import {BaseCommand, flags} from "../../cli";

export default class ConfigBuildCommand extends BaseCommand {
  public static description = "build config";

  public static flags = {
    ...BaseCommand.flags,
    env: flags.string({
      char: "e",
      description: "environment",
      required: true,
    }),
    override: flags.boolableString({
      char: "o",
      default: true,
      description: "override values",
    }),
    yaml: flags.boolableString({
      char: "y",
      default: false,
      description: "[default: false] YAML output instead JSON", // workaround https://github.com/oclif/oclif/issues/192
    }),
  };

  public async run(): Promise<void> {
    const {flags} = this.parse(ConfigBuildCommand);

    const configBuilder = container.resolve<IConfigBuilder>(
      IConfigBuilderToken,
    );
    const contextBuilder = container.resolve<IContextBuilder>(
      IContextBuilderToken,
    );
    const valuesReader = container.resolve<IValuesReader>(IValuesReaderToken);

    const config = await configBuilder.build(
      await contextBuilder.build(
        flags.env,
        await valuesReader.read(flags.override),
      ),
    );

    if (flags.yaml) {
      this.log(yaml.dump(config));
    } else {
      cli.styledJSON(config);
    }
  }
}
