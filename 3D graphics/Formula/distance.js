const a = [9, 8, 2]; // change the array value
const b = [4, 2, 0]; // change the array value

const { calculateDistance } = require("./calculation/calculateDistance");

console.log(`Distance = ${calculateDistance(a, b)}`);
