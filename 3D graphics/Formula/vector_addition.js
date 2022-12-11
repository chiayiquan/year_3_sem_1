const firstVector = [5, 1, 1]; // change the value
const secondVector = [2, 4, 1]; // change the value

console.log(
  `(${firstVector.map((value, index) => value + secondVector[index])})`
);
