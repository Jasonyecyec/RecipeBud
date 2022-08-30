import DocumentView from "./documentView.js";

class AddRecipeMobileView extends DocumentView {
  _parentElement = document.querySelector(".add-recipe-container");
  _hamburgerParent = document.querySelector(".hamburger-container");
  _ingredientsContainer = document.querySelector(".ingredients-container");
  _controlIngredientsContainer = document.querySelector(
    ".control-ingredient-container"
  );
  _btnOpen = document.querySelector(".add-recipe");
  _form = document.querySelector(".add-recipe-form");
  _btnBack = document.querySelector(".leave-add-recipe-icon");
  _btnClose = document.querySelector(".close-add-recipe-mobile");

  constructor() {
    super();

    this.addHandlerToggleParent();
    this.addHandlerClose();
  }

  renderInputBorderData() {
    const collection = Object.entries(
      this._form.querySelectorAll("input")
    ).slice(0, 6);

    collection.forEach((element) => {
      element[1].style.border = ".1px solid #595959";
      element[1].placeholder = "Please input some data";
    });
  }

  renderSpinner() {
    const markup = `    <div class="add-recipe-spinner-container">
    <div class="recipe-spinner-container ">
        <img src="add-recipe-spinner.svg" alt="spinner" class="add-recipe-spinner">
    </div>
</div>`;

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  showMessage(message) {
    //remove spinner first
    const spinner = this._parentElement.querySelector(
      ".add-recipe-spinner-container"
    );

    if (spinner) {
      spinner.remove();
    }

    //show Message
    const messageContainer = this._parentElement.querySelector(
      ".add-recipe-message-container"
    );

    messageContainer.innerHTML = "";
    messageContainer.innerHTML = `<p>${message}</p>`;
    messageContainer.classList.add("show-add-recipe-message");

    //remove Message
    setTimeout(() => {
      messageContainer.classList.remove("show-add-recipe-message");
    }, 1500);
  }

  closeAddRecipeForm() {
    setTimeout(() => {
      this._addHide(this._parentElement, "hide-container");
      this._addHide(this._hamburgerParent, "hide-container");
      this._form.reset();
    }, 600);
  }

  renderInputBorderIngredients() {
    const collection = Object.entries(
      this._form.querySelectorAll("input")
    ).slice(6);

    collection.forEach((element) => {
      element[1].style.border = ".1px solid #595959";
    });
  }

  renderErrorUploadData(emptyData) {
    emptyData.forEach((element) => {
      document.getElementById(element).style.border = "1px solid red";
    });
  }

  renderErrorURL(invalidURL) {
    invalidURL.forEach((element) => {
      // document.getElementsByName(element[0]).style.border = "1px solid red";
      document.getElementById(element[0]).style.border = "1px solid red";
    });
  }

  renderErrorFormatIng(wrongIng) {
    wrongIng.forEach((element) => {
      const replacedElement = element.replace("-", "");
      document.getElementById(replacedElement).style.border = "1px solid red";
    });
  }

  _toggleParent() {
    this._parentElement.classList.toggle("hide-container");
  }
  _toggleParentandHamburger() {
    this._parentElement.classList.toggle("hide-container");
    this._hamburgerParent.classList.toggle("hide-container");
    this._changeDocumentOverflow("scroll");
  }

  addHandlerToggleParent() {
    this._btnOpen.addEventListener("click", this._toggleParent.bind(this));
    this._btnBack.addEventListener("click", this._toggleParent.bind(this));
  }

  addHandlerClose() {
    this._btnClose.addEventListener(
      "click",
      this._toggleParentandHamburger.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._form.addEventListener("submit", function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  renderDeleteIngredientBtn(control) {
    const deleteBtn = this._controlIngredientsContainer.querySelector(
      ".delete-ingredients"
    );

    if (control === "show") {
      if (!deleteBtn.classList.contains("hide")) {
        return;
      }
      deleteBtn.classList.remove("hide");
    }

    if (control === "hide") {
      deleteBtn.classList.add("hide");
    }
  }

  renderAddIngredients(number) {
    const markup = ` <div class="input-container">
    <label for="ingredient${number}">Ingredient ${number}</label>
    <input type="text" id="ingredient${number}" name="ingredient-${number}">
</div>
`;
    this._ingredientsContainer.insertAdjacentHTML("beforeend", markup);
  }

  renderDeleteIngredients() {
    this._ingredientsContainer.lastElementChild.remove();
  }

  addHandlerControlIngredients(handler) {
    this._controlIngredientsContainer.addEventListener("click", function (e) {
      if (!e.target.classList.contains("control-ingredients")) return;

      if (e.target.classList.contains("add-ingredients")) {
        handler("add");
      }

      if (e.target.classList.contains("delete-ingredients")) {
        handler("delete");
      }
    });
  }
}

export default new AddRecipeMobileView();
