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
    name,
    x,
    y,
    z,
    deltaX,
    deltaY,
    deltaZ,
    directiony,
    t,
    maxFront,
    maxDepth
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
    this.maxFront = maxFront;
    this.maxDepth = maxDepth;

    this.t = t;
    this.behaviour = "sin"; // this can be sin, cos,
    this.directiony = directiony;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.deltaZ = deltaZ;
    this.shadow = document.createElement("div");
    this.shadow.className = "shadow";
    this.shadow.style.left = this.x + "px";
    this.shadow.style.top = 500 + "px";
    this.shadow.style.transform = `translateZ(${this.z}px)`;

    document.querySelector(".content").appendChild(this.shadow);

    this.element = document.createElement("div");
    this.element.className = "fish";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.transform = `translateZ(${this.z}px)`;

    document.querySelector(".content").appendChild(this.element);

    this.chooseBehavior();
  }

  // Drawing the movement in css
  draw() {
    this.element.style.left = this.x + "px";
    this.shadow.style.left = this.x + "px";

    this.element.style.top = this.y + "px";

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
    if (this.y > WINDOWINNERHEIGHT) {
      this.directiony = -Math.abs(this.directiony);
    }

    //If the egg goes out of the width of the window in z; Front trasnlate  total dept=-500
    if (this.z < this.maxDepth) {
      this.deltaZ = -this.deltaZ;
      this.element.style.backgroundColor = "black";
    }
    if (this.z > this.maxFront) {
      this.element.style.backgroundColor = "red";
      this.deltaZ = -this.deltaZ;
    }
  }

  update() {
    this.movementPattern();

  }
}

class Shark extends Fish {
  constructor(
    name,
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
    sharkLife
  ) {
    super(
      name,
      x,
      y,
      z,
      deltaX,
      deltaY,
      deltaZ,
      directiony,
      t,
      maxFront,
      maxDepth
    );
    this.element.className = "shark";

    this.shadow.className = "shadowShark";
    this.sharkLife = sharkLife;

    document.querySelector(".content").appendChild(this.shadow);
    
  }

  movementPattern() {
    let A = 400;

    this.x = this.x;

    this.y = this.y;

    this.z = this.z + this.deltaZ;


        // LOOPING OBJ
        //console.log("Object.values(bulletsUsed)", Object.values(bulletsUsed));
     
    for ( let i = 0; i< Object.values(bulletsUsed).length; i ++){
      let bullet = Object.values(bulletsUsed)[i];
      
      let sharkRadio = this.element.offsetWidth / 2;
      
      if (
        bullet.bulletX - this.x < sharkRadio &&
        bullet.bulletY - this.y < sharkRadio &&
        bullet.bulletZ - this.z < sharkRadio
      ) {
        this.sharkLife = this.sharkLife - 1;
        delete bulletsUsed[bullet.id];
        document.getElementById([bullet.id]).remove();
        document.getElementById([bullet.shadowBullet.id]).remove();
      }
      console.log("sharkLife", this.sharkLife);
      if (this.sharkLife === 0) {
          this.element.remove();
          this.shadow.remove();
          
          sharkArr.pop();
      }
      



    }

    if (this.z > 200) {
      alert("Game Over you have been eaten!!");
      gameRunning = false;
    }
  }
}

class Bullet {
  constructor(id,Vo, angle, event) {
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
    document.querySelector(".content").appendChild(this.element);
  }
  
  //Bullet movement and drawing
  bulletMovement() {
    const g = 10;
    let deltatimeBullet = TIME_INTERVAL / 1000;

    let timeBulletMax = (this.Vo * Math.sin(this.angle)) / g;

    this.element.style.left = this.bulletX + "px";

    this.bulletY =
      this.bulletY -
      this.Vo * Math.sin(this.angle) * deltatimeBullet -
      0.5 * g * deltatimeBullet * deltatimeBullet;
    this.element.style.top = this.bulletY + "px";

    this.bulletZ =
      this.bulletZ - this.Vo * Math.cos(this.angle) * deltatimeBullet;

    this.element.style.transform = `translateZ(${this.bulletZ}px)`;
    this.shadowBullet.style.transform = `translateZ(${this.bulletZ}px)`;

    if (this.bulletZ < -500) {
      this.element.remove();
      this.shadowBullet.remove();
      delete bulletsUsed[this.id];
      // console.log("HERE",bulletsUsed)
      // console.log("i am this", bulletsUsed[this.id])
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
        eggArr.splice(i, 1);
        //bulletArr.splice(i, 1);
      }
    }
  }

  updateBullet() {
    this.bulletMovement();
  }
}
//Shooting the fishes
const bulletsUsed = {
};


function shoot(event) {
 let bulletId = bulletNo;
  let newBullet = new Bullet(bulletId,100, 0.1, event);
  bulletNo = bulletNo + 1;

  bulletsUsed[bulletId] = newBullet;
}
document.querySelector(".content").addEventListener("click", shoot);
//console.log('bulletsUsed', bulletsUsed);

//Calling the eggs.
//fish Parameters
const speedArr = [5, 1, -2, -3, 0.5];
const directionyArr = [1, -1, 1, -0.5, -2];
const eggArr = [];
for (let i = 0; i < 3; i++) {
  let newEgg = new Fish(
    //name
    i,
    //x
    0,
    //y
    WINDOWINNERHEIGHT / 2,
    //z
    -500,
    //deltaX
    speedArr[i],
    //deltaY
    speedArr[i],
    //deltaZ
    1,
    //direction
    directionyArr[i],
    //t:time
    20 + 100 * i,
    //maxFront
    0,
    //maxDepth
    -500
  );
  eggArr.push(newEgg);
}
const sharkArr = [];

setInterval(() => {
  if (gameRunning) {
    

    eggArr.forEach((egg) => {
      egg.update();
      egg.draw();
    });
    
    for (let bullet of Object.values(bulletsUsed)){

      //console.log("IN SINDE CLOOPS", bullet)
      bullet.updateBullet();
      bullet.bulletMovement();
    }
    sharkArr.forEach((shark) => {
      shark.update();
      shark.draw();
    });
    timeForShark = timeForShark + 1;

    if (timeForShark === 20) {
      //  timeForShark = 0;

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
        sharkArr.push(newShark);
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
