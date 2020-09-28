import {Mock} from "moq.ts";

import {ContextBuilder, IDecryptor} from "../../../src";
import {RsaHelper} from "../../helpers";

describe("values/ContextBuilder", () => {
  let decryptorMock: Mock<IDecryptor>;

  function buildContextBuilder(): ContextBuilder {
    return new ContextBuilder(decryptorMock.object());
  }

  beforeEach(() => {
    decryptorMock = new Mock<IDecryptor>();

    decryptorMock.setup((i) => i.decrypt).returns(RsaHelper.decrypt);
  });

  describe("decrypt encrypted value", () => {
    it("value must be array of strings after decryption", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "production*": [
              await RsaHelper.encrypt("value 1"),
              await RsaHelper.encrypt("value 2"),
            ],
          },
        }),
      ).toStrictEqual({
        key: ["value 1", "value 2"],
      });
    });

    it("value must be string after decryption", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "production*": await RsaHelper.encrypt("value"),
          },
        }),
      ).toStrictEqual({
        key: "value",
      });
    });
  });

  describe("select env in right order", () => {
    it("must select current env in 1st order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "production*": await RsaHelper.encrypt("value 3"),
            "production!": "value 2",
            production: "value 1",
          },
        }),
      ).toStrictEqual({
        key: "value 1",
      });
    });

    it("must select decrypted current env in 2nd order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            default: "value 4",
            "production*": await RsaHelper.encrypt("value 3"),
            "production!": "value 2",
          },
        }),
      ).toStrictEqual({
        key: "value 2",
      });
    });

    it("must select encrypted current env in 3rd order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "default!": "value 5",
            default: "value 4",
            "production*": await RsaHelper.encrypt("value 3"),
          },
        }),
      ).toStrictEqual({
        key: "value 3",
      });
    });

    it("must select default env in 4th order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "default*": await RsaHelper.encrypt("value 6"),
            "default!": "value 5",
            default: "value 4",
          },
        }),
      ).toStrictEqual({
        key: "value 4",
      });
    });

    it("must select decrypted default env in 5th order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            development: "value 6",
            "default*": await RsaHelper.encrypt("value 6"),
            "default!": "value 5",
          },
        }),
      ).toStrictEqual({
        key: "value 5",
      });
    });

    it("must select encrypted default env in 6th order", async () => {
      const contextBuilder = buildContextBuilder();

      expect(
        await contextBuilder.build("production", {
          key: {
            "development!": "value 7",
            development: "value 6",
            "default*": await RsaHelper.encrypt("value 6"),
          },
        }),
      ).toStrictEqual({
        key: "value 6",
      });
    });

    it("must throw error if current or default env is not exists", async () => {
      const contextBuilder = buildContextBuilder();

      await expect(
        contextBuilder.build("production", {
          key: {
            "development*": await RsaHelper.encrypt("value 8"),
            "development!": "value 7",
            development: "value 6",
          },
        }),
      ).rejects.toThrow("can't find env for key");
    });
  });
});
