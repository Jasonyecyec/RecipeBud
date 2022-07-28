"use strict";
import recipeView from "./views/recipeView.js";
import searchViewMobile from "./views/searchViewMobile.js";
import navbarMobileActionView from "./views/navbarMobileActionView.js";

import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeMobileView from "./views/addRecipeMobileView.js";
import shoppingListMobileView from "./views/shoppingListMobileView.js";
import * as model from "./model.js";
import _ from "../../node_modules/lodash";

const searchContainer = document.querySelector(".search-container ");
const bookmarkContainer = document.querySelector(".bookmark-mobile-container");
const hamburgerContainer = document.querySelector(".hamburger-container");
const shoppingListContainer = document.querySelector(".shopping-list-section");

const leaveSearch = document.querySelector(".leave-search");
const hamburgerChoices = document.querySelectorAll(".hamburger-choice");
const closeHamburger = document.querySelector(".close-hamburger");
const closeBookmark = document.querySelector(".close-bookmark-mobile");
const closeShoppingList = document.querySelector(".close-shopping-list-mobile");
const searchInputMobile = document.querySelector(".search-input-mobile");
const searchBtnMobile = document.querySelector(".btn-search-mobile");
// const toolTipMobile = document.querySelector(".tooltip-mobile");
const leftBtnScrollMobile = document.querySelector(".fa-chevron-left");
const rightBtnScrollMobile = document.querySelector(".fa-chevron-right");
const shoppingListMobile = document.querySelector(".shopping-list-mobile");

const navigationMenuContainer = document.querySelector(
  ".navigation-menu-container"
);
const shoppingListDesktopSection = document.querySelector(
  ".shopping-list-desktop-section"
);

const recipeContainer = document.querySelectorAll(".recipe-container");
const firstRecipeContainer = recipeContainer;
const lastRecipeContainer = recipeContainer[recipeContainer.length - 1];
const body = document.querySelector("body");
const html = document.querySelector("html");

const recipeMobileScrollContainer = document.querySelector(
  ".recipe-mobile-scroll-container"
);

const bookmarkAction = document.querySelector(".bookmark-list-container");
const bookmarkDesktopAction = document.querySelector(
  "#bookmark-hover-container"
);
const shoppingListAction = document.querySelector(".shopping-list-container");
// const navbarAction = document.querySelector(".navbar-icon");
//------------------------------------------------------------------------------

const controlRecipes = async function () {
  try {
    //get url id
    const id = window.location.hash.slice(1);

    if (!id) return;

    //render spinner
    recipeView.renderSpinner();

    //update results view to mark selected search result
    if (model.state.search.query) {
      resultsView.update(model.state.search.results);
    }
    bookmarksView.update(model.state.bookmarks);

    //load  recipe
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderMessage();
  }
};

const controlSearchResults = async function () {
  try {
    //show container
    resultsView.showParent();

    //render spinner
    resultsView.renderSpinner();

    //if object is empty render message
    if (_.isEmpty(model.state.recipe)) {
      recipeView.renderMessage("Click to see the recipe </br> or ingredients.");
    }

    //get search input
    const query = searchViewMobile.getQuery();

    await model.loadSearchResults(query);

    resultsView.render(model.state.search.results);

    //call scroll observer
    resultsView.observer();
  } catch (error) {
    console.log(error);
    resultsView.renderMessage();
  }
};

const navbarAction = function () {
  //guard clause
  if (!navbarMobileActionView.getTargetClass()) return;

  //
  navbarMobileActionView.showNavabarAction();
};

const controlServings = function (newServings) {
  //update the recipe servings(in state)
  model.updateServings(newServings);

  //udpate the recipe view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // ADD/REMOVE bookmark
  //if BOOKMARKED is FALSE|none, run addBookmark
  //if TRUE run deleteBookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlShoppingListMobile = function () {
  if (!model.state.recipe.addedToList) {
    model.addShoppingList(model.state.recipe);
  } else {
    model.deleteShoppingList(model.state.recipe.id);
  }

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  shoppingListMobileView.render(model.state.shoppingList);
};

const shoppingListMobileAction = function (dataId) {
  //delete in shoppin list
  model.deleteShoppingList(dataId);

  //render shopping list
  shoppingListMobileView.render(model.state.shoppingList);

  if (_.isEmpty(model.state.shoppingList)) {
    shoppingListMobileView.renderMessage();
  }

  //update recipe view
  recipeView.update(model.state.recipe);
};

const bookmarkMobileAction = function (dataId) {
  //delete in bookmark
  model.deleteBookmark(dataId);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);

  if (_.isEmpty(model.state.bookmarks)) {
    bookmarksView.renderMessage();
  }

  //update recipe view
  recipeView.update(model.state.recipe);
};

const bookmarksRender = function () {
  bookmarksView.render(model.state.bookmarks);

  if (_.isEmpty(model.state.bookmarks)) {
    bookmarksView.renderMessage();
  }
};

const shoppingListMobileRender = function () {
  shoppingListMobileView.render(model.state.bookmarks);

  if (_.isEmpty(model.state.shoppingList)) {
    shoppingListMobileView.renderMessage();
  }
};

const controlAddRecipe = async function (data) {
  try {
    const emptyData = model.validateUploadData(data);
    const invalidURL = model.validateURL(data);
    const wrongFormatIng = model.validateUploadIngredients(data);

    addRecipeMobileView.renderInputBorderData();

    if (!_.isEmpty(emptyData)) {
      addRecipeMobileView.renderErrorUploadData(emptyData);
      return;
    }

    if (!_.isEmpty(invalidURL)) {
      addRecipeMobileView.renderErrorURL(invalidURL);
      addRecipeMobileView.showMessage("Invalid URL");
      return;
    }

    addRecipeMobileView.renderInputBorderIngredients();

    if (!_.isEmpty(wrongFormatIng)) {
      addRecipeMobileView.renderErrorFormatIng(wrongFormatIng);
      // return;
    }

    //render spinner
    addRecipeMobileView.renderSpinner();

    //upload recipe
    await model.uploadRecipe(data);

    //remove spinner then show message
    addRecipeMobileView.showMessage("Uploaded Succesfully!");

    //render recipe
    recipeView.render(model.state.recipe);

    //close form
    addRecipeMobileView.closeAddRecipeForm();

    //render bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
  } catch (error) {
    console.log(error);
    addRecipeMobileView.showMessage(error);
  }
};

const controlAddIngredients = function (control) {
  model.controlIngredientCount(control);

  if (model.state.ingredientsCount >= 7) {
    addRecipeMobileView.renderDeleteIngredientBtn("show");
  }

  if (model.state.ingredientsCount === 6) {
    addRecipeMobileView.renderDeleteIngredientBtn("hide");
  }

  if (control === "add") {
    addRecipeMobileView.renderAddIngredients(model.state.ingredientsCount);
  }

  if (control === "delete") {
    addRecipeMobileView.renderDeleteIngredients();
  }
};

const init = function () {
  bookmarksView.addHandlerRender(bookmarksRender);
  shoppingListMobileView.addHandlerRender(shoppingListMobileRender);
  recipeView.addHandlerRender(controlRecipes);
  searchViewMobile.addHandlerSearch(controlSearchResults);
  navbarMobileActionView.addHandlerNavbarAction(navbarAction);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  recipeView.addHandlerShoppingList(controlShoppingListMobile);
  bookmarksView.addHandlerBookmarkMobileAction(bookmarkMobileAction);
  shoppingListMobileView.addHandlerShoppingListMobileAction(
    shoppingListMobileAction
  );
  addRecipeMobileView.addHandlerUpload(controlAddRecipe);
  addRecipeMobileView.addHandlerControlIngredients(controlAddIngredients);
};

init();

// //add hide css
// const addHide = function (element, classname) {
//   element.classList.add(classname);
// };

// //remove hide css
// const removeHide = function (element, classname) {
//   element.classList.remove(classname);
// };

// //change body and html overflow y
// const changeDocumentOverflow = function (body, html, action) {
//   body.style.overflowY = action;
//   html.style.overflowY = action;
// };

// render bookmark list function
// const renderBookmarkList = function (number) {
//   for (let i = 0; i < number; i++) {
//     addToBookmark("food-sample.png", "ARTICHOKE BREAD", "CLOSET COOKING");
//   }
// };

//add to bookmark function
// const addToBookmark = function (recipeImage, recipeName, recipeSite) {
//   let recipeToAdd = `<div class="bookmark-list">
//   <img src="delete-bookmark.5483584e.png" alt="delete-bookmark" class="delete-bookmark">
//   <img src="src/img/${recipeImage}" alt="food-sample" class="bookmark-food-sample">
//   <p class="recipe-name">${recipeName}</p>
//   <p class="recipe-site">${recipeSite}</p>
// </div>`;

//   //insert
//   bookmarkAction.insertAdjacentHTML("beforeend", recipeToAdd);
//   bookmarkDesktopAction.insertAdjacentHTML("beforeend", recipeToAdd);
// };

//delete a list from bookmark function
// const deleteBookmarkList = function (e) {
//   if (e.target.className !== "delete-bookmark") return;

//   e.target.closest("div").style.transform = "translateX(-30rem)";

//   setTimeout(() => {
//     e.target.closest("div").remove();
//   }, 500);
// };

//check search input field
// const ifSearchInputHasValue = function (element) {
//   return element.value !== "" ? true : false;
// };

// //show tooltip in search input
// const showSearchInputToolTip = function (element) {
//   element.classList.remove("hide");

//   setTimeout(() => {
//     element.classList.add("hide");
//   }, "1000");
// };

// recipe mobile scroll action
// if (recipeMobileScrollContainer) {
//   const recipeMobileScrollRight = function (number) {
//     recipeMobileScrollContainer.scrollLeft += number;
//   };

//   const recipeMobileScrollLeft = function (number) {
//     recipeMobileScrollContainer.scrollLeft -= number;
//   };

//   const firstRecipeCallback = (entries) => {
//     entries.forEach((entry) => {
//       if (!entry.isIntersecting) {
//         leftBtnScrollMobile.classList.remove("hide");
//       } else {
//         leftBtnScrollMobile.classList.add("hide");
//       }
//     });
//   };

//   const lastRecipeCallback = (entries) => {
//     entries.forEach((entry) => {
//       if (!entry.isIntersecting) {
//         rightBtnScrollMobile.classList.remove("hide");
//       } else {
//         rightBtnScrollMobile.classList.add("hide");
//       }
//     });
//   };

//   const firstRecipeObserver = new IntersectionObserver(firstRecipeCallback, {
//     root: recipeMobileScrollContainer,
//     rootMargin: "4000px 0px 4000px 0px",
//     threshold: 0.2,
//   });

//   const lastRecipeObserver = new IntersectionObserver(lastRecipeCallback, {
//     root: recipeMobileScrollContainer,
//     rootMargin: "4000px 0px 4000px 0px",
//     threshold: 0,
//   });

//   console.log(recipeContainer);
//   firstRecipeObserver.observe(firstRecipeContainer);
//   lastRecipeObserver.observe(lastRecipeContainer);

//   recipeMobileScrollContainer.addEventListener("click", function (e) {
//     const scrollContainerWidth = recipeMobileScrollContainer.offsetWidth;

//     if (e.target.classList.contains("fa-chevron-right")) {
//       recipeMobileScrollRight(scrollContainerWidth / 2 + 100);
//     } else if (e.target.classList.contains("fa-chevron-left")) {
//       recipeMobileScrollLeft(scrollContainerWidth / 2 + 100);
//     }
//   });
// }

//Recipe slider desktop
let isDown = false;
let startX;
let scrollLeft;

recipeMobileScrollContainer.addEventListener("mousedown", function (e) {
  isDown = true;
  startX = e.pageX - recipeMobileScrollContainer.offsetLeft;
  scrollLeft = recipeMobileScrollContainer.scrollLeft;
});
recipeMobileScrollContainer.addEventListener("mouseleave", function () {
  isDown = false;
});
recipeMobileScrollContainer.addEventListener("mouseup", function () {
  isDown = false;
});
recipeMobileScrollContainer.addEventListener("mousemove", function (e) {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - recipeMobileScrollContainer.offsetLeft;
  const walk = x - startX;
  recipeMobileScrollContainer.scrollLeft = scrollLeft - walk;
});

// bookmarkAction.addEventListener("click", deleteBookmarkList);
// bookmarkDesktopAction.addEventListener("click", deleteBookmarkList);

//close search container
// leaveSearch.addEventListener("click", function () {
//   addHide(searchContainer, "hide");
//   changeDocumentOverflow(body, html, "scroll");
// });

// closeBookmark.addEventListener("click", function () {
//   addHide(bookmarkContainer, "hide-container");
//   changeDocumentOverflow(body, html, "scroll");
// });

// closeShoppingList.addEventListener("click", function () {
//   addHide(shoppingListContainer, "hide-container");
//   addHide(hamburgerContainer, "hide-container");
//   changeDocumentOverflow(body, html, "scroll");
// });

// closeHamburger.addEventListener("click", function () {
//   addHide(hamburgerContainer, "hide-container");
//   changeDocumentOverflow(body, html, "scroll");

//   hamburgerChoices.forEach((choice) =>
//     addHide(choice, "hide-container-choice")
//   );
// });

// searchBtnMobile.addEventListener("click", function () {
//   const result = ifSearchInputHasValue(searchInputMobile);

//   result ? "fucntion for search" : showSearchInputToolTip(toolTipMobile);
// });

// shoppingListMobile.addEventListener("click", function () {
//   shoppingListContainer.classList.remove("hide-container");
// });

navigationMenuContainer.addEventListener("click", function (e) {
  if (e.target.className.includes("shopping-list-menu")) {
    removeHide(shoppingListDesktopSection, "hideVisibility");

    removeHide(
      shoppingListDesktopSection.firstElementChild,
      "hide-shopping-list"
    );

    changeDocumentOverflow(body, html, "hidden");
  }
});

shoppingListDesktopSection.addEventListener("click", function (e) {
  if (e.target.className !== "shopping-list-desktop-section") return;

  addHide(this.firstElementChild, "hide-shopping-list");
  addHide(this, "hideVisibility");
  changeDocumentOverflow(body, html, "auto");
});

// addToBookmark("food-sample.png", "ARTICHOKE BREAD", "CLOSET COOKING");

// renderBookmarkList(10);
