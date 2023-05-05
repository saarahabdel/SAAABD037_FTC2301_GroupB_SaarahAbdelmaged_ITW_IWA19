// Imports from other files.

import { 
    BOOKS_PER_PAGE,
    authors,
    genres,
    books,
} from "./data.js"

/**
 * fetching html elements using querySelectors and placing them in an object
 * @type {object}
 */
const html = {
    view: {
        mainHtml: document.querySelector('[data-list-items]'),
    },
    scroll: {
        moreButton: document.querySelector('[data-list-button]'),
    },
    preview: {
        summaryList: document.querySelectorAll('[data-preview]'),
        summaryOverlay: document.querySelector('[data-list-active]'),
        summaryBlur: document.querySelector('[data-list-blur]'),
        summaryImage: document.querySelector('[data-list-image]'),
        summaryTitle: document.querySelector('[data-list-title]'),
        summarySubTitle: document.querySelector('[data-list-subtitle]'),
        summaryDescription: document.querySelector('[data-list-description]'),
        summaryClose: document.querySelector('[data-list-close]'),
    },
    display: {
        settingsOverlay: document.querySelector('[data-settings-overlay]'),
        settingButton: document.querySelector('[data-header-settings]'),
        settingsTheme: document.querySelector('[data-settings-theme]'),
        settingsCancel: document.querySelector('[data-settings-cancel]'),
        settingsSubmit: document.querySelector('[data-settings-form]'),
    },
};

/**
 * Creates an html fragment given an object.
 * An input book object is selected and the author, id, title and image are extracted
 * via destructuring.
 * A template literate is used to create an html preview of the book.
 * 
 * @param {array} props is an object array with book properties.
 * @returns {HTMLElement} 
 **/
const createPreview = (props) => {
    const { author, image, title, id } = props;

    const newElement = document.createElement('button');
    newElement.className = 'preview';
    newElement.setAttribute('data-preview', id);

    newElement.innerHTML =  /* HTML */`
        <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
            </div>
        `

    return newElement;
};

/**
 * Creates a slice of specified length from the database of books.
 * This slice is then converted into a preview for each book using the createPreview
 * function.
 * The previe is appended to an htlm fragment and this fragment is returned.
 * 
 * @param {array} array is an object array of books with properties.
 * @param {number} start is a number denoting where to start slice.
 * @param {number} end is a number denoting where to end slice.
 * @return {HTMLElement} 
 * 
 */
const createPreviewsFragment = (array, start, end) => {

    const booksSlice = array.slice(start, end);

    let previewFragment = document.createDocumentFragment();

    for (let i = 0; i < booksSlice.length; i++) {

        let { author, image, title, id } = booksSlice[i];
        author = authors[author];

        const preview = {
            author,
            id,
            image,
            title,
        };
        previewFragment.appendChild(createPreview(preview));
    };
    return previewFragment;
};

/**
 * Determines the number of pages to travese on the app based on the total
 * number of books available in the database.
 * 
 * @param {array} array with total number of books.
 * @param {number} page current page.
 * @returns {number}
 */
const updateRemaining = (array, page) => {
    let remaining = array.length - (page * BOOKS_PER_PAGE);
    return remaining;
};

/**
 * Event function to show summary overlay after clicking preview button.
 * Add overlay information from the books object using template literals.
 * 
 * @param void
 * @returns no return.
 */
const showPreview = () => {
    /**
     * Node list of all preview buttons.
     * @type {NodeList}
     */
    const summaryList = document.querySelectorAll('[data-preview]');

    [...summaryList].forEach(function (buttons) {
         
        /**
         * Individual preview button.
         * @type {HTMLElement}
         */
        let summaryButton = buttons;
        summaryButton.addEventListener('click', () => {

            /**
             * Gets book id from the html elemnet's id attribute.
             * @type {string}
             */
            let summaryId = summaryButton.getAttribute('data-preview');

            /**
             * Book object with specified id extracted from books array.
             * @type {Object}
             */
            let searchBooks = books.find((book) => book.id === summaryId);

            const { author, image, title, description, published } = searchBooks;

            /**
             * Year of book publication.
             * @type {number}
             */
            let year = new Date(published).getFullYear();

            html.preview.summaryBlur.src = `${image}`;
            html.preview.summaryImage.src = `${image}`;
            html.preview.summaryTitle.innerHTML = `${title}`;
            html.preview.summarySubTitle.innerHTML = `${authors[author]} (${year})`;
            html.preview.summaryDescription.innerHTML = `${description}`;

            html.preview.summaryOverlay.showModal();
        });
    });
    html.preview.summaryClose.addEventListener('click', () => {
        html.preview.summaryOverlay.close();
    });
};

























/* -----------------------------------------------PAGE LOAD------------------------------------------*/

/**
 * Selects and displays the first 36 books from the books array.
 * Sets page number to 0 on page load.
 * Checks if books exists as the books array.
 */

/**
 * Array of range start and end. This range is the range of books to select from the books array on page load.
 * @type {Array}
 */
const range = [0, 36];

/**
 * Stores current page number.
 * @type {number}
 */
let page = 1;

/* Checks if books is not empty/undefined, and if it is an array.
 * Changed && to || because both are invalid. 
 */
if (!books || !Array.isArray(books)) throw new Error('Source required');

/* range is an array to check if range is within 0 - 36.
 * Change "< 2" to "=== 2" to avoid future errors.
 */
if (!range && range.length === 2) throw new Error('Range must be an array with two numbers');

/**
 * Blank document fragment which will be appended to the 
 * div with list items denoted by the 'data-list-items' attribute.
 * @type {HTMLElement}
 */
let fragment = createPreviewsFragment(books, 0, 36)

html.view.mainHtml.appendChild(fragment);

window.scrollTo({ top: 0, behavior: 'smooth' }); ///scroll to top on reload.



/* -------------------------------DISPLAY SETTINGS--------------------------- */ /* COMPLETED */

/**
 * The following sets display settings using the display settings button & overlay.
 * On page load, user system settings are checked and applied to webpage.
 * Creates an event to check if the display settings button is clicked. If clicked,
 * the display settings overlay is opened.
 * User settings are stored and applied to the css using the setProperty() method.
 * If the cancel button is closed, the overlay is closed and the form reset. 
 */


// Check darkmode/lightmode settings of user's system and assign them to the websites settings.
html.display.settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

/**
 * Saves color values for day and night settings.
 * @type {object} css
 */
const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20','255, 255, 255']
};

html.display.settingButton.addEventListener('click', () => {
    html.display.settingsOverlay.showModal();
});

html.display.settingsCancel.addEventListener('click', () => {
    html.display.settingsOverlay.close();
    html.display.settingsSubmit.reset();
});

html.display.settingsSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    /**
     * Collects settings form selection.
     * @type {object}
     */
    const formData = new FormData(event.target);
    
    /**
     * Stores entries from formData.
     * @type {object}
     */
    const selected = Object.fromEntries(formData);

    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0]);
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1]);        
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0]);
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1]);
    };

    html.display.settingsOverlay.close();
});


/* -----------------------------PAGE SCROLL--------------------------------- */  /* COMPLETED */

/**
 * The following allows scrolling down the list of books using a button to show more.
 * On page load, 36 pages are shown. 
 * Listens for an event on the show more button. If the event is fired, selects the next 36 books from
 * the books array and appends them as html fragments.
 * Updates the show more button to show the remaining books that have not been viewed.
 */

/**
 * Number of books remaining calculated using the page number.
 * @type {number}
 */
let pagesRemaining = books.length - (page * BOOKS_PER_PAGE);

html.scroll.moreButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${pagesRemaining > 0 ? pagesRemaining : 0})</span>
`;

html.scroll.moreButton.addEventListener('click', () => {
if (pagesRemaining <= 0) {
    html.scroll.moreButton.disabled;
}else {
    html.view.mainHtml.appendChild(createPreviewsFragment(books, (page * BOOKS_PER_PAGE), (page + 1) * BOOKS_PER_PAGE));
    page = page + 1;
    pagesRemaining = updateRemaining(books, page);

    html.scroll.moreButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${pagesRemaining > 0 ? pagesRemaining : 0})</span>
    `
    }
});


/* -------------------------------------PREVIEW OVERLAY--------------------------------*/ /* COMPLETED */

/**
 * Opens books summary overlay.
 */
showPreview();









