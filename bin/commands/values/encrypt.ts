import cli from "cli-ux";
import * as yaml from "js-yaml";

import {
  container,
  IValuesEncryptor,
  IValuesEncryptorToken,
  IValuesReader,
  IValuesReaderToken,
} from "../../../src";
import {BaseCommand, flags} from "../../cli";

export default class ValuesEncryptCommand extends BaseCommand {
  public static description = "encrypt values";

  public static flags = {
    ...BaseCommand.flags,
    yaml: flags.boolableString({
      char: "y",
      default: true,
      description: "YAML output instead JSON",
    }),
  };

  public async run(): Promise<void> {
    const {flags} = this.parse(ValuesEncryptCommand);

    const valuesEncryptor = container.resolve<IValuesEncryptor>(
      IValuesEncryptorToken,
    );
    const valuesReader = container.resolve<IValuesReader>(IValuesReaderToken);

    const values = await valuesEncryptor.encrypt(
      await valuesReader.read(false),
    );

    if (flags.yaml) {
      this.log(yaml.dump(values));
    } else {
      cli.styledJSON(values);
    }
  }
}
