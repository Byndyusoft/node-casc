import * as path from "path";

import {It, Mock, Times} from "moq.ts";

import {
  ICascDirProvider,
  IEnvProvider,
  IFsProvider,
  IValuesDtoValidator,
  ValuesReader,
} from "../../../src";

describe("values/ValuesReader", () => {
  const cascDir = path.join("/", "app", ".casc");
  const valuesFileName = path.join(cascDir, "values.yaml");
  const valuesOverrideFileName = path.join(cascDir, "values.override.yaml");

  let cascDirProviderMock: Mock<ICascDirProvider>;
  let envProviderMock: Mock<IEnvProvider>;
  let fsProviderMock: Mock<IFsProvider>;
  let valuesDtoValidatorMock: Mock<IValuesDtoValidator>;

  function buildValuesReader(): ValuesReader {
    return new ValuesReader(
      cascDirProviderMock.object(),
      envProviderMock.object(),
      fsProviderMock.object(),
      valuesDtoValidatorMock.object(),
    );
  }

  beforeEach(() => {
    cascDirProviderMock = new Mock<ICascDirProvider>();
    envProviderMock = new Mock<IEnvProvider>();
    fsProviderMock = new Mock<IFsProvider>();
    valuesDtoValidatorMock = new Mock<IValuesDtoValidator>();

    cascDirProviderMock.setup((i) => i.cascDir).returns(cascDir);
    envProviderMock.setup((i) => i.env).returns({});
    valuesDtoValidatorMock.setup((i) => i.validateSync(It.IsAny())).returns();
  });

  describe("read values from file", () => {
    [true, false].forEach((override) =>
      describe(`${override ? "with" : "without"} override`, () => {
        beforeEach(() => {
          fsProviderMock
            .setup((i) => i.hasReadAccess(valuesOverrideFileName))
            .returns(Promise.resolve(false));
        });

        afterEach(() => {
          if (!override) {
            fsProviderMock.verify(
              (i) => i.hasReadAccess(valuesOverrideFileName),
              Times.Never(),
            );
            envProviderMock.verify((i) => i.env, Times.Never());
          }
        });

        it("must return empty values if file are empty", async () => {
          fsProviderMock
            .setup((i) => i.hasReadAccess(valuesFileName))
            .returns(Promise.resolve(true))
            .setup((i) => i.readYaml(valuesFileName))
            .returns(Promise.resolve(undefined));

          const valuesReader = buildValuesReader();

          expect(await valuesReader.read(override)).toStrictEqual({});
        });

        it("must return empty values if file doesn't exists", async () => {
          fsProviderMock
            .setup((i) => i.hasReadAccess(valuesFileName))
            .returns(Promise.resolve(false));

          const valuesReader = buildValuesReader();

          expect(await valuesReader.read(override)).toStrictEqual({});
        });

        it("must return values if file exists", async () => {
          const values = {key: {production: "value"}};

          fsProviderMock
            .setup((i) => i.hasReadAccess(valuesFileName))
            .returns(Promise.resolve(true))
            .setup((i) => i.readYaml(valuesFileName))
            .returns(Promise.resolve(values));

          const valuesReader = buildValuesReader();

          expect(await valuesReader.read(override)).toStrictEqual(values);
        });

        it("must throw error if values are invalid", async () => {
          const values = {"1key": {production: "value"}};

          fsProviderMock
            .setup((i) => i.hasReadAccess(valuesFileName))
            .returns(Promise.resolve(true))
            .setup((i) => i.readYaml(valuesFileName))
            .returns(Promise.resolve(values));
          valuesDtoValidatorMock
            .setup((i) => i.validateSync(values))
            .throws(new Error("invalid values"));

          const valuesReader = buildValuesReader();

          await expect(valuesReader.read(override)).rejects.toThrow(
            "invalid values",
          );
        });
      }),
    );
  });

  describe("read values from override file", () => {
    beforeEach(() => {
      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesFileName))
        .returns(Promise.resolve(false));
    });

    it("must return empty values if override file are empty", async () => {
      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(true))
        .setup((i) => i.readYaml(valuesOverrideFileName))
        .returns(Promise.resolve(undefined));

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({});
    });

    it("must return empty values if override file doesn't exists", async () => {
      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(false));

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({});
    });

    it("must return values if override file exists", async () => {
      const valuesOverride = {key: {production: "value"}};

      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(true))
        .setup((i) => i.readYaml(valuesOverrideFileName))
        .returns(Promise.resolve(valuesOverride));

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual(valuesOverride);
    });

    it("must throw error if override values are invalid", async () => {
      const valuesOverride = {"1key": {production: "value"}};

      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(true))
        .setup((i) => i.readYaml(valuesOverrideFileName))
        .returns(Promise.resolve(valuesOverride));
      valuesDtoValidatorMock
        .setup((i) => i.validateSync(valuesOverride))
        .throws(new Error("invalid values"));

      const valuesReader = buildValuesReader();

      await expect(valuesReader.read(true)).rejects.toThrow("invalid values");
    });
  });

  describe("read values from env", () => {
    beforeEach(() => {
      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesFileName))
        .returns(Promise.resolve(false))
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(false));
    });

    it("must return empty values if env are empty", async () => {
      envProviderMock.setup((i) => i.env).returns({});

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({});
    });

    it("must return values if env are not empty", async () => {
      envProviderMock
        .setup((i) => i.env)
        .returns({
          key: "value",
        });

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({
        key: {default: "value"},
      });
    });

    it("must skip invalid keys", async () => {
      envProviderMock.setup((i) => i.env).returns({"1key": "value"});

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({});
    });

    it("must skip keys with nullable value", async () => {
      envProviderMock.setup((i) => i.env).returns({key: undefined});

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({});
    });
  });

  describe("read values from both files and env", () => {
    it("must return values", async () => {
      const values = {
        key1: {production: "value 1"},
        key2: {production: "value 2"},
      };
      const valuesOverride = {
        key2: {production: "value 2 [overridden]"},
        key3: {production: "value 3"},
        key4: {production: "value 4"},
      };
      const valuesEnv = {key4: "value 4 [overridden]", key5: "value 5"};

      fsProviderMock
        .setup((i) => i.hasReadAccess(valuesFileName))
        .returns(Promise.resolve(true))
        .setup((i) => i.hasReadAccess(valuesOverrideFileName))
        .returns(Promise.resolve(true))
        .setup((i) => i.readYaml(valuesFileName))
        .returns(Promise.resolve(values))
        .setup((i) => i.readYaml(valuesOverrideFileName))
        .returns(Promise.resolve(valuesOverride));
      envProviderMock.setup((i) => i.env).returns(valuesEnv);

      const valuesReader = buildValuesReader();

      expect(await valuesReader.read(true)).toStrictEqual({
        ...values,
        ...valuesOverride,
        ...{
          key4: {default: "value 4 [overridden]"},
          key5: {default: "value 5"},
        },
      });
    });
  });
});
