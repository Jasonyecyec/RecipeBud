import DocumentView from "./documentView";

class navbarMobileActionView extends DocumentView {
  _parentElement = document.querySelector(".navbar-icon");
  _searchContainer = document.querySelector(".search-container ");
  _bookmarkContainer = document.querySelector(".bookmark-mobile-container");
  _hamburgerContainer = document.querySelector(".hamburger-container");
  _closeHamburger = document.querySelector(".close-hamburger");
  _hamburgerChoices = document.querySelectorAll(".hamburger-choice");
  _classChoice = ["btn-search-home", "btn-bookmark-home", "btn-hamburger-home"];
  _className = { name: "" };

  constructor() {
    super();

    this.addHandlerClose();
  }

  getTargetClass() {
    return this._classChoice.includes(this._className.name);
  }

  showNavabarAction() {
    switch (this._className.name) {
      case this._classChoice[0]:
        this._removeHide(this._searchContainer, "hide");
        break;

      case this._classChoice[1]:
        this._removeHide(this._bookmarkContainer, "hide-container");
        break;

      case this._classChoice[2]:
        this._removeHide(this._hamburgerContainer, "hide-container");
        this._hamburgerChoices.forEach((choice) =>
          this._removeHide(choice, "hide-container-choice")
        );
        break;
    }

    this._changeDocumentOverflow("hidden");
  }

  addHandlerNavbarAction(handler, storeClass = this._className) {
    this._parentElement.addEventListener("click", function (e) {
      storeClass.name = e.target.className;

      handler();
    });
  }

  _closeHamburgerFunction() {
    this._addHide(this._hamburgerContainer, "hide-container");
    this._hamburgerChoices.forEach((choice) =>
      this._addHide(choice, "hide-container-choice")
    );

    this._changeDocumentOverflow("scroll");
  }

  addHandlerClose() {
    this._closeHamburger.addEventListener(
      "click",
      this._closeHamburgerFunction.bind(this)
    );
  }
}

export default new navbarMobileActionView();
