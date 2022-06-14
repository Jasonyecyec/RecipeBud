"use strict";
const searchContainer = document.querySelector(".search-container ");
const bookmarkContainer = document.querySelector(".bookmark-mobile-container");
const hamburgerContainer = document.querySelector(".hamburger-container");

const leaveSearch = document.querySelector(".leave-search");
const hamburgerChoices = document.querySelectorAll(".hamburger-choice");
const closeHamburger = document.querySelector(".close-hamburger");
const closeBookmark = document.querySelector(".close-bookmark-mobile");
const searchInputMobile = document.querySelector(".search-input-mobile");
const searchBtnMobile = document.querySelector(".btn-search-mobile");
const toolTipMobile = document.querySelector(".tooltip-mobile");
const leftBtnScrollMobile = document.querySelector(".fa-chevron-left");
const rightBtnScrollMobile = document.querySelector(".fa-chevron-right");

const firstRecipeContainer = document.querySelector(".recipe-container");
const lastRecipeContainer = document.querySelectorAll(".recipe-container")[5];
const body = document.querySelector("body");
const html = document.querySelector("html");
const recipeMobileScrollContainer = document.querySelector(
  ".recipe-mobile-scroll-container"
);
const bookmarkAction = document.querySelector(".bookmark-list-container");
const navbarAction = document.querySelector(".navbar-icon");
//------------------------------------------------------------------------------

//add hide css
const addHide = function (element, classname) {
  element.classList.add(classname);
};

//remove hide css
const removeHide = function (element, classname) {
  element.classList.remove(classname);
};

//change body and html overflow y
const changeDocumentOverflow = function (body, html, action) {
  body.style.overflowY = action;
  html.style.overflowY = action;
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

  changeDocumentOverflow(body, html, "hidden");
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
  <p class="recipe-site">${recipeSite}</p>
</div>`;

  bookmarkAction.insertAdjacentHTML("beforeend", recipeToAdd);
};

//delete a list from bookmark function
const deleteBookmarkList = function (e) {
  if (e.target.className !== "delete-bookmark") return;
  e.target.closest("div").classList.add("removeBookmark");

  setTimeout(() => {
    e.target.closest("div").remove();
  }, "500");
};

//check search input field
const ifSearchInputHasValue = function (element) {
  return element.value !== "" ? true : false;
};

//show tooltip in search input
const showSearchInputToolTip = function (element) {
  element.classList.remove("hide");

  setTimeout(() => {
    element.classList.add("hide");
  }, "1000");
};

const recipeMobileScrollRight = function (number) {
  recipeMobileScrollContainer.scrollLeft += number;
};

const recipeMobileScrollLeft = function (number) {
  recipeMobileScrollContainer.scrollLeft -= number;
};

const firstRecipeCallback = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      leftBtnScrollMobile.classList.remove("hide");
    } else {
      leftBtnScrollMobile.classList.add("hide");
    }
  });
};

const lastRecipeCallback = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      rightBtnScrollMobile.classList.remove("hide");
    } else {
      rightBtnScrollMobile.classList.add("hide");
    }
  });
};

const firstRecipeObserver = new IntersectionObserver(firstRecipeCallback, {
  root: recipeMobileScrollContainer,
  rootMargin: "4000px 0px 4000px 0px",
  threshold: 0.2,
});

const lastRecipeObserver = new IntersectionObserver(lastRecipeCallback, {
  root: recipeMobileScrollContainer,
  rootMargin: "4000px 0px 4000px 0px",
  threshold: 0,
});

firstRecipeObserver.observe(firstRecipeContainer);
lastRecipeObserver.observe(lastRecipeContainer);

//recipe mobile scroll action
recipeMobileScrollContainer.addEventListener("click", function (e) {
  const scrollContainerWidth = recipeMobileScrollContainer.offsetWidth;

  if (e.target.classList.contains("fa-chevron-right")) {
    // recipeMobileScrollRight();
    recipeMobileScrollRight(scrollContainerWidth / 2 + 100);
  } else if (e.target.classList.contains("fa-chevron-left")) {
    recipeMobileScrollLeft(scrollContainerWidth / 2 + 100);
  }
});

bookmarkAction.addEventListener("click", deleteBookmarkList);

//close search container
leaveSearch.addEventListener("click", function () {
  addHide(searchContainer, "hide");
  changeDocumentOverflow(body, html, "scroll");
});

closeBookmark.addEventListener("click", function () {
  addHide(bookmarkContainer, "hide-container");
  changeDocumentOverflow(body, html, "scroll");

  hamburgerChoices.forEach((choice) =>
    addHide(choice, "hide-container-choice")
  );
});

closeHamburger.addEventListener("click", function () {
  addHide(hamburgerContainer, "hide-container");
  changeDocumentOverflow(body, html, "scroll");

  hamburgerChoices.forEach((choice) =>
    addHide(choice, "hide-container-choice")
  );
});

searchBtnMobile.addEventListener("click", function () {
  const result = ifSearchInputHasValue(searchInputMobile);

  result ? "fucntion for search" : showSearchInputToolTip(toolTipMobile);
});

addToBookmark("food-sample.png", "ARTICHOKE BREAD", "CLOSET COOKING");

renderBookmarkList(5);
