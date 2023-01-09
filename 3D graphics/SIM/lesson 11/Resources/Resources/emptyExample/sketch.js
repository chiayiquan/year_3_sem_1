function setup() {
  console.log("m between 0 and 1");
  // m between 0 and 1
  // case 1
  let firstPoint = { x: 1, y: 0 };
  let secondPoint = { x: 6, y: 2 };

  let m = (secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x);
  mBetweenZeroAndOne(firstPoint, secondPoint, m);

  // case 2 - m between 0 and -1
  console.log("m between 0 and -1");
  firstPoint = { x: 1, y: 3 };
  secondPoint = { x: 6, y: 0 };

  m = (secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x);
  mBetweenZeroAndMinusOne(firstPoint, secondPoint, m);

  // case 3 - m more than 1
  console.log("m more than 1");
  firstPoint = { x: 1, y: 0 };
  secondPoint = { x: 3, y: 5 };
  m = (secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x);
  mMoreThanOne(firstPoint, secondPoint, m);

  // case 4 - m less than 1
  console.log("m less than 1");
  firstPoint = { x: 1, y: 5 };
  secondPoint = { x: 3, y: 0 };
  m = (secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x);
  mLessThanMinusOne(firstPoint, secondPoint, m);
}

// Swap value of x and y
// Recompute m
// x = round(x0)
// y = round(m*x + b)
// d = m*(x+1)+b-y

// while(x<round(x1)){
// 	output(y,x,1)
// 	x += 1
// 	d+= m
// 	if(d>0,5){
// 		y += 1
// 		d -= 1
// 	}
// }

function mMoreThanOne(firstPoint, secondPoint, m) {
  let swapFirstPoint = { x: firstPoint.y, y: firstPoint.x };
  let swapSecondPoint = { x: secondPoint.y, y: secondPoint.x };

  m =
    (swapSecondPoint.y - swapFirstPoint.y) /
    (swapSecondPoint.x - swapFirstPoint.x);

  b = swapFirstPoint.y - m * swapFirstPoint.x;

  x = round(swapFirstPoint.x);

  y = round(m * x + b);
  d = m * (x + 1) + b - y;

  while (x < round(swapSecondPoint.x)) {
    console.log(y, x);
    x += 1;
    d += m;
    if (d > 0.5) {
      y += 1;
      d -= 1;
    }
  }
}

function mLessThanMinusOne(firstPoint, secondPoint, m) {
  let swapFirstPoint = { x: firstPoint.y, y: firstPoint.x };
  let swapSecondPoint = { x: secondPoint.y, y: secondPoint.x };

  m =
    (swapSecondPoint.y - swapFirstPoint.y) /
    (swapSecondPoint.x - swapFirstPoint.x);

  b = swapFirstPoint.y - m * swapFirstPoint.x;

  x = round(swapFirstPoint.x);

  y = round(m * x + b);
  d = m * (x + 1) + b - y;

  while (x > round(swapSecondPoint.x)) {
    console.log(y, x);
    x -= 1;
    d -= m;
    if (d > 0.5) {
      y += 1;
      d -= 1;
    }
  }
}
// m 0 to 1
// x = round(x0);
// y = round(m * x + b);
// d = m * (x + 1) + b - y;

// while (x < round(x1)) {
//   output(x, y, 1);
//   x += 1;
//   d += m;
//   if ((d > 0, 5)) {
//     y += 1;
//     d -= 1;
//   }
// }

function mBetweenZeroAndMinusOne(firstPoint, secondPoint, m) {
  // y intercept
  const b = firstPoint.y - m * firstPoint.x;

  x = round(firstPoint.x);
  y = round(m * x + b);
  d = m * (x + 1) + b - y;

  while (x < round(secondPoint.x)) {
    console.log(x, y);
    x += 1;
    d -= m;
    if (d > 0.5) {
      y -= 1; // move y down
      d -= 1;
    }
  }
}

// line -> start point and end point
function mBetweenZeroAndOne(firstPoint, secondPoint, m) {
  // y intercept
  const b = firstPoint.y - m * firstPoint.x;

  x = round(firstPoint.x);
  y = round(m * x + b);
  d = m * (x + 1) + b - y;

  while (x < round(secondPoint.x)) {
    console.log(x, y, 1);
    x += 1;
    d += m;
    if (d > 0.5) {
      y += 1; // move y up
      d -= 1;
    }
  }
}

function draw() {}
