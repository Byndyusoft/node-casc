import * as _ from "lodash";
import * as Rsa from "node-rsa";

import {inject, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IEncryptionStrategy,
  IEncryptionStrategyToken,
  IPublicKeyReader,
  IPublicKeyReaderToken,
} from "../interfaces";

@singleton(IEncryptionStrategyToken)
export class RsaEncryptionStrategy implements IEncryptionStrategy {
  private __publicKey?: Rsa;

  public constructor(
    @inject(ICascSettingsToken)
    private readonly __cascSettings: ICascSettings,
    @inject(IPublicKeyReaderToken)
    private readonly __publicKeyReader: IPublicKeyReader,
  ) {}

  public get name(): string {
    return "rsa";
  }

  public async encrypt(value: string): Promise<string> {
    if (_.isNil(this.__publicKey)) {
      if (this.__cascSettings.publicKeyFormat !== "pkcs8-public-pem") {
        throw new Error("unsupported public key format");
      }

      this.__publicKey = new Rsa(
        await this.__publicKeyReader.read(),
        this.__cascSettings.publicKeyFormat,
      );
    }

    return this.__publicKey.encrypt(value, "base64");
  }
}
