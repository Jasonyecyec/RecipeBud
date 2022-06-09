"use strict";
const searchContainer = document.querySelector(".search-container ");
const bookmarkContainer = document.querySelector(".bookmark-mobile-container");
const hamburgerContainer = document.querySelector(".hamburger-container");

const leaveSearch = document.querySelector(".leave-search");
const hamburgerChoices = document.querySelectorAll(".hamburger-choice");
const closeHamburger = document.querySelector(".close-hamburger");
const closeBookmark = document.querySelector(".close-bookmark-mobile");

const bookmarkAction = document.querySelector(".bookmark-list-container");
const navbarAction = document.querySelector(".navbar-icon");

//add hide css
const addHide = function (element, classname) {
  element.classList.add(classname);
};

//remove hide css
const removeHide = function (element, classname) {
  element.classList.remove(classname);
};

//mobile navbar action (search,bookmark,hamburger)
navbarAction.addEventListener("click", function (e) {
  const classChoice = [
    "btn-search-home",
    "btn-bookmark-home",
    "btn-hamburger-home",
  ];
  const targetClass = e.target.className;
  if (!classChoice.includes(targetClass)) return;

  switch (targetClass) {
    case classChoice[0]:
      removeHide(searchContainer, "hide");
      break;

    case classChoice[1]:
      removeHide(bookmarkContainer, "hide-container");
      break;

    case classChoice[2]:
      removeHide(hamburgerContainer, "hide-container");
      hamburgerChoices.forEach((choice) =>
        removeHide(choice, "hide-container-choice")
      );
      break;
  }
});

// render bookmark list function
const renderBookmarkList = function (number) {
  for (let i = 0; i < number; i++) {
    addToBookmark("food-sample.png", "ARTICHOKE BREAD", "CLOSET COOKING");
  }
};

//add to bookmark function
const addToBookmark = function (recipeImage, recipeName, recipeSite) {
  let recipeToAdd = `<div class="bookmark-list">
  <img src="images/delete-bookmark.png" alt="delete-bookmark" class="delete-bookmark">
  <img src="images/${recipeImage}" alt="food-sample" class="bookmark-food-sample">
  <p class="recipe-name">${recipeName}</p>
  <p class="recipe-site">${recipeSite}{</p>
</div>`;

  bookmarkAction.insertAdjacentHTML("beforeend", recipeToAdd);
};

//delete a list from bookmark function
const deleteBookmarkList = function (e) {
  if (e.target.className !== "delete-bookmark") return;
  e.target.closest("div").classList.add("removeBookmark");

  setTimeout(() => {
    e.target.closest("div").remove();
  }, "800");
};

bookmarkAction.addEventListener("click", deleteBookmarkList);

leaveSearch.addEventListener("click", function () {
  addHide(searchContainer, "hide");
});

closeBookmark.addEventListener("click", function () {
  addHide(bookmarkContainer, "hide-container");

  hamburgerChoices.forEach((choice) =>
    addHide(choice, "hide-container-choice")
  );
});

closeHamburger.addEventListener("click", function () {
  addHide(hamburgerContainer, "hide-container");

  hamburgerChoices.forEach((choice) =>
    addHide(choice, "hide-container-choice")
  );
});

addToBookmark("food-sample.png", "ARTICHOKE BREAD", "CLOSET COOKING");
renderBookmarkList(5);
