const WINDOWINNERWIDTH = document.querySelector(".content").offsetWidth;
console.log(WINDOWINNERWIDTH);
const WINDOWINNERHEIGHT = document.querySelector(".content").offsetHeight;
console.log(WINDOWINNERHEIGHT);
const WINDOWINNERDEPT = document.querySelector(".bottom").offsetHeight;
console.log(WINDOWINNERDEPT);
const TIME_INTERVAL = 20;
let timeBullet = 0;
let gameRunning = true;

class Fish {
  constructor(name, x, y, z, deltaX, deltaY, deltaZ, directiony, t, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
    this.t = t;
    this.behaviour = "sin"; // this can be sin, cos , tan
    this.directiony = directiony;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    this.color = color;

    this.element = document.createElement("div");
    this.element.className = "fish";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.dept = this.z + "px";
    this.element.style.backgroundColor = this.color;
    document.querySelector(".content").appendChild(this.element);

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
    this.element.style.transform = `translateZ(${this.z}px)`;
  }

  //setting the behavior in the fish
  chooseBehavior() {
    if (Math.random() < 0.5) {
      this.behaviour = "sin";
    }
    if (Math.random() > 0.5) {
      this.behaviour = "cos";
    }
  }

  // Logic of the movement y(x,t)= (A) amplitud maxima * sin(Numero de onda * x * frecuencia angular * t(tiempo en s) + angulo de fase); k=(2pi/longitud de onda)
  movementPattern() {
    //movement in x
    let xNumber = this.x + this.deltaX;
    this.x = xNumber;

    //movement in y
    //console.log(this.behaviour);
    let A = 40;
    let yNumber =
      A * Math[this.behaviour](0.05 * this.x - 0.5 * this.t + 1) + this.deltaY;
    this.y = yNumber;
    this.deltaY = this.deltaY + this.directiony;
    //console.log("this.y", this.y);

    //movement in z
    let zNumber = this.z - this.deltaZ;
    this.z = zNumber;
    //console.log("this.z", this.z);

    //If the egg goes out of the width of the window in x
    if (this.x > WINDOWINNERWIDTH) {
      this.deltaX = -this.deltaX;
    }
    if (this.x < 0) {
      this.deltaX = -this.deltaX;
    }

    //If the egg goes out of the width of the window in y
    if (this.y < 0) {
      this.directiony = Math.abs(this.directiony);
    }
    if (this.y > WINDOWINNERHEIGHT) {
      //console.log("changing,direction", this);
      this.directiony = -Math.abs(this.directiony);
    }

    //If the egg goes out of the width of the window in z
    //Front trasnlate z=100; total dept=400(300 in the back;100 in the front)
    if (this.z < -300) {
      this.deltaZ = -this.deltaZ;
      this.element.style.backgroundColor = "black";
    }
    if (this.z > 100) {
      this.element.style.backgroundColor = "red";
      this.deltaZ = -this.deltaZ;
    }
  }

  update() {
    this.movementPattern();
  }
}

class Bullet {
  constructor(Vo, angle, event) {
    this.element = document.createElement("div");
    this.element.className = "bullet";
    debugger;
    this.bulletX = event.offsetX;
    this.bulletY = event.offsetY;
    this.bulletZ = 100;
    this.element.style.left = this.bulletX + "px";
    this.element.style.top = this.bulletY + "px";
    this.element.style.transform = `translateZ(${this.bulletZ}px)`;
    this.Vo = Vo;
    this.angle = angle;
    document.querySelector(".content").appendChild(this.element);

    //Bullet movement and drawing
    function bulletMovement() {
      const g = 9.8;
      let deltatimeBullet = TIME_INTERVAL / 1000;
      console.log("deltatimeBullet", deltatimeBullet);

      let timeBulletMax = (this.Vo * Math.sin(this.angle)) / g;

      for (let i = 0; i < timeBulletMax; i = deltatimeBullet) {
        this.element.style.left = this.bulletX + "px";

        this.bulletY =
        this.bulletY + Vo * Math.sin(angle) * i - 0.5 * g * i * i;
        this.element.style.top = this.bulletY + "px";

        this.bulletZ = this.bulletZ + Vo * Math.cos(angle) * i;
        this.element.style.transform = `translateZ(${this.bulletZ}px)`;
      }
    }
  }
  updateBullet() {
    this.bulletMovement();
  }
}
//Shooting the fishes
function shoot(event) {
  let newBullet = new Bullet(20, 0.5, event);
}
document.querySelector("body").addEventListener("click", shoot);

//fish Parameters

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
    -200,
    speedArr[i],
    speedArr[i],
    1,
    directionyArr[i],
    20 + 100 * i,
    colorArr[i]
  );
  // console.log(newEgg);
  eggArr.push(newEgg);
}

setInterval(() => {
  if (gameRunning) {
    eggArr.forEach((egg) => {
      egg.update();
      egg.draw();
      Bullet.updateBullet();
      Bullet.bulletMovement();
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
