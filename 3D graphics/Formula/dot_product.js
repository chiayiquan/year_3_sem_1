const firstVector = [1, 4, 9]; // change this value
const secondVector = [6, 7, 0]; // change this value

console.log(
  `(${firstVector}).(${secondVector})= ${firstVector
    .map((value, index) => value + " * " + secondVector[index])
    .join(" + ")}\n = ${firstVector
    .map((value, index) => value * secondVector[index])
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}`
);
