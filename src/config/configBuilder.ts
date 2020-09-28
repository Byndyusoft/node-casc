import * as handlebars from "handlebars";
import * as yaml from "js-yaml";
import * as _ from "lodash";
import * as manipula from "manipula";

import {inject, injectAll, singleton} from "../di";
import {
  ContextDto,
  IConfigBuilder,
  IConfigBuilderHelper,
  IConfigBuilderHelperToken,
  IConfigBuilderToken,
  IConfigTemplateReader,
  IConfigTemplateReaderToken,
} from "../interfaces";

@singleton(IConfigBuilderToken)
export class ConfigBuilder implements IConfigBuilder {
  private __configTemplate?: handlebars.TemplateDelegate;

  private readonly __helpers: Readonly<
    Record<string, (...args: readonly unknown[]) => unknown>
  >;

  public constructor(
    @injectAll(IConfigBuilderHelperToken)
    configBuilderHelpers: readonly IConfigBuilderHelper[],
    @inject(IConfigTemplateReaderToken)
    private readonly __configTemplateReader: IConfigTemplateReader,
  ) {
    this.__helpers = Object.fromEntries(
      manipula.from(configBuilderHelpers).toMap(
        (k) => k.name,
        (v) => (...args: readonly unknown[]) =>
          v.processSync(...args.slice(0, -1)),
      ),
    );
  }

  public async build<TConfig = unknown>(context: ContextDto): Promise<TConfig> {
    if (_.isNil(this.__configTemplate)) {
      this.__configTemplate = handlebars.compile(
        await this.__configTemplateReader.read(),
      );
    }

    const configString = this.__configTemplate(context, {
      helpers: this.__helpers,
    });

    return (yaml.safeLoad(configString) as unknown) as TConfig;
  }
}
