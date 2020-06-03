const WINDOWINNERWIDTH = document.querySelector(".content").offsetWidth;
console.log("WINDOWINNERWIDTH", WINDOWINNERWIDTH);
const WINDOWINNERHEIGHT = document.querySelector(".content").offsetHeight;
console.log("WINDOWINNERHEIGHT", WINDOWINNERHEIGHT);
const WINDOWINNERDEPT = document.querySelector(".bottom").offsetHeight;
console.log("WINDOWINNERDEPT", WINDOWINNERDEPT);
const TIME_INTERVAL = 20;
let gameRunning = true;
let timeForShark = 0;
let bulletNo = 0;

class Fish {
  constructor(
    id,
    x,
    y,
    z,
    deltaX,
    deltaY,
    deltaZ,
    directiony,
    t,
    maxFront,
    maxDepth,
    img
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.maxFront = maxFront;
    this.maxDepth = maxDepth;
    this.img = img;

    this.t = t;
    this.behaviour = "sin"; // this can be sin, cos,
    this.directiony = directiony;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    this.shadow = document.createElement("div");
    this.shadow.className = "shadow";
    this.shadow.id = id;
    this.shadow.style.left = this.x + "px";
    this.shadow.style.top = 500 + "px";
    this.shadow.style.transform = `rotateX(180deg) rotateY(180deg) translateZ(${this.z}px)`;

    document.querySelector(".content").appendChild(this.shadow);

    this.element = document.createElement("div");
    this.element.className = "fish";
    this.element.id = id;
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.transform = ` translateZ(${this.z}px)`;
    this.element.style.backgroundImage = this.img;

    document.querySelector(".content").appendChild(this.element);

    this.chooseBehavior();
  }

  // Drawing the movement in css
  draw() {
    this.element.style.left = this.x + "px";
    this.shadow.style.left = this.x + "px";

    this.element.style.top = this.y + "px";

    this.element.style.transform = `scaleX(1) translateZ(${this.z}px)`;
    this.shadow.style.transform = `rotateX(90deg) translateY(${this.z}px)`;
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
    this.x = this.x + this.deltaX;

    let A = 40;
    this.y =
      A * Math[this.behaviour](0.05 * this.x - 0.5 * this.t + 1) + this.deltaY;
    this.deltaY = this.deltaY + this.directiony;

    this.z = this.z - this.deltaZ;

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
    if (this.y > WINDOWINNERHEIGHT - 100) {
      this.directiony = -Math.abs(this.directiony);
    }

    //If the egg goes out of the width of the window in z; Front trasnlate  total dept=-500
    if (this.z < this.maxDepth) {
      this.deltaZ = -this.deltaZ;
    }
    if (this.z > this.maxFront) {
      this.deltaZ = -this.deltaZ;
    }
  }

  update() {
    this.movementPattern();
  }
}

class Shark extends Fish {
  constructor(
    id,
    x,
    y,
    z,
    deltaX,
    deltaY,
    deltaZ,
    directiony,
    t,
    maxFront,
    maxDepth,
    sharkLife, 
    img
  ) {
    super(
      id,
      x,
      y,
      z,
      deltaX,
      deltaY,
      deltaZ,
      directiony,
      t,
      maxFront,
      maxDepth, 
      img
    );
    this.element.className = "shark";

    this.shadow.className = "shadowShark";
    this.sharkLife = sharkLife;
    this.element.style.backgroundImage = "url(shark3.png)";

    document.querySelector(".content").appendChild(this.shadow);
  }

  movementPattern() {
    let A = 10;

    this.x = A * Math.sin(0.05 * this.z - 0.5 * this.t + 1) + this.x;

    this.y = this.y;

    this.z = this.z + this.deltaZ;

    // LOOPING OBJ
    //console.log("Object.values(bulletsUsed)", Object.values(bulletsUsed));

    for (let i = 0; i < Object.values(bulletsUsed).length; i++) {
      let bullet = Object.values(bulletsUsed)[i];

      let sharkRadio = this.element.offsetWidth / 2;

      if (
        Math.abs(bullet.bulletX - this.x) < sharkRadio &&
        Math.abs(bullet.bulletY - this.y) < sharkRadio &&
        Math.abs(bullet.bulletZ - this.z) < sharkRadio
      ) {
        this.sharkLife = this.sharkLife - 1;

        delete bulletsUsed[bullet.id];
        document.getElementById([bullet.id]).remove();
        document.getElementById([bullet.shadowBullet.id]).remove();
      }
      if (this.sharkLife === 0) {
        this.element.remove();
        this.shadow.remove();
        delete sharkCreated[this.id];
      }
    }

    if (sharkCreated[this.id] && sharkCreated[this.id].z > 200) {
      alert("Game Over you have been eaten!!");
      gameRunning = false;
    }
  }
}

class Bullet {
  constructor(id, Vo, angle, event) {
    this.id = id;
    this.element = document.createElement("div");
    this.element.className = "bullet";
    this.element.id = id;
    this.bulletX = event.offsetX;

    this.bulletY = event.offsetY;
    this.bulletZ = 0;

    this.element.style.left = this.bulletX + "px";
    this.element.style.top = this.bulletY + "px";
    this.element.style.transform = `translateZ(${this.bulletZ}px)`;

    this.shadowBullet = document.createElement("div");
    this.shadowBullet.className = "shadowBullet";
    this.shadowBullet.id = id;
    this.ShadowBulletX = this.bulletX;
    this.ShadowBulletY = 500;
    this.ShadowBulletZ = 0;

    this.shadowBullet.style.left = this.bulletX + "px";
    this.shadowBullet.style.top = 500 + "px";
    this.shadowBullet.style.transform = `translateZ(${this.bulletZ}px)`;
    document.querySelector(".content").appendChild(this.shadowBullet);

    this.Vo = Vo;
    this.angle = angle;

    this.veloX = ((this.bulletX - 400) * TIME_INTERVAL) / 1000;

    this.veloY = ((this.bulletY - 300) * TIME_INTERVAL) / 1000;
    document.querySelector(".content").appendChild(this.element);

    this.count = 0;
  }

  //Bullet movement and drawing
  bulletMovement() {
    this.count++;

    let deltatimeBullet = TIME_INTERVAL / 1000;
    this.bulletX += this.veloX;

    this.bulletZ =
      this.bulletZ - this.Vo * Math.cos(this.angle) * deltatimeBullet;

    this.bulletY += this.veloY;

    this.element.style.left = this.bulletX + "px";

    this.shadowBullet.style.left = this.bulletX + "px";

    this.element.style.top = this.bulletY + "px";

    this.element.style.transform = `translateZ(${this.bulletZ}px)`;
    this.shadowBullet.style.transform = `translateZ(${this.bulletZ}px)`;

    if (
      this.bulletZ < -500 ||
      this.bulletX > WINDOWINNERWIDTH ||
      this.bulletX < 0 ||
      this.bulletY > WINDOWINNERHEIGHT ||
      this.bulletY < 0
    ) {
      this.element.remove();
      this.shadowBullet.remove();
      delete bulletsUsed[this.id];
    }

    let fishArr = Object.values(fishCreated);
    console.log("fishArr", fishArr);

    for (let i = 0; i < fishArr.length; i++) {
      let fishRadio = fishCreated[fishArr[i].id].element.offsetWidth / 2;
      console.log("fishRadio", fishRadio);

      let contactRadio = fishRadio;

      if (
        Math.abs(this.bulletX - fishArr[i].x) < contactRadio &&
        Math.abs(this.bulletY - fishArr[i].y) < contactRadio &&
        Math.abs(this.bulletZ - fishArr[i].z) < contactRadio
      ) {
        console.log("this.bulletX", this.bulletX, "fishArr[i].x", fishArr[i].x);
        console.log("this.bulletY", this.bulletY, "fishArr[i].y", fishArr[i].y);
        console.log("this.bulletZ", this.bulletX, "fishArr[i].z", fishArr[i].z);

        this.element.remove();
        delete bulletsUsed[this.id];
        this.shadowBullet.remove();
        fishCreated[fishArr[i].id].shadow.remove();
        fishCreated[fishArr[i].id].element.remove();
        delete fishCreated[fishArr[i].id];
      }
    }
  }

  updateBullet() {
    this.bulletMovement();
  }
}

//objects of game components
const bulletsUsed = {};
const fishCreated = {};
const sharkCreated = {};

//Shooting the fishes

function shoot(event) {
  let bulletId = bulletNo;
  let newBullet = new Bullet(bulletId, 200, 0.1, event);
  bulletNo = bulletNo + 1;

  bulletsUsed[bulletId] = newBullet;
}
document.querySelector(".content").addEventListener("click", shoot);

//Calling the fishes.
//fish Parameters

for (let i = 0; i < 10; i++) {
  const speedArr = [5, 1, -2, -3, 0.5];
  const directionyArr = [1, -1, 1, -0.5, -2];
  const imgArr = [
    "url(blueFish.png)",
    "url(calamar.png)",
    "url(fish1.png)",
    "url(fish2.png)",
    "url(turtle.png)",
  ];
  let img = imgArr[Math.floor(Math.random() * imgArr.length)];
  // console.log(img);
  // console.log(Math.floor(Math.random()*imgArr.length));
  let newFish = new Fish(
    //id
    i,
    //x
    Math.random()*800,
    //y
    Math.random()*400,
    //z
    -500,
    //deltaX
    speedArr[Math.floor(Math.random() * speedArr.length)],
    //deltaY
    speedArr[Math.floor(Math.random() * speedArr.length)],
    //deltaZ
    1,
    //direction
    directionyArr[Math.floor(Math.random() * directionyArr.length)],
    //t:time
    20 + 100 * i,
    //maxFront
    0,
    //maxDepth
    -500,
    //img
    img
  );

  fishCreated[newFish.id] = newFish;
}


setInterval(() => {
  if (gameRunning) {

    dayNightCycle.update()
    let fishArr = Object.values(fishCreated);

    fishArr.forEach((fish) => {
      fish.update();
      fish.draw();
    });

    for (let bullet of Object.values(bulletsUsed)) {
      //console.log("IN SINDE CLOOPS", bullet)
      bullet.updateBullet();
      bullet.bulletMovement();
    }
    let sharkArr = Object.values(sharkCreated);
    sharkArr.forEach((shark) => {
      shark.update();
      shark.draw();
    });

    for (let bubble of Object.values(ornamentObj)){
      bubble.update();
    }

    timeForShark = timeForShark + 1;

    if (timeForShark === 20) {
      for (let i = 0; i < 1; i++) {
        let newShark = new Shark(
          //name
          i,
          //x
          WINDOWINNERWIDTH / 2,
          //y
          WINDOWINNERHEIGHT / 2,
          //z
          -500,
          //deltaX
          1,
          //deltaY
          1,
          //deltaZ
          1,
          //direction
          1,
          //t:time
          10,
          //maxFront
          200,
          //maxDepth
          -500,
          3
        );
        sharkCreated[i] = newShark;
      }
    }
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

class Ornament {
  constructor(id, x, y, z, img, width, height) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = -z;
    this.img = img;
    this.width = width;
    this.height = height;
    this.element = document.createElement("div");
    // console.log("this.element", this.element);
    this.element.className = "ornament";
    this.element.id = `ornament${this.id}`;
    this.element.style.backgroundImage = this.img;
    this.element.style.width = this.width;
    this.element.style.height = this.height;
    this.element.style.top = this.y + "px";
    this.element.style.left = this.x + "px";
    this.element.style.transform = `translateZ(${this.z}px)`;
    document.querySelector(".content").appendChild(this.element);
  }

  update(){

  }
}
class Bubble extends Ornament {
  constructor(id, x, y, z, img, width, height) {
    super(id, x, y, z, img, width, height);
    this.deltay = 1;
  }

  move() {
    this.y -= this.deltay;
    this.x = (Math.sin(this.y/4)) + this.x;

    if (this.y<0){
      this.y = Math.random()*100+300;
      this.x = Math.random()*800
    }
  }

  draw(){
    this.element.style.top = this.y + "px";
    this.element.style.left = this.x + "px";

  }
  update() {
    this.move();
    this.draw()
  }
}

const ornamentObj = {};

for (let i = 0; i < 8; i++) {
  let algaeX;
  if (i % 2 === 0) {
    algaeX = 730;
  } else {
    algaeX = 0;
  }
  let algaeZArr = [0, 0, 100, 100, 200, 200, 400, 400];
  let algae = new Ornament(
    `algae${i}`,
    algaeX,
    300,
    algaeZArr[i],
    "url(algae.png)",
    100 + "px",
    200 + "px"
  );

  ornamentObj[`algae${i}`] = algae;
}

for (let i = 0; i < 20; i++) {
  let pinkCoral = new Ornament(
    `pinkCoral${i}`,
    100 + Math.random() * 400,
    400,
    Math.random() * 200,
    "url(pinkCoral.png)",
    100 + "px",
    50 + "px"
  );

  ornamentObj[`pinkCoral${i}`] = pinkCoral;
}

for (let i = 0; i < 100; i++) {
  let bubleImg;
  if (i < 20) {
    bubleImg = "url(buble.png)";
  }
  if (20 < i && i < 40) {
    bubleImg = "url(buble2.png)";
  }
  if (40 < i && i < 60) {
    bubleImg = "url(buble3.png)";
  }
  if (60 < i && i < 80) {
    bubleImg = "url(buble4.png)";
  }
  if (80 < i && i < 100) {
    bubleImg = "url(buble3.png)";
  }

  let bubles = new Bubble(
    `buble${i}`,
    Math.random() * 800,
    Math.random() * 400,
    Math.random() * 500,
    bubleImg,
    30 + "px",
    30 + "px"
  );
  ornamentObj[`buble${i}`] = bubles;
}

let frontCoral = new Ornament(
  "frontCoral",
  200,
  300,
  300,
  "url(frontCoral.png)",
  500 + "px",
  200 + "px"
);
ornamentObj["frontCoral"] = frontCoral;


class DayNightCycle {
  constructor(){
    this.topEle = document.querySelector(".top")
    this.frontEle = document.querySelector(".front")
    this.period = 0.5;
    this.periodDelta = 0.001;
  }

  update(){

    if (this.period > 0.6 || this.period < 0.2 ){
      this.periodDelta = -this.periodDelta
    }
    this.period+=this.periodDelta

    this.topEle.style.opacity = this.period
    this.frontEle.style.opacity = this.period

  }



}

const dayNightCycle = new DayNightCycle()
