import assert from "node:assert/strict";
import test from "node:test";

import { validateSpdxDocument } from "./validate-spdx.mjs";

test("accepts a populated SPDX 2.3 document", () => {
  assert.deepEqual(
    validateSpdxDocument({
      spdxVersion: "SPDX-2.3",
      documentNamespace: "https://example.invalid/sbom/1",
      packages: [{ name: "registry", SPDXID: "SPDXRef-registry" }],
      relationships: [],
    }),
    [],
  );
});

test("rejects unsupported or incomplete documents", () => {
  const failures = validateSpdxDocument({
    spdxVersion: "SPDX-2.2",
    documentNamespace: "",
    packages: [],
    relationships: null,
  });

  assert.equal(failures.length, 4);
});
