const boxContainer = document.querySelector(".bigContainer");
function moveTheBox(event) {
  let mousePositionX = event.clientX;
  let mousePositionY = event.clientY;
  let mouseCenterX = WINDOWINNERWIDTH / 2;
  let mouseCenterY = WINDOWINNERHEIGHT / 2;

  let mouseX = mousePositionX - mouseCenterX;
  let mouseY = mousePositionY - mouseCenterY;
  if (mouseX < 1000 && mouseX > 0 && mouseY < 800 && mouseY > 0) {
    boxContainer.style.perspectiveOrigin = `${mouseX}px ${mouseY}px`;
   // console.log(boxContainer.style.perspectiveOrigin);
  }
}

document.addEventListener("mousemove", moveTheBox);

// const moveBox = (e) => {

//   const mouseX = e.clientX;
//   const mouseY = e.clientY;

//   boxContainer.style.top = mouseY-400+"px";
//   boxContainer.style.left = mouseX-300+"px";

// }
