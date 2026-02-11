import { strict as assert } from "assert";
import { normalizeRemoteBaseDirPath } from "../../src/remoteBaseDir";

describe("OneDrive Full: normalize remote base dir", () => {
  it("should keep single folder names unchanged", () => {
    assert.equal(
      normalizeRemoteBaseDirPath("ObsidianTest"),
      "ObsidianTest"
    );
  });

  it("should trim segments and collapse duplicated slashes", () => {
    assert.equal(
      normalizeRemoteBaseDirPath("/ MyNotes // Test / ObsidianTest /"),
      "MyNotes/Test/ObsidianTest"
    );
  });

  it("should return empty string for slash-only inputs", () => {
    assert.equal(normalizeRemoteBaseDirPath("///"), "");
  });
});
