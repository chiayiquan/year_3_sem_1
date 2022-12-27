const a = [9, 1, 2]; // change the array value
const b = [4, 9, 2]; // change the array value

const { calculateDistance } = require("./calculation/calculateDistance");

console.log(`Distance = ${calculateDistance(a, b)}`);
