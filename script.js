const WINDOWINNERWIDTH = document.querySelector("#content").offsetWidth;
console.log(WINDOWINNERWIDTH);
const WINDOWINNERHEIGHT = document.querySelector("#content").offsetHeight;
console.log(WINDOWINNERHEIGHT);
const TIME_INTERVAL = 20;

let gameRunning = true;

class Fish {
  constructor(name, x, y, deltaX, deltaY, directiony, t, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.t = t;
    this.behaviour = "sin"; // this can be sin, cos , tan
    this.directiony = directiony;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.color = color;

    this.element = document.createElement("div");
    this.element.className = "fish";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.backgroundColor = this.color;
    document.querySelector("#content").appendChild(this.element);

    this.chooseBehavior();
  }
  // Drawing the movement in css
  draw() {
    this.element.style.left = this.x + "px";
    let drawx = this.element.style.left;
    //console.log("drawx: ", drawx);

    this.element.style.top = this.y + "px";
    let drawy = this.element.style.top;
    //console.log("drawy: ", drawy);
  }
  // Logic of the movement y(x,t)= (A) amplitud maxima * sin(Numero de onda * x * frecuencia angular * t(tiempo en s) + angulo de fase); k=(2pi/longitud de onda)

  movementPattern() {
    if (this.behaviour === "sin") {
      let A = 20;
      //console.log("deltaX", this.deltaX);
      //console.log("deltaY: ", this.deltaY);
      let yNumber =
        A * Math.sin(0.05 * this.x - 0.5 * this.t + 1) + this.deltaY;
      //console.log("this.t: ", this.t / 1000);
      let xNumber = this.x + this.deltaX;

      this.x = xNumber;
      this.y = yNumber;
      //console.log("x: " + xNumber, "y: " + yNumber);

      //If the egg goes out of the width of the window in x
      if (this.x > WINDOWINNERWIDTH) {
        this.deltaX = -this.deltaX;
      }
      if (this.x < 0) {
        this.deltaX = -this.deltaX;
      }
      //If the egg goes out of the width of the window in y
      if (this.y < 0) {
        this.directiony = -this.directiony;
      }
      if (this.y > WINDOWINNERHEIGHT) {
        console.log("changing,direction", this);
        this.directiony = -Math.abs(this.directiony);
      }
      this.deltaY = this.deltaY + this.directiony;
    } else if (this.behaviour === "cos") {
      let A = 20;
      //console.log("deltaX", this.deltaX);
      //console.log("deltaY: ", this.deltaY);
      let yNumber =
        A * Math.cos(0.05 * this.x - 0.5 * this.t + 1) + this.deltaY;
      //console.log("this.t: ", this.t / 1000);
      let xNumber = this.x + this.deltaX;

      this.x = xNumber;
      this.y = yNumber;
      //console.log("x: " + xNumber, "y: " + yNumber);

      //If the egg goes out of the width of the window in x
      if (this.x > WINDOWINNERWIDTH) {
        this.deltaX = -this.deltaX;
      }
      if (this.x < 0) {
        this.deltaX = -this.deltaX;
      }
      //If the egg goes out of the width of the window in y
      if (this.y < 0) {
        this.directiony = -this.directiony;
      }
      if (this.y > WINDOWINNERHEIGHT) {
        console.log("changing,direction", this);
        this.directiony = -Math.abs(this.directiony);
      }
      this.deltaY = this.deltaY + this.directiony;
    } else if (this.behaviour === "tan") {
      let A = 20;
      //console.log("deltaX", this.deltaX);
      //console.log("deltaY: ", this.deltaY);
      let yNumber =
        A * Math.tan(0.05 * this.x - 0.5 * this.t + 1) + this.deltaY;
      //console.log("this.t: ", this.t / 1000);
      let xNumber = this.x + this.deltaX;

      this.x = xNumber;
      this.y = yNumber;
      //console.log("x: " + xNumber, "y: " + yNumber);

      //If the egg goes out of the width of the window in x
      if (this.x > WINDOWINNERWIDTH) {
        this.deltaX = -this.deltaX;
      }
      if (this.x < 0) {
        this.deltaX = -this.deltaX;
      }
      //If the egg goes out of the width of the window in y
      if (this.y < 0) {
        this.directiony = -this.directiony;
      }
      if (this.y > WINDOWINNERHEIGHT) {
        console.log("changing,direction", this);
        this.directiony = -Math.abs(this.directiony);
      }
      this.deltaY = this.deltaY + this.directiony;
    }
  }

  chooseBehavior() {
    if (Math.random() < 0.33) {
      this.behaviour = "sin";
    } else if (Math.random() < 0.66) {
      this.behaviour = "cos";
    } else {
      this.behaviour = "tan";
    }
  }

  update() {
    this.movementPattern();
  }
}

const speedArr = [5, 1, -2, -3, 0.5];
const colorArr = ["red", "antiquewhite", "pink", "cyan", "gold"];

const directionyArr = [1, -1, 1, -0.5, -2];

// Drawing the fishes
const eggArr = [];
//Calling the eggs.
for (let i = 0; i < 5; i++) {
  let newEgg = new Fish(
    i,
    WINDOWINNERWIDTH / 2,
    WINDOWINNERHEIGHT / 2,
    speedArr[i],
    speedArr[i],
    directionyArr[i],
    20 + 100 * i,
    colorArr[i]
  );
  console.log(newEgg);
  eggArr.push(newEgg);
}

setInterval(() => {
  if (gameRunning) {
    eggArr.forEach((egg) => {
      egg.update();
      egg.draw();
    });
  }
}, TIME_INTERVAL);

function stop() {
  if (gameRunning === true) {
    gameRunning = false;
  } else if (gameRunning === false) {
    gameRunning = true;
  }
}

document.querySelector("#stop").addEventListener("click", stop);
