"use strict";
const btnSearchHome = document.querySelector("#btn-search-home");
const searchContainer = document.querySelector(".search-container ");
const leaveSearch = document.querySelector(".leave-search");

const btnHamburgerHome = document.querySelector("#btn-hamburger-home");
const hamburgerContainer = document.querySelector(".hamburger-container");
const hamburgerChoices = document.querySelectorAll(".hamburger-choice ");
const closeHamburger = document.querySelector(".close-hamburger");

btnSearchHome.addEventListener("click", function () {
  searchContainer.classList.remove("hide");
});

leaveSearch.addEventListener("click", function () {
  searchContainer.classList.add("hide");
});

btnHamburgerHome.addEventListener("click", function () {
  hamburgerContainer.classList.remove("hide-hamburger");

  hamburgerChoices.forEach((choice) =>
    choice.classList.remove("hide-hamburger-choice")
  );
});

closeHamburger.addEventListener("click", function () {
  hamburgerContainer.classList.add("hide-hamburger");

  hamburgerChoices.forEach((choice) =>
    choice.classList.add("hide-hamburger-choice")
  );
});
