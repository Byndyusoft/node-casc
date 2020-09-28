import cli from "cli-ux";
import * as yaml from "js-yaml";

import {
  container,
  IValuesDecryptor,
  IValuesDecryptorToken,
  IValuesReader,
  IValuesReaderToken,
} from "../../../src";
import {BaseCommand, flags} from "../../cli";

export default class ValuesDecryptCommand extends BaseCommand {
  public static description = "decrypt values";

  public static flags = {
    ...BaseCommand.flags,
    yaml: flags.boolableString({
      char: "y",
      default: true,
      description: "YAML output instead JSON",
    }),
  };

  public async run(): Promise<void> {
    const {flags} = this.parse(ValuesDecryptCommand);

    const valuesDecryptor = container.resolve<IValuesDecryptor>(
      IValuesDecryptorToken,
    );
    const valuesReader = container.resolve<IValuesReader>(IValuesReaderToken);

    const values = await valuesDecryptor.decrypt(
      await valuesReader.read(false),
    );

    if (flags.yaml) {
      this.log(yaml.safeDump(values));
    } else {
      cli.styledJSON(values);
    }
  }
}
