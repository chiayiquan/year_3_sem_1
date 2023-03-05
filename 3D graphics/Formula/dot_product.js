const firstVector = [9, 2, 3]; // change this value
const secondVector = [5, 1, 2]; // change this value

console.log(
  `(${firstVector}).(${secondVector})= ${firstVector
    .map((value, index) => value + " * " + secondVector[index])
    .join(" + ")}\n = ${firstVector
    .map((value, index) => value * secondVector[index])
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)}`
);
