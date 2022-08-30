import DocumentView from "./documentView.js";

class ResultsView extends DocumentView {
  _parentElement = document.querySelector(".recipe-mobile-scroll-container");

  _errorMessage = "No recipes found for your query! Please try again ";

  constructor() {
    super();

    this.addHandlerScrollRecipeMobile();
  }

  renderMessage(message = this._errorMessage) {
    const markup = ` <div class="recipe-result-message">
    <p class="">⚠ ${message}</p>
</div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  renderSpinner() {
    const markup = `<div class="recipe-spinner-container ">
    <img src="spinner.svg" alt="spinner" class="recipe-spinner">
</div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  showParent() {
    if (!this._parentElement.classList.contains("hide")) return;

    this._parentElement.classList.remove("hide");
  }

  observer() {
    const leftBtnScrollMobile = document.querySelector(".left-container");
    const rightBtnScrollMobile = document.querySelector(".right-container");

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
      root: this._parentElement,
      rootMargin: "4000px 0px 4000px 0px",
      threshold: 0.2,
    });

    const lastRecipeObserver = new IntersectionObserver(lastRecipeCallback, {
      root: this._parentElement,
      rootMargin: "4000px 0px 4000px 0px",
      threshold: 0,
    });

    const firstRecipeContainer = this._parentElement.children[2];
    const lastRecipeContainer =
      this._parentElement.children[this._parentElement.children.length - 1];

    firstRecipeObserver.observe(firstRecipeContainer);
    lastRecipeObserver.observe(lastRecipeContainer);
  }

  _scrollRecipeMobile(e) {
    const scrollContainerWidth = this._parentElement.offsetWidth;

    if (e.target.closest(".right-container")) {
      this._recipeMobileScrollRight(screen.width);
    } else if (e.target.closest(".left-container")) {
      this._recipeMobileScrollLeft(screen.width);
    }
  }

  addHandlerScrollRecipeMobile() {
    this._parentElement.addEventListener(
      "click",
      this._scrollRecipeMobile.bind(this)
    );
  }

  _recipeMobileScrollRight = function (number) {
    this._parentElement.scrollLeft += number;
  };

  _recipeMobileScrollLeft = function (number) {
    this._parentElement.scrollLeft -= number;
  };

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    let markup = `<div class="fa-chevron-container left-container">
        <i class="fa fa-solid fa-chevron-left "></i>
    </div>

    <div class="fa-chevron-container right-container">
      <i class="fa fa-solid fa-chevron-right"></i>
    </div>`;

    markup += this._data
      .map((recipe) => {
        return `<div class="recipe-container ${
          recipe.id === id ? "recipe-container-active" : ""
        }">
      <a href="#${recipe.id}">
          <p class="recipe-mobile-name">${recipe.title}</p>
          <p class="recipe-mobile-site">${recipe.publisher}</p>
          <img src="${recipe.image}" alt="" class="recipe-mobile-image">
      </a>
  
  </div>`;
      })
      .join("");

    return markup;
  }
}

export default new ResultsView();
