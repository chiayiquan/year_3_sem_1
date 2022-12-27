const firstMatrices = [
  [0, 4],
  [0, 4],
]; // change the value
const secondMatrices = [
  [5, 1],
  [0, 4],
]; // change the value

// check if matrices can be multiplied
if (firstMatrices.some((arr) => arr.length !== secondMatrices.length))
  return console.log("Invalid matrices");

function calculateMatrices(firstMatricesArr, secondMatrices) {
  const matrices = secondMatrices.map((secondMatricesArr, index) =>
    secondMatricesArr.map((value) => value * firstMatricesArr[index])
  );

  return matrices.reduce((matricesAcc, matricesVal, currentIndex) => {
    if (currentIndex % 2 !== 0) return matricesAcc;
    const tabulatedValues = matricesVal.map((currentValue, index) => {
      return currentValue + matrices[currentIndex + 1][index];
    });
    matricesAcc.push(tabulatedValues);
    return matricesAcc;
  }, []);
}

const calculatedMatrix = firstMatrices.flatMap((firstMatricesArr) =>
  calculateMatrices(firstMatricesArr, secondMatrices)
);

console.log(`[\n${calculatedMatrix.join("\n")} \n]`);
