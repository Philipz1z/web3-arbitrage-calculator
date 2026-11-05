import { calculateArbitrage } from "./calculator.js";

const form = document.querySelector("#calculator-form");
const statusMessage = document.querySelector("#status-message");
const swapButton = document.querySelector("#swap-markets");
const resetButton = document.querySelector("#reset-calculator");
const inputIds = [
  "buy-price",
  "sell-price",
  "trade-amount",
  "buy-fee",
  "sell-fee",
  "slippage",
  "gas-cost",
];

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPrice = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

const formatNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

function getInput() {
  return {
    buyPrice: form.elements.buyPrice.value,
    sellPrice: form.elements.sellPrice.value,
    tradeAmount: form.elements.tradeAmount.value,
    buyFeePercent: form.elements.buyFeePercent.value,
    sellFeePercent: form.elements.sellFeePercent.value,
    slippagePercent: form.elements.slippagePercent.value,
    gasCost: form.elements.gasCost.value,
  };
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function render() {
  try {
    const result = calculateArbitrage(getInput());
    const profitClass = result.profitable ? "positive" : "negative";
    const resultPanel = document.querySelector("#result-panel");

    resultPanel.dataset.outcome = profitClass;
    statusMessage.className = `status ${profitClass}`;
    statusMessage.textContent = result.profitable
      ? "Potentially profitable"
      : "Costs exceed the spread";

    setText("net-profit", formatCurrency.format(result.netProfit));
    setText("roi", `${result.roiPercent.toFixed(3)}%`);
    setText("gross-spread", `${result.grossSpreadPercent.toFixed(3)}%`);
    setText("break-even", formatPrice.format(result.breakEvenSellPrice));
    setText("tokens-received", formatNumber.format(result.tokensReceived));
    setText("effective-buy", formatPrice.format(result.effectiveBuyPrice));
    setText("effective-sell", formatPrice.format(result.effectiveSellPrice));
    setText("buy-fee-total", formatCurrency.format(result.buyFee));
    setText("sell-fee-total", formatCurrency.format(result.sellFee));
    setText("gas-total", formatCurrency.format(Number(getInput().gasCost)));
    setText("net-proceeds", formatCurrency.format(result.netProceeds));
    setText("total-cost", formatCurrency.format(result.totalCost));
    setText("profit-repeat", formatCurrency.format(result.netProfit));
    document.querySelector("#error-message").hidden = true;
  } catch (error) {
    document.querySelector("#error-message").hidden = false;
    document.querySelector("#error-message").textContent = error.message;
  }
}

form.addEventListener("input", render);
form.addEventListener("submit", (event) => event.preventDefault());

swapButton.addEventListener("click", () => {
  const buy = form.elements.buyPrice.value;
  form.elements.buyPrice.value = form.elements.sellPrice.value;
  form.elements.sellPrice.value = buy;
  render();
});

resetButton.addEventListener("click", () => {
  form.reset();
  render();
});

for (const id of inputIds) {
  const input = document.querySelector(`#${id}`);
  input.addEventListener("focus", () => input.select());
}

render();
