import DocumentView from "./documentView.js";

class BookmarksView extends DocumentView {
  _parentElement = document.querySelector(".bookmark-list-container");
  _bookmarkMobileContainer = document.querySelector(
    ".bookmark-mobile-container "
  );
  _errorMessage = `<p class="no-bookmark">No bookmarks yet. Find a nice recipe and bookmark it :) </p>`;

  renderMessage(message = this._errorMessage) {
    const markup = ` <div class="recipe-result-message">
    <p class="">${message}</p>
</div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerBookmarkMobileAction(
    handler,
    addHide = this._addHide,
    changeDocuFlow = this._changeDocumentOverflow
  ) {
    this._bookmarkMobileContainer.addEventListener("click", function (e) {
      const btn = e.target;

      //if delete is clicked
      if (btn.className === "delete-bookmark") {
        btn.closest("div").style.transition = "300ms ease-in-out";
        btn.closest("div").style.transform = "translateX(-30rem)";

        //get the recipe href then get the postition of '#'
        const position = btn.closest("a").href.search("#");

        //get the id
        const id = btn.closest("a").href.slice(position + 1);

        setTimeout(() => {
          handler(id);
        }, 700);

        return;
      }

      //Recipe is clicked or close bookmark
      if (
        btn.closest(".bookmark-list") ||
        btn.className === "close-bookmark-mobile"
      ) {
        addHide(this, "hide-container");
        changeDocuFlow("scroll");
      }
    });
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    const markup = this._data
      .map((recipe) => {
        return `
        <div class="bookmark-list ${
          recipe.id === id ? "recipe-container-active" : ""
        }">
        <a href="#${recipe.id}">
         <img src="delete-bookmark.0dd1b387.png" alt="delete-bookmark" class="delete-bookmark">
         <img src="${
           recipe.image
         }" alt="food-sample" class="bookmark-food-sample">
        <p class="recipe-name">${recipe.title}</p>
        <p class="recipe-site">${recipe.publisher}</p>
         </a>
        </div>
            `;
      })
      .join("");

    return markup;
  }
}

export default new BookmarksView();
