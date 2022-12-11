function calculateDistance(a, b) {
  const distance = Math.sqrt(
    a
      .map((value, index) => value - b[index])
      .reduce(
        (accumulator, currentValue) => accumulator + Math.pow(currentValue, 2),
        0
      )
  );
  return distance;
}

module.exports = { calculateDistance };
