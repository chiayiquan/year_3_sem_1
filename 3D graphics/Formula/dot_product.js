const firstVector = [5, 4, 6]; // change this value
const secondVector = [3, 0, 0]; // change this value

console.log(
  `(${firstVector}).(${secondVector})= ${firstVector
    .map((value, index) => value + " * " + secondVector[index])
    .join(" + ")}\n = ${firstVector
    .map((value, index) => value * secondVector[index])
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}`
);
