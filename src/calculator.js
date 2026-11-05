const PERCENT = 100;

export function calculateArbitrage(input) {
  const values = {
    buyPrice: Number(input.buyPrice),
    sellPrice: Number(input.sellPrice),
    tradeAmount: Number(input.tradeAmount),
    buyFeePercent: Number(input.buyFeePercent),
    sellFeePercent: Number(input.sellFeePercent),
    slippagePercent: Number(input.slippagePercent),
    gasCost: Number(input.gasCost),
  };

  validate(values);

  const buyFeeRate = values.buyFeePercent / PERCENT;
  const sellFeeRate = values.sellFeePercent / PERCENT;
  const slippageRate = values.slippagePercent / PERCENT;
  const effectiveBuyPrice = values.buyPrice * (1 + slippageRate);
  const effectiveSellPrice = values.sellPrice * (1 - slippageRate);
  const buyFee = values.tradeAmount * buyFeeRate;
  const amountConverted = values.tradeAmount - buyFee;
  const tokensReceived = amountConverted / effectiveBuyPrice;
  const grossProceeds = tokensReceived * effectiveSellPrice;
  const sellFee = grossProceeds * sellFeeRate;
  const netProceeds = grossProceeds - sellFee;
  const totalCost = values.tradeAmount + values.gasCost;
  const netProfit = netProceeds - totalCost;
  const roiPercent = (netProfit / totalCost) * PERCENT;
  const grossSpreadPercent =
    ((values.sellPrice - values.buyPrice) / values.buyPrice) * PERCENT;
  const breakEvenSellPrice =
    totalCost /
    (tokensReceived * (1 - slippageRate) * (1 - sellFeeRate));

  return {
    effectiveBuyPrice,
    effectiveSellPrice,
    tokensReceived,
    grossProceeds,
    buyFee,
    sellFee,
    netProceeds,
    totalFees: buyFee + sellFee,
    totalCost,
    netProfit,
    roiPercent,
    grossSpreadPercent,
    breakEvenSellPrice,
    profitable: netProfit > 0,
  };
}

function validate(values) {
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${key} must be a finite number`);
    }
  }

  for (const key of ["buyPrice", "sellPrice", "tradeAmount"]) {
    if (values[key] <= 0) {
      throw new RangeError(`${key} must be greater than zero`);
    }
  }

  for (const key of [
    "buyFeePercent",
    "sellFeePercent",
    "slippagePercent",
    "gasCost",
  ]) {
    if (values[key] < 0) {
      throw new RangeError(`${key} cannot be negative`);
    }
  }

  for (const key of ["buyFeePercent", "sellFeePercent", "slippagePercent"]) {
    if (values[key] >= PERCENT) {
      throw new RangeError(`${key} must be less than 100`);
    }
  }
}
