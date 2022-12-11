const a = [2, 1, 9]; // change the value

const {
  calculateNormalization,
} = require("./calculation/calculateNormalization");

console.log(`Normalize [${a}] = ${calculateNormalization(a)}`);
