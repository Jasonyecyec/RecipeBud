const fracty = require("fracty");

import DocumentView from "./documentView";

class RecipeView extends DocumentView {
  _parentElement = document.querySelector("#parent-element");

  _errorMessage = "We could not find that recipe. Please try another one!";

  renderSpinner() {
    const markup = `<div class="spinner-container">
    <img src="spinner.svg" alt="spinner" class="spinner">
</div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    //listen for hashchange and load in url
    ["hashchange", "load"].forEach((el) => {
      window.addEventListener(el, handler);
    });
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".serving-button");

      //guard clause
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;

      handler(updateTo);
    });
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-add-bookmark");
      if (!btn) return;

      handler();
    });
  }

  addHandlerShoppingList(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".add-shopping-list-button");
      if (!btn) return;

      handler();
    });
  }

  renderMessage(message = this._errorMessage) {
    const markup = ` <div class="message">
    <p class="no-click-text">${message}</p>
</div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup() {
    return `    <!---------- FOOD IMAGE ------------->
    <div class="recipe-banner-container">
        <!-- Recipe image background -->
        <img src="${
          this._data.image
        }" alt="food-sample2" class="recipe-banner-image">

        <div class="recipe-name-container">
            <p class="recipe-name">${this._data.title}</p>
        </div>
    </div>

    <!-- recipe ingredients and buttons  -->
    <main class="main-content">

        <!----- RECIPE INGREDIENT ------>
        <div class="recipe-ingredients-container ">
            <!-- recipe ingredients title -->
            <p class="recipe-ingredients-title">RECIPE INGREDIENTS</p>

            <!-- recipe ingredients list -->
            <div class="recipe-ingredients-container-list">
                <ul>
                  ${this._data.ingredients
                    .map((ingredients) => {
                      return `<li class="recipe-ingredients-list"><i class="fa fa-solid fa-check"></i>${
                        !ingredients.quantity
                          ? ""
                          : fracty(ingredients.quantity).toString()
                      }
                      ${ingredients.unit} ${ingredients.description}</li>`;
                    })
                    .join(" ")}

                </ul>
            </div>
        </div>

        <!-- add to shopping list button -->
        <div class="add-shopping-list-container">
            <button class="add-shopping-list-button">${
              this._data.addedToList
                ? "Added to shopping list"
                : "Add to shopping list "
            }<img src=${
      this._data.addedToList
        ? "added-to-shop-list.png"
        : "btn-cart-icon.269c297b.png"
    }
                    alt="cart" class="btn-cart-icon"></button>
        </div>

        <!-- cooking minutes,servings,add bookmark  -->
        <div class="recipe-cooking-minutes-container">
            <p><img src="serving-time-icon.png" alt="serving-time-icon" class="serving-time-icon"><span
                    class="serving-time"><b>${
                      this._data.cookingTime
                    }</b></span>Minutes</p>

            <p><img src="serving-people-icon.png" alt="serving-people-icon"
                    class="serving-people-icon"><span class="serving-people">${
                      this._data.servings
                    }</span> Serving
                <button class="serving-button" data-update-to="${
                  this._data.servings > 1
                    ? this._data.servings - 1
                    : this._data.servings
                }">-</button> 
                <button class="serving-button" data-update-to="${
                  this._data.servings + 1
                }">+</button>
            </p>
            <button class="btn-add-bookmark"><img src="add-to-bookmark${
              this._data.bookmarked ? "-fill" : ".50998a83"
            }.png"
                    alt="add-to-bookmark-icon"></button>
        </div>

    </main>

    <!-- How to cook it Section  -->
    <section>
        <div class="how-to-cook-section ">
            <p class="how-to-cook-title">HOW TO COOK IT </p>
            <p class="how-to-cook-text">This recipe was carefully designed and tested by <span>${
              this._data.publisher
            }</span>.
                Please check out directions at
                their
                website.</p>
                <a href="${
                  this._data.sourceUrl
                }"><button class="how-to-cook-btn">
                DIRECTIONS <img src="direction-right.png" alt="direction-right"
                        class="direction-right"></button></a>

        </div>
    </section>
  `;
  }
}

export default new RecipeView();
