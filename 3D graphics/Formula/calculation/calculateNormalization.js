const { calculateMagnitude } = require("./calculateMagnitude");

function calculateNormalization(a) {
  const magnitude = calculateMagnitude(a);
  const normalization = a.map((value) => value / magnitude);
  return normalization;
}

module.exports = { calculateNormalization };
