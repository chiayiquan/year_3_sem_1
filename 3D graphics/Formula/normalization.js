const a = [2, 4, 7]; // change the value

const {
  calculateNormalization,
} = require("./calculation/calculateNormalization");

console.log(`Normalize [${a}] = ${calculateNormalization(a)}`);
