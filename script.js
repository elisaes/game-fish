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
    // console.log("fishx", x);
    // console.log("fishx", y);
    // console.log("fishx", z);

    this.t = t;
    this.behaviour = "sin"; // this can be sin, cos , tan
    this.directiony = directiony;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    this.color = color;
    this.shadow = document.createElement('div');
    this.shadow.className = "shadow";
    this.shadow.style.left = this.x + "px";
    this.shadow.style.top = 500 + "px";
    this.shadow.style.dept = this.z + "px";
    document.querySelector(".content").appendChild(this.shadow);
    


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
    this.shadow.style.left = this.x + "px"
    let drawx = this.element.style.left;
    //console.log("drawx: ", drawx);

    this.element.style.top = this.y + "px";
    let drawy = this.element.style.top;
    //console.log("drawy: ", drawy);
    this.element.style.transform = `translateZ(${this.z}px)`;
    this.shadow.style.transform = `translateZ(${this.z}px)`;
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
    if (this.z < -400) {
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
    this.bulletX = event.offsetX;
    this.bulletY = event.offsetY;
    this.bulletZ = 200;
    console.log("event bulletz",event.offsetZ );
    this.element.style.left = this.bulletX + "px";
    this.element.style.top = this.bulletY + "px";
    this.element.style.transform = `translateZ(${this.bulletZ}px)`;

    this.shadowBullet = document.createElement('div');
    this.shadowBullet.className = "shadowBullet";
    this.ShadowBulletX = this.bulletX
    this.ShadowBulletY = 500;
    this.ShadowBulletZ = 200;
    
    this.shadowBullet.style.left = this.bulletX  + "px";
    this.shadowBullet.style.top = 500 + "px";
    this.shadowBullet.style.transform = `translateZ(${this.bulletZ}px)`;
    document.querySelector(".content").appendChild(this.shadowBullet);
    
    this.Vo = Vo;
    this.angle = angle;
    document.querySelector(".content").appendChild(this.element);
  }
  //Bullet movement and drawing
  bulletMovement() {
    const g = 10;
    let deltatimeBullet = TIME_INTERVAL / 1000;

    let timeBulletMax = (this.Vo * Math.sin(this.angle)) / g;
    //console.log("dtimeBulletMax", timeBulletMax);

    this.element.style.left = this.bulletX + "px";
    //console.log("this.bullet x", this.bulletX);

    this.bulletY =
      this.bulletY -
      this.Vo * Math.sin(this.angle) * deltatimeBullet -
      0.5 * g * deltatimeBullet * deltatimeBullet;
    this.element.style.top = this.bulletY + "px";
    //console.log("this.bullet y", this.bulletY);

    this.bulletZ =
      this.bulletZ - this.Vo * Math.cos(this.angle) * deltatimeBullet;
      console.log("this.bulletZ", this.bulletZ);
    this.element.style.transform = `translateZ(${this.bulletZ}px)`;
    this.shadowBullet.style.transform = `translateZ(${this.bulletZ}px)`;
    console.log( "shadowbulletz", `translateZ(${this.bulletZ}px)`)
   
    if (this.bulletZ < -500) {
      this.element.remove();
      this.shadowBullet.remove();
      bulletArr.shift();
   
    }

    for (let i = 0; i < eggArr.length; i++) {

      let fishRadio = document.querySelectorAll(".fish")[i].offsetWidth / 2;
      
      let bulletRadio = this.element.offsetWidth / 2;
      
      let contactRadio = fishRadio + bulletRadio;
 

      if (
        Math.abs(this.bulletX - eggArr[i].x) < contactRadio &&
        Math.abs(this.bulletY - eggArr[i].y) < contactRadio &&
        Math.abs(this.bulletZ - eggArr[i].z) < contactRadio
      ) {
       
        alert("Shooting");
        eggArr.splice(i,1);
        bulletArr.splice(i,1);
      }
    }
  }

  updateBullet() {
    this.bulletMovement();
  }
}
//Shooting the fishes
const bulletArr = [];

function shoot(event) {
  let newBullet = new Bullet(100, 0.1, event);
  bulletArr.push(newBullet);

  console.log("bullet", bulletArr, newBullet);
}
document.querySelector(".content").addEventListener("click", shoot);

//fish Parameters

const speedArr = [5, 1, -2, -3, 0.5];
const colorArr = ["red", "antiquewhite", "pink", "cyan", "gold"];

const directionyArr = [1, -1, 1, -0.5, -2];

// Drawing the fishes
const eggArr = [];
//console.log("fish", eggArr);
//Calling the eggs.
for (let i = 0; i < 3; i++) {
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
    });
    bulletArr.forEach((bullet, idx) => {
      bullet.updateBullet();
      bullet.bulletMovement();
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
