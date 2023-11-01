

function showImage(src) {
    var expanded_img_element = document.getElementById("expanded_img");
    var image_element = document.getElementById("image_");
    expanded_img_element.style.display = "block";
    image_element.src = src;
  }
  
  function closeImage() {
    var expanded_img_element = document.getElementById("expanded_img");
    expanded_img_element.style.display = "none";
  }
  
const track = document.querySelector(".image-track");

let mouseDownAt = 0;
let prevPercentage = 0;

function handleOnDown(e) {
    mouseDownAt = e.clientX;
}

function handleOnUp() {
    mouseDownAt = 0;
    prevPercentage = track.dataset.percentage || 0;
}

function handleOnMove(e) {
    if (mouseDownAt === 0) return;

    const mouseDelta = mouseDownAt - e.clientX;
    const maxDelta = window.innerWidth/2;

    const percentage = (mouseDelta / maxDelta) * -100/10;
    const nextPercentageUnconstrained = parseFloat(prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.style.transform = `translateX(${nextPercentage}%)`;
    track.dataset.percentage = nextPercentage;

    for (const image of track.querySelectorAll(".image")) {
        image.style.objectPosition = `${100 + nextPercentage*2}% center`;
    }
}

window.addEventListener("mousedown", handleOnDown);
window.addEventListener("mouseup", handleOnUp);
window.addEventListener("mousemove", handleOnMove);

