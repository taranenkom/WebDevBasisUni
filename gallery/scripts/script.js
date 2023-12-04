const expandedImgElement = document.getElementById("expanded");
function showImage(src, description,time) { 
  const imageElement = document.querySelector(".expanded__img");

  if (!description){
    description = "Wow! Such nice weather!"
  }
  if (!time){
    time = "Fr, 31 Nov 2023 12:00:00 GMT"
  }
  const descriptionElemnt = document.querySelector(".expanded__desc");
  const timeElemnt = document.querySelector(".expanded__timestamp");

  imageElement.src = src;
  descriptionElemnt.innerHTML = description;
  timeElemnt.innerHTML = time;

  expandedImgElement.style.visibility = "visible";
}

function closeImage() {
  expandedImgElement.style.visibility = "hidden";
}

document.addEventListener("DOMContentLoaded", function () {
  var imageItems = document.querySelectorAll(".image-truck__item");
  imageItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var imageSrc = item
        .querySelector(".image-truck__image")
        .getAttribute("src");
      showImage(imageSrc);
    });
  });
  expandedImgElement.addEventListener("click", function () {
    closeImage();
  });
  const track = document.querySelector(".image-truck");

  let mouseDownAt = 0;
  let prevPercentage = 0;

  const page = document.querySelector(".page");
  function handleOnDown(e) {
    page.style.cursor = "grabbing";
    mouseDownAt = e.clientX;
  }
  
  function handleOnUp() {
    page.style.cursor = "default";
    mouseDownAt = 0;
    prevPercentage = track.dataset.percentage || 0;
  }



  function handleOnMove(e) {
    if (mouseDownAt === 0 || !track) return;

    const mouseDelta = mouseDownAt - e.clientX;
    const maxDelta = window.innerWidth / 2 - 100;

    const percentage = ((mouseDelta / maxDelta) * -100) /3;
    const nextPercentageUnconstrained = parseFloat(prevPercentage) + percentage;
    const nextPercentage = Math.max(
      Math.min(nextPercentageUnconstrained, 0),
      -100
    );


    track.style.transform = `translateX(${nextPercentage}%)`;

    // track.animate(
    //   {
    //     transform: 'translateX(${nextPercentage}%)'
    //   }, {duration: 1000, fill: 'forwards'}
    // );

    track.dataset.percentage = nextPercentage;

    for (const image of track.querySelectorAll(".image-truck__image")) {
      // image.style.objectPosition = `${100 + nextPercentage}% center`;
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, {duration: 444, fill: 'forwards'});
    }
  }

  async function fetchImages() {
    try {
        const response = await fetch('https://127.0.0.1:5000/images');
        const images = await response.json();

        const imageTrack = document.querySelector('.page__image-truck.image-truck');


        images.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-truck__item');

            const imgElement = document.createElement('img');
            imgElement.src = `https://127.0.0.1:5000/img/${image.filename}`;
            imgElement.className = 'image-truck__image';
            imgElement.alt = 'Image Not Found';
            imgElement.draggable = false;

            const descriptionElement = document.createElement('div');
            descriptionElement.classList.add('image-truck__desc');
            descriptionElement.innerHTML = image.description || 'No description';

            const timeElement = document.createElement('div');
            const timestamp = image.created_at || 'No timestamp';

            

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(descriptionElement);
            imgContainer.appendChild(timeElement);

            imgContainer.addEventListener('click', () => showImage(
                `https://127.0.0.1:5000/img/${image.filename}`,
                image.description,
                timestamp
            ));

            imageTrack.appendChild(imgContainer);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}


  document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Trigger file selection dialog
  });
  
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
  
    // Prompt user for image description
    const description = prompt('Please enter a description for the image', 'Image description');
  
    if (description !== null) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
  
      fetch('https://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error:', data.error);
        } else {
          console.log('Response:', data.message);
          fetchImages(); // Refresh the list after upload
        }
      })
      .catch(error => console.error('Upload error:', error));
    } else {
      console.log('No description provided.');
      // Handle case where user cancels the prompt
    }
    
});

  window.addEventListener("mousedown", handleOnDown);
  window.addEventListener("mouseup", handleOnUp);
  window.addEventListener("mousemove", handleOnMove);
  document.getElementById('uploadButton').addEventListener('click', function() {
    fileInput.click(); // Trigger file selection dialog
  });
  window.addEventListener('load', fetchImages);
});
