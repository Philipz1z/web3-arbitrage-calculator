import test from "node:test";
import assert from "node:assert/strict";
import { calculateArbitrage } from "../src/calculator.js";

const baseline = {
  buyPrice: 100,
  sellPrice: 103,
  tradeAmount: 1000,
  buyFeePercent: 0.1,
  sellFeePercent: 0.1,
  slippagePercent: 0.05,
  gasCost: 2,
};

test("calculates a profitable opportunity after all costs", () => {
  const result = calculateArbitrage(baseline);

  assert.equal(result.profitable, true);
  assert.ok(result.netProfit > 24 && result.netProfit < 25);
  assert.ok(result.roiPercent > 2.4);
  assert.equal(result.grossSpreadPercent, 3);
});

test("detects when fees, slippage, and gas erase the spread", () => {
  const result = calculateArbitrage({
    ...baseline,
    sellPrice: 100.25,
    gasCost: 8,
  });

  assert.equal(result.profitable, false);
  assert.ok(result.netProfit < 0);
});

test("break-even sell price produces approximately zero profit", () => {
  const firstPass = calculateArbitrage(baseline);
  const atBreakEven = calculateArbitrage({
    ...baseline,
    sellPrice: firstPass.breakEvenSellPrice,
  });

  assert.ok(Math.abs(atBreakEven.netProfit) < 1e-9);
});

test("rejects invalid numeric inputs", () => {
  assert.throws(
    () => calculateArbitrage({ ...baseline, buyPrice: 0 }),
    /greater than zero/,
  );
  assert.throws(
    () => calculateArbitrage({ ...baseline, gasCost: -1 }),
    /cannot be negative/,
  );
  assert.throws(
    () => calculateArbitrage({ ...baseline, slippagePercent: 100 }),
    /less than 100/,
  );
});
