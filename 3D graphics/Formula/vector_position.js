const time = 1; // change accordingly if is provided
const timeStep = 0.1; // change accordingly if is provided
const force = [0, 0, 30]; // change accordingly if is provided
const mass = 60; // change accordingly if is provided

let initialVector = [0, 0, 0]; // change accordingly if is provided
let initialPosition = [0, 0, 0]; // change accordingly if is provided
const givenAcceleration = [0, 0, 0]; // change this if acceleration is provided

const calculatedAcceleration = force.map((f) =>
  isFinite(f / mass) ? f / mass : 0
);

const acceleration = calculatedAcceleration.every((acc) => acc === 0)
  ? givenAcceleration
  : calculatedAcceleration;

[...new Array(Math.floor(time / timeStep)).keys()].forEach((index) => {
  // index start from 0
  const step = ((index + 1) * timeStep).toFixed(2);

  console.log(
    `The position at ${step} is [${initialPosition
      .map(
        (position, index) => `${position}+${initialVector[index]}*${timeStep}`
      )
      .join(", ")}] = [${calculatePosition()}]`
  );

  console.log(
    `The vector at ${step} is [${initialVector
      .map((vector, index) => `${vector}+${acceleration[index]}*${timeStep}`)
      .join(", ")}] = [${calculateVector()}]`
  );

  console.log("==========================================================");
});

function calculatePosition() {
  return (initialPosition = initialPosition.map((position, index) => {
    const calculatedPosition = position + initialVector[index] * timeStep;
    return Math.round((calculatedPosition + Number.EPSILON) * 10000) / 10000;
  }));
}

function calculateVector() {
  return (initialVector = initialVector.map((vector, index) => {
    const calculatedVector = vector + acceleration[index] * timeStep;
    return Math.round((calculatedVector + Number.EPSILON) * 10000) / 10000;
  }));
}
