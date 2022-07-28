export default class DocumentView {
  _data;

  _clear() {
    this._parentElement.innerHTML = "";
  }

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;

    //generate the latest markup
    const newMarkup = this._generateMarkup();

    //create a virtual DOM, then select all element of 'newElement' as an ARRAY,
    //same with the 'curElement'
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    /* loop through 'newElements' then compare with 'curElements' */
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //update changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue !== "") {
        // console.log(curEl);
        curEl.innerHTML = newEl.innerHTML;
      }

      //udpate change ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  //add hide css
  _addHide(element, classname) {
    element.classList.add(classname);
    // console.log(element);
  }

  //remove hide css
  _removeHide(element, classname) {
    element.classList.remove(classname);
  }

  //change body and html overflow y
  _changeDocumentOverflow(action) {
    document.querySelector("body").style.overflowY = action;
    document.querySelector("html").style.overflowY = action;
  }
}
