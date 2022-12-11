const firstVector = [4, 5, 3]; // change this value
const secondVector = [6, 3, 8]; // change this value

const x = firstVector[1] * secondVector[2] - firstVector[2] * secondVector[1];
const y = firstVector[2] * secondVector[0] - firstVector[0] * secondVector[2];
const z = firstVector[0] * secondVector[1] - firstVector[1] * secondVector[0];

console.log(
  `(${firstVector})x(${secondVector})= [${firstVector[1]} * ${secondVector[2]} - ${firstVector[2]} * ${secondVector[1]},
                ${firstVector[2]} * ${secondVector[0]} - ${firstVector[0]} * ${secondVector[2]},
                ${firstVector[0]} * ${secondVector[1]} - ${firstVector[1]} * ${secondVector[0]}] = (${x},${y},${z})`
);
