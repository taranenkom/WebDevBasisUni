//Scroll при натисненні на кнопку "Переглянути автомобілі"
document.getElementById("main-action").onclick = function () {
    document.getElementById("cars").scrollIntoView({ behavior: "smooth" });
  };
  
  //Scroll при натисненні на кнопку "Забронювати"
  let buttons = document.getElementsByClassName("car-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      document.getElementById("price").scrollIntoView({ behavior: "smooth" });
    };
  }
  
  //Валідація форми на frontend
  document.getElementById("price-action").onclick = function () {
    if (document.getElementById("name").value === "") {
      alert("Заповніть поле ім'я!");
    } else if (document.getElementById("phone").value === "") {
      alert("Заповніть поле телефон!");
    } else if (document.getElementById("car").value === "") {
      alert("Заповніть поле автомобіль!");
    } else {
      alert("Спасибі за заявку. Ми зв'яжемося з Вами незабаром.");
    }
  };
  
  //Дз. Підібрати замість 3-х даних стрічкового типу оптимальні значення чисел
  document.addEventListener("DOMContentLoaded", function () {
    let layer = document.querySelector(".price-image");
    document.addEventListener("mousemove", (event) => {
      layer.style.transform =
        "translate3d(" +
        (event.clientX * 0.5) / 10 +
        "px," +
        (event.clientY * 0.8) / 30 +
        "px,0px)";
    });
  
    const elem = document.querySelector(".main");
    document.addEventListener("scroll", () => {
      elem.style.backgroundPositionX =
        "0" + 1.5 * window.pageYOffset + "px";
    });
  });
  