import * as _ from "lodash";
import * as Rsa from "node-rsa";

import {inject, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IDecryptionStrategy,
  IDecryptionStrategyToken,
  IPrivateKeyReader,
  IPrivateKeyReaderToken,
} from "../interfaces";

@singleton(IDecryptionStrategyToken)
export class RsaDecryptionStrategy implements IDecryptionStrategy {
  private __privateKey?: Rsa;

  public constructor(
    @inject(ICascSettingsToken)
    private readonly __cascSettings: ICascSettings,
    @inject(IPrivateKeyReaderToken)
    private readonly __privateKeyReader: IPrivateKeyReader,
  ) {}

  public get name(): string {
    return "rsa";
  }

  public async decrypt(encryptedValue: string): Promise<string> {
    if (_.isNil(this.__privateKey)) {
      if (this.__cascSettings.privateKeyFormat !== "pkcs8-private-pem") {
        throw new Error("unsupported private key format");
      }

      this.__privateKey = new Rsa(
        await this.__privateKeyReader.read(),
        this.__cascSettings.privateKeyFormat,
      );
    }

    return this.__privateKey.decrypt(encryptedValue, "utf8");
  }
}
