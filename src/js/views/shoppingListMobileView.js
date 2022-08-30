import DocumentView from "./documentView.js";
const fracty = require("fracty");

class shoppingListMobileView extends DocumentView {
  _parentElement = document.querySelector(".shopping-list-container");
  _hamburgerParent = document.querySelector(".hamburger-container");
  _shoppingListkMobileContainer = document.querySelector(
    ".shopping-list-section"
  );
  _btnClose = document.querySelector(".close-shopping-list-mobile");
  _btnOpen = document.querySelector(".shopping-list-mobile");
  _btnBack = document.querySelector(".leave-shopping-list-icon");
  _errorMessage = `<p class="no-bookmark">Nothing on the list yet. Find a nice recipe and add it to list. :) </p>`;

  constructor() {
    super();

    this.addHandlerToggleContainer();
    this.addHandlerClose();
  }

  renderMessage(message = this._errorMessage) {
    const markup = ` <div class="recipe-result-message">
    <p class="">${message}</p>
</div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _toggleContainer() {
    this._shoppingListkMobileContainer.classList.toggle("hide-container");
  }
  _toggleContainerandHamburger() {
    this._shoppingListkMobileContainer.classList.toggle("hide-container");
    this._hamburgerParent.classList.toggle("hide-container");
    this._changeDocumentOverflow("scroll");
  }

  //handler for shopping list btn
  addHandlerToggleContainer() {
    this._btnOpen.addEventListener("click", this._toggleContainer.bind(this));
    this._btnBack.addEventListener("click", this._toggleContainer.bind(this));
  }

  addHandlerClose() {
    this._btnClose.addEventListener(
      "click",
      this._toggleContainerandHamburger.bind(this)
    );
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerShoppingListMobileAction(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target;

      //if delete is clicked
      if (btn.className === "mobile-delete-shopping-list") {
        btn.closest("div").style.transition = "300ms ease-in-out";
        btn.closest("div").style.transform = "translateX(-30rem)";

        // //get the id
        const id = btn.closest(".mobile-shopping-list").dataset.recipeid;

        //call handler
        setTimeout(() => {
          handler(id);
        }, 700);

        // return;
        return;
      }

      //Recipe is clicked or close bookmark, show ingredients
      if (btn.closest(".mobile-shopping-list")) {
        btn
          .closest(".mobile-shopping-list")
          .nextElementSibling.classList.toggle("hide");
      }

      //if checkbox is clicked
      if (btn.className == "ingredients-checkbox") {
        btn.nextElementSibling.classList.toggle("ingredients-linethrough");
      }
    });
  }

  _generateMarkup() {
    const sample = this._data
      .map((recipe) => {
        return `<div class="mobile-shopping-list" data-recipeid="${recipe.id}">
        <img src="delete-bookmark.0dd1b387.png" alt="delete-bookmark" class="mobile-delete-shopping-list">
        <img src="${
          recipe.image
        }" alt="food-sample" class="mobile-shopping-list-food-sample">
        <p class="recipe-name">${recipe.title}</p>
        <p class="recipe-site">${recipe.publisher}</p>
    </div>

    <div class="mobile-ingeredients-list-container hide">
    <ul>
        ${recipe.ingredients
          .map((recipe) => {
            return ` <li><input type="checkbox" class="ingredients-checkbox">
          <label for="scales" class="ingredients-name">${
            !recipe.quantity ? "" : fracty(recipe.quantity).toString()
          } ${recipe.unit} ${recipe.description}</label>
      </li>`;
          })
          .join("")}
       
    </ul>
</div>
    `;
      })
      .join("");

    return sample;
  }
}

export default new shoppingListMobileView();
