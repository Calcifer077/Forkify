// import icons from '../img/icons.svg'; // Parcel 1
import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} {render=true} If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if render is false
   * @this {Object} View instance
   * @author Mahesh
   */
  render(data, render = true) {
    // If there is no data OR if there is data check if it is a array and the length of array is 0
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // This will basically create a virtual DOM based on the 'newMarkup' that don't live on our browser but reside in our memory.
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Both of the below will return a node list which can be converted into array using 'Array.from'
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // isEqualNode is used to compare two nodes. Returns true or false based on the content of the node. In below line if the content of 'newEl' is equal to 'curEl' it will return true otherwise false.
      // console.log(curEl, newEl.isEqualNode(curEl));

      // 'nodeValue' is the property of nodes that is not not null for elements that contain text content
      // It says that don't do the following thing if the 'nodeValue' of a element is not text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('⚡⚡', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
            <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
            </div>
            `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}!</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}!</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
