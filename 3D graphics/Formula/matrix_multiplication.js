const firstMatrices = [
  [0, 4],
  [5, 2],
]; // change the value
const secondMatrices = [
  [2, 5],
  [3, 0],
]; // change the value

// check if matrices can be multiplied
if (firstMatrices.some((arr) => arr.length !== secondMatrices.length))
  return console.log("Invalid matrices");

function calculateMatrices(firstMatrices, secondMatrices) {
  const transformedSecondMatrices = [];

  secondMatrices.forEach((arr) =>
    arr.forEach((value, index) =>
      transformedSecondMatrices[index]
        ? transformedSecondMatrices[index].push(value)
        : transformedSecondMatrices.push([value])
    )
  );

  const matrices = firstMatrices.map((firstMatricesArr) =>
    transformedSecondMatrices.map((secondMatricesArr) =>
      secondMatricesArr.reduce(
        (accumulator, currentValue, secondMatricesIndex) =>
          accumulator + currentValue * firstMatricesArr[secondMatricesIndex],
        0
      )
    )
  );

  // check for square matrix
  if (
    matrices.length === firstMatrices.length &&
    matrices[0].length === transformedSecondMatrices.length
  )
    return matrices;

  const calculatedMatrices = sumMatrices(matrices);

  return calculatedMatrices.every(
    (value) => value.length === transformedSecondMatrices[0].length
  )
    ? calculatedMatrices
    : calculatedMatrices.map((value) =>
        value.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        )
      );
}

function sumMatrices(matrices) {
  return matrices.map((arr) =>
    arr.map((value) =>
      value.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    )
  );
}

const calculatedMatrix = calculateMatrices(firstMatrices, secondMatrices);

console.log(`[\n${calculatedMatrix.join("\n")} \n]`);
