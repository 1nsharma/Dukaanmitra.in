import test from "node:test";
import assert from "node:assert/strict";
import { getModuleCatalog, validateModuleCatalog } from "../src/lib/integrations/module-registry.mjs";

test("catalog invariants hold", () => assert.equal(validateModuleCatalog(), true));

test("optional modules are disabled unless explicitly enabled", () => {
  const modules = getModuleCatalog({});
  assert.ok(modules.length >= 8);
  assert.ok(modules.every((module) => module.enabled === false));
});

test("only exact string true enables an eligible feature flag", () => {
  const modules = getModuleCatalog({
    DUKAANMITRA_MODULE_SHARED_AI_BRAIN: "true",
    DUKAANMITRA_MODULE_BUSINESS_GROWTH: "1",
  });
  assert.equal(modules.find((module) => module.id === "shared-ai-brain").enabled, true);
  assert.equal(modules.find((module) => module.id === "business-growth").enabled, false);
});

test("restricted verticals cannot be enabled by environment flags", () => {
  const modules = getModuleCatalog({
    DUKAANMITRA_MODULE_CRYPTO_WALLET: "true",
    DUKAANMITRA_MODULE_SOLAR_MICROGRID: "true",
  });
  assert.equal(modules.find((module) => module.id === "crypto-wallet").enabled, false);
  assert.equal(modules.find((module) => module.id === "solar-microgrid").enabled, false);
});

test("public catalog omits internal feature flag names", () => {
  assert.equal(JSON.stringify(getModuleCatalog({})).includes("DUKAANMITRA_MODULE_"), false);
});
