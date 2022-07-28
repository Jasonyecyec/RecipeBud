import DocumentView from "./documentView";

class SearchViewMobile extends DocumentView {
  _parentElement = document.querySelector(".search-mobile-parent");
  _searchInput = this._parentElement.querySelector(".search-input-mobile");
  _searchContainer = document.querySelector(".search-container ");
  _leaveSearch = document.querySelector(".leave-search");

  constructor() {
    super();

    this.leaveSearch();
  }

  getQuery() {
    //get the input field value
    const query = this._searchInput.value;

    //clear the field
    this._clearInput();

    //return the input value
    return query;
  }

  _clearInput() {
    this._searchInput.value = "";
  }

  leaveSearchFunction() {
    this._addHide(this._searchContainer, "hide");
    this._changeDocumentOverflow("scroll");
  }

  leaveSearch() {
    this._leaveSearch.addEventListener(
      "click",
      this.leaveSearchFunction.bind(this)
    );
  }

  _showSearchInputToolTip = function () {
    const toolTipMobile = document.querySelector(".tooltip-mobile");

    toolTipMobile.classList.toggle("hide");

    setTimeout(() => {
      toolTipMobile.classList.toggle("hide");
    }, "1000");
  };

  //pass the parent method as a parameter
  addHandlerSearch(
    handler,
    addHide = this._addHide,
    changeDocuFlow = this._changeDocumentOverflow,
    searchContainer = this._searchContainer,
    searchValue = this._searchInput,
    showToolTip = this._showSearchInputToolTip
  ) {
    this._parentElement.addEventListener("submit", function (e) {
      //prevent reloading the page
      e.preventDefault();

      if (searchValue.value === "") {
        showToolTip();
        return;
      }

      //run handler callback
      handler();

      //call addHide callback from parent class
      addHide(searchContainer, "hide");

      //call changeDocuFlow callback from parent class
      changeDocuFlow("auto");
    });
  }
}

export default new SearchViewMobile();
