function calculateMagnitude(a) {
  const magnitude = Math.sqrt(
    a.reduce(
      (accumulator, currentValue) => accumulator + Math.pow(currentValue, 2),
      0
    )
  );
  return magnitude;
}

module.exports = { calculateMagnitude };
